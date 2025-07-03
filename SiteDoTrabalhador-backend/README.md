# SiteDoTrabalhador Backend (Express)

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário.
3. Inicie o servidor:
   ```bash
   npm start
   ```

O backend ficará disponível em `http://localhost:3001` (ou porta definida no `.env`).

## Rotas principais
- `GET /api/jobs-stats` — Estatísticas de vagas
- `POST /api/leads` — Cadastro de leads

## Deploy na Render
- Crie um novo serviço Node.js na Render.
- Configure as variáveis de ambiente conforme seu `.env`.
- O comando de start deve ser: `npm start`

## Observações
- Adicione outras rotas em `/api` conforme necessário.
- Implemente a lógica real de banco de dados e autenticação conforme seu projeto.
