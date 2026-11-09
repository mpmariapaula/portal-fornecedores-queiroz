
CREATE TABLE IF NOT EXISTS fornecedores (
    seqpessoa INTEGER PRIMARY KEY,
    nomerazao VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS especies (
    codespecie VARCHAR(30) PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    obrigdireito CHAR(1) NOT NULL
        CHECK (obrigdireito IN ('D', 'O'))
);

CREATE TABLE IF NOT EXISTS titulos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seqpessoa INTEGER NOT NULL
        REFERENCES fornecedores(seqpessoa),
    seqtitulo BIGINT NOT NULL,
    codespecie VARCHAR(30) NOT NULL
        REFERENCES especies(codespecie),
    dtaemissao DATE NOT NULL,
    dtavencimento DATE NOT NULL,
    vlrnominal NUMERIC(14, 2) NOT NULL
        CHECK (vlrnominal >= 0),
    vlrpago NUMERIC(14, 2) NOT NULL
        CHECK (vlrpago >= 0),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_titulo_fornecedor
        UNIQUE (seqpessoa, seqtitulo),

    CONSTRAINT ck_valor_pago
        CHECK (vlrpago <= vlrnominal)
);

CREATE TABLE IF NOT EXISTS usuarios_portal (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seqpessoa INTEGER NOT NULL UNIQUE
        REFERENCES fornecedores(seqpessoa),
    senha_hash TEXT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_titulos_fornecedor_vencimento
    ON titulos (seqpessoa, dtavencimento);

CREATE INDEX IF NOT EXISTS idx_titulos_especie
    ON titulos (codespecie);
