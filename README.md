# Portal de Fornecedores | Grupo Queiroz

Portal web para fornecedores consultarem títulos em aberto e vencimentos.

## Requisitos

- Node.js 22 (versão definida em `.mise.toml`)
- npm
- PostgreSQL acessível pela aplicação

## Configuração local

1. Instale as dependências:

   ```sh
   npm ci
   ```

2. Crie `.env.local` a partir do modelo:

   ```sh
   cp .env.example .env.local
   ```

3. Configure `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` e
   `SESSION_SECRET` em `.env.local`. O segredo de sessão deve ser aleatório e
   ter pelo menos 32 caracteres. Nunca envie `.env.local` ao GitHub.

4. Crie as tabelas no banco:

   ```sh
   psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
     -f database/schema.sql
   ```

   O esquema cria as tabelas, mas não inclui dados de fornecedores ou títulos.
   A aplicação só poderá autenticar fornecedores depois que os dados e os
   usuários do portal forem cadastrados.

## Importação de dados

O script `scripts/importar-csv.py` importa dados de arquivos CSV locais usando
`psql`. Ele espera `consulta1_titulos.csv` e `consulta2_especies.csv` na raiz
do projeto e as variáveis administrativas `PORTAL_ADMIN_USER` e
`PORTAL_ADMIN_PASSWORD` em `.env.local`. Esses CSVs são ignorados pelo Git;
obtenha-os por um canal autorizado e não os envie ao repositório, pois podem
conter dados financeiros.

O script `scripts/criar-usuario-teste.mjs` é uma ferramenta administrativa
para criar ou atualizar um usuário de teste. Ele usa um código de fornecedor
fixo e não deve ser usado como fluxo de provisionamento em produção.

## Executar e validar

```sh
npm run dev
npm run build
npm start
```

O endpoint `/api/health` verifica a conexão com o banco de dados.

## Publicação

Configure as variáveis de ambiente do banco e `SESSION_SECRET` na plataforma
de hospedagem antes de publicar. A publicação do código no GitHub, por si só,
não provisiona o PostgreSQL nem popula as tabelas.