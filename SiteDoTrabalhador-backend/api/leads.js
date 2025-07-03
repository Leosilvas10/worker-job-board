import express from 'express';
const router = express.Router();

// POST /api/leads
router.post('/', async (req, res) => {
  const { nome, email, mensagem } = req.body;
  // TODO: Salve no banco de dados ou arquivo
  // Exemplo de resposta:
  res.json({ success: true, message: 'Lead salvo com sucesso!' });
});

export default router;
