# 🚀 GUIA RÁPIDO DE TESTE - SITE DO TRABALHADOR

## 📋 CHECKLIST FINAL

### ✅ VERIFICAR ANTES DE TESTAR

1. **Arquivos principais criados/atualizados:**
   - ✅ `pages/api/simple-jobs.js` - 105 vagas únicas
   - ✅ `pages/api/all-jobs-combined.js` - Agregador
   - ✅ `pages/index.js` - Homepage com 6 vagas destaque
   - ✅ `pages/vagas.js` - Página completa
   - ✅ `api/leads.js` - Backend para captura

2. **Sem erros de sintaxe:**
   - ✅ Todos os arquivos validados
   - ✅ 105 IDs únicos (simple_001 a simple_105)
   - ✅ Estrutura JSON correta

## 🧪 COMO TESTAR

### 1. INICIAR SERVIÇOS

```bash
# Terminal 1 - Backend (Express)
cd SiteDoTrabalhador-backend
npm install
npm run dev
# Servidor: http://localhost:5000

# Terminal 2 - Frontend (Next.js)  
cd SiteDoTrabalhador-frontend
npm install
npm run dev
# Site: http://localhost:3000
```

### 2. TESTAR APIs DIRETAMENTE

**Via navegador ou Postman:**

```
GET http://localhost:3000/api/simple-jobs
- Deve retornar 105 vagas
- Status 200
- Campo "total": 105

GET http://localhost:3000/api/all-jobs-combined  
- Deve agregar todas as fontes
- Incluir as 105 vagas do simple-jobs
- Status 200

POST http://localhost:5000/api/leads
Content-Type: application/json
{
  "nome": "João Silva",
  "email": "joao@teste.com", 
  "telefone": "(11) 99999-9999",
  "vaga_titulo": "Porteiro Noturno",
  "vaga_id": "simple_016"
}
- Deve salvar no banco
- Status 200
```

### 3. TESTAR INTERFACE

**Homepage (http://localhost:3000):**
- ✅ Carrega 6 vagas em destaque
- ✅ Botão "Ver Todas as Vagas" funciona
- ✅ Modal de candidatura abre ao clicar "Candidatar-se"

**Página de Vagas (http://localhost:3000/vagas):**
- ✅ Exibe todas as 105+ vagas
- ✅ Filtros funcionam (categoria, salário, etc.)
- ✅ Paginação funciona
- ✅ Modal de candidatura funciona

**Modal de Candidatura:**
- ✅ Formulário completo aparece
- ✅ Validação de campos obrigatórios
- ✅ Envio para backend funciona
- ✅ Mensagem de sucesso aparece

### 4. VERIFICAR DADOS

**Categorias esperadas:**
- 🏠 Doméstica (20 vagas)
- 🚪 Portaria (15 vagas) 
- 🛒 Vendas (25 vagas)
- 🍽️ Alimentação (20 vagas)
- 🚛 Transporte (20 vagas)
- 🧹 Outros (5 vagas)

**Cidades cobertas:** 27 capitais brasileiras

**Faixa salarial:** R$ 1.200 - R$ 4.000

### 5. PROBLEMAS COMUNS E SOLUÇÕES

❌ **"API não carrega"**
✅ Verificar se ambos servidores estão rodando
✅ Verificar portas 3000 (frontend) e 5000 (backend)

❌ **"Vagas não aparecem"**  
✅ Verificar console do navegador (F12)
✅ Verificar se API retorna status 200

❌ **"Modal não funciona"**
✅ Verificar se backend está rodando
✅ Verificar endpoint /api/leads

❌ **"Erro de CORS"**
✅ Verificar headers no all-jobs-combined.js
✅ Reiniciar servidores

### 6. COMANDOS ÚTEIS DE DEBUG

```bash
# Verificar se APIs estão funcionando
curl http://localhost:3000/api/simple-jobs
curl http://localhost:3000/api/all-jobs-combined

# Verificar logs em tempo real
cd SiteDoTrabalhador-frontend && npm run dev
# Olhar console do terminal

# Verificar banco de dados (se SQLite)
cd SiteDoTrabalhador-backend
sqlite3 database.db ".tables"
sqlite3 database.db "SELECT COUNT(*) FROM leads;"
```

### 7. MÉTRICAS DE SUCESSO

**✅ Teste passou se:**
- Homepage carrega com 6 vagas
- Página de vagas mostra 105+
- Modal abre e fecha corretamente
- Candidatura é salva no backend
- Não há erros 404/500 nas APIs
- Interface é responsiva (mobile/desktop)

### 8. DEPLOY EM PRODUÇÃO

**Quando tudo estiver testado:**

```bash
# Build de produção
cd SiteDoTrabalhador-frontend
npm run build
npm start

# Configurar variáveis de ambiente
# DATABASE_URL=production_database
# API_URL=https://seu-dominio.com
```

---

## 🎯 RESULTADO ESPERADO

**Ao final dos testes você deve ter:**
- ✅ Site carregando com 105+ vagas reais
- ✅ Sistema de candidaturas funcionando
- ✅ Dados sendo salvos no backend
- ✅ Interface responsiva e moderna
- ✅ Foco total no público de empregos simples

**Em caso de problemas, verificar:**
1. Logs do terminal
2. Console do navegador (F12)
3. Status das APIs
4. Configuração de portas

**Data:** 3 de julho de 2025
**Status:** ✅ PRONTO PARA TESTE
