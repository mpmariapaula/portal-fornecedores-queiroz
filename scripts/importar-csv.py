
import csv
import os
import subprocess
from decimal import Decimal
from pathlib import Path


RAIZ = Path(__file__).resolve().parent.parent
ARQUIVO_TITULOS = RAIZ / "consulta1_titulos.csv"
ARQUIVO_ESPECIES = RAIZ / "consulta2_especies.csv"
ARQUIVO_ENV = RAIZ / ".env.local"


def carregar_env():
    configuracao = {}

    for linha in ARQUIVO_ENV.read_text(encoding="utf-8").splitlines():
        linha = linha.strip()

        if not linha or linha.startswith("#") or "=" not in linha:
            continue

        chave, valor = linha.split("=", 1)
        configuracao[chave.strip()] = valor.strip().strip("'\"")

    return configuracao


def ler_csv(caminho):
    with caminho.open(encoding="utf-8-sig", newline="") as arquivo:
        return list(csv.DictReader(arquivo, delimiter=";"))


def sql_texto(valor):
    return "'" + str(valor).replace("'", "''") + "'"


def sql_data(valor):
    dia, mes, ano = valor.split("/")
    return f"'{ano}-{mes}-{dia}'::DATE"


def sql_decimal(valor):
    numero = Decimal(valor.replace(".", "").replace(",", "."))
    return str(numero)


def executar():
    env = carregar_env()

    obrigatorias = [
        "PGHOST",
        "PGPORT",
        "PGDATABASE",
        "PORTAL_ADMIN_USER",
        "PORTAL_ADMIN_PASSWORD",
    ]

    ausentes = [chave for chave in obrigatorias if not env.get(chave)]

    if ausentes:
        raise ValueError(
            "Variáveis ausentes no .env.local: " + ", ".join(ausentes)
        )

    titulos = ler_csv(ARQUIVO_TITULOS)
    especies = ler_csv(ARQUIVO_ESPECIES)

    if not titulos or not especies:
        raise ValueError("Um dos CSVs está vazio.")

    codigos_especies = {e["codespecie"] for e in especies}

    for titulo in titulos:
        if titulo["codespecie"] not in codigos_especies:
            raise ValueError(
                f"Espécie não encontrada: {titulo['codespecie']}"
            )

        nominal = Decimal(titulo["vlrnominal"].replace(",", "."))
        pago = Decimal(titulo["vlrpago"].replace(",", "."))

        if nominal < 0 or pago < 0 or pago > nominal:
            raise ValueError(
                f"Valores inválidos no título {titulo['seqtitulo']}."
            )

    fornecedores = {}

    for titulo in titulos:
        codigo = int(titulo["seqpessoa"])
        nome = titulo["nomerazao"]

        if codigo in fornecedores and fornecedores[codigo] != nome:
            raise ValueError(
                f"Nomes divergentes para o fornecedor {codigo}."
            )

        fornecedores[codigo] = nome

    comandos = ["BEGIN;"]

    for codigo, nome in fornecedores.items():
        comandos.append(
            "INSERT INTO fornecedores (seqpessoa, nomerazao) "
            f"VALUES ({codigo}, {sql_texto(nome)}) "
            "ON CONFLICT (seqpessoa) DO UPDATE "
            "SET nomerazao = EXCLUDED.nomerazao;"
        )

    for especie in especies:
        obrigacao = especie["obrigdireito"]

        if obrigacao not in ("D", "O"):
            raise ValueError(
                f"Classificação inválida para {especie['codespecie']}."
            )

        comandos.append(
            "INSERT INTO especies (codespecie, descricao, obrigdireito) "
            f"VALUES ({sql_texto(especie['codespecie'])}, "
            f"{sql_texto(especie['descricao'])}, "
            f"{sql_texto(obrigacao)}) "
            "ON CONFLICT (codespecie) DO UPDATE SET "
            "descricao = EXCLUDED.descricao, "
            "obrigdireito = EXCLUDED.obrigdireito;"
        )

    for titulo in titulos:
        codigo = int(titulo["seqpessoa"])
        numero = int(titulo["seqtitulo"])
        especie = sql_texto(titulo["codespecie"])
        emissao = sql_data(titulo["dtaemissao"])
        vencimento = sql_data(titulo["dtavencimento"])
        nominal = sql_decimal(titulo["vlrnominal"])
        pago = sql_decimal(titulo["vlrpago"])

        comandos.append(
            "INSERT INTO titulos "
            "(seqpessoa, seqtitulo, codespecie, dtaemissao, "
            "dtavencimento, vlrnominal, vlrpago) VALUES "
            f"({codigo}, {numero}, {especie}, {emissao}, "
            f"{vencimento}, {nominal}, {pago}) "
            "ON CONFLICT (seqpessoa, seqtitulo) DO UPDATE SET "
            "codespecie = EXCLUDED.codespecie, "
            "dtaemissao = EXCLUDED.dtaemissao, "
            "dtavencimento = EXCLUDED.dtavencimento, "
            "vlrnominal = EXCLUDED.vlrnominal, "
            "vlrpago = EXCLUDED.vlrpago;"
        )

    comandos.append("COMMIT;")

    ambiente = os.environ.copy()
    ambiente["PGPASSWORD"] = env["PORTAL_ADMIN_PASSWORD"]

    resultado = subprocess.run(
        [
            "psql",
            "-X",
            "-v",
            "ON_ERROR_STOP=1",
            "-h",
            env["PGHOST"],
            "-p",
            env["PGPORT"],
            "-U",
            env["PORTAL_ADMIN_USER"],
            "-d",
            env["PGDATABASE"],
        ],
        input="\n".join(comandos),
        text=True,
        capture_output=True,
        env=ambiente,
        cwd=RAIZ,
    )

    if resultado.returncode != 0:
        print(resultado.stderr)
        raise RuntimeError(
            "Importação não concluída. Verifique o erro acima."
        )

    print("Importação concluída com sucesso.")
    print(f"Fornecedores processados: {len(fornecedores)}")
    print(f"Espécies processadas: {len(especies)}")
    print(f"Títulos processados: {len(titulos)}")


if __name__ == "__main__":
    executar()
