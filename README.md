# Portal de Fornecedores | Grupo Queiroz
Portal web para consulta de títulos em aberto e respectivos vencimentos por fornecedores.

## Requisitos

- Node.js 22, conforme definido em `.mise.toml`.
- npm.
- PostgreSQL acessível pela aplicação.

## Configuração local

### 1. Instalar as dependências
Na raiz do projeto, execute:

```
npm ci
```

### 2. Configurar as variáveis de ambiente
Crie o arquivo `.env.local` a partir do modelo disponibilizado:

```
cp .env.example .env.local
```
Configure as seguintes variáveis em `.env.local`:

- `PGHOST`: endereço do servidor PostgreSQL.
- `PGPORT`: porta de conexão com o PostgreSQL.
- `PGDATABASE`: nome do banco de dados.
- `PGUSER`: usuário de conexão com o banco.
- `PGPASSWORD`: senha do usuário do banco.
- `SESSION_SECRET`: segredo utilizado para proteger as sessões.
O `SESSION_SECRET` deve ser aleatório e possuir pelo menos 32 caracteres.

**Importante:** nunca envie o arquivo `.env.local` ao GitHub. Ele pode conter credenciais e outros dados sensíveis.

### 3. Criar as tabelas do banco de dados
Com o PostgreSQL acessível e as variáveis de conexão configuradas no ambiente, execute:

```
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f database/schema.sql
```
O arquivo `database/schema.sql` cria as tabelas necessárias conforme o esquema definido no projeto.

A criação das tabelas não cadastra automaticamente fornecedores, títulos ou usuários do portal. Esses dados precisam ser disponibilizados e cadastrados antes que os fornecedores possam autenticar-se na aplicação.

## Importação de dados
O script `scripts/importar-csv.py` permite importar dados de arquivos CSV locais utilizando `psql`.

O processo espera os seguintes arquivos na raiz do projeto:

- `consulta1_titulos.csv`
- `consulta2_especies.csv`
Também são necessárias as variáveis administrativas `PORTAL_ADMIN_USER` e `PORTAL_ADMIN_PASSWORD`, configuradas em `.env.local`.

Os arquivos CSV são ignorados pelo Git. Eles devem ser obtidos por um canal autorizado e não devem ser enviados ao repositório, pois podem conter informações financeiras.

### Usuário de teste
O script `scripts/criar-usuario-teste.mjs` é uma ferramenta administrativa que permite criar ou atualizar um usuário de teste.

O script utiliza um código de fornecedor fixo e **não deve ser utilizado como mecanismo de provisionamento de usuários em produção**.

## Executar e validar a aplicação

### Ambiente de desenvolvimento

```
npm run dev
```

### Compilação para produção

```
npm run build
```

### Executar em modo de produção
Após uma compilação bem-sucedida, execute:

```
npm start
```

### Verificação de saúde
O endpoint `/api/health` verifica a conexão da aplicação com o banco de dados.

## Publicação
Antes de publicar a aplicação, configure na plataforma de hospedagem as variáveis de ambiente necessárias para a conexão com o PostgreSQL e o `SESSION_SECRET`.

Verifique também a disponibilidade do banco de dados e a existência das tabelas e dos dados necessários à operação do portal.

A publicação do código no GitHub não provisiona automaticamente o PostgreSQL, não cria as tabelas e não importa os dados dos fornecedores e títulos.

## Repositório
Código-fonte: [https://github.com/mpmariapaula/portal-fornecedores-queiroz](https://github.com/mpmariapaula/portal-fornecedores-queiroz)

---

**Grupo Queiroz | Portal de Fornecedores**

Documentação técnica do projeto.
