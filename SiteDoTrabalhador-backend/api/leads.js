import express from 'express';
import db from '../database.js';

const router = express.Router();

// POST /api/leads - Criar novo lead
router.post('/', async (req, res) => {
  try {
    const {
      nome, email, telefone, empresa, vaga_titulo, vaga_id,
      trabalhou_antes, ultimo_emprego, tempo_ultimo_emprego,
      motivo_demissao, salario_anterior, experiencia_anos,
      idade, cidade, estado, disponibilidade, pretensao_salarial,
      observacoes, mensagem, fonte, utm_source, utm_medium, utm_campaign
    } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome e email são obrigatórios!' 
      });
    }

    const stmt = db.prepare(`
      INSERT INTO leads (
        nome, email, telefone, empresa, vaga_titulo, vaga_id,
        trabalhou_antes, ultimo_emprego, tempo_ultimo_emprego,
        motivo_demissao, salario_anterior, experiencia_anos,
        idade, cidade, estado, disponibilidade, pretensao_salarial,
        observacoes, mensagem, fonte, utm_source, utm_medium, utm_campaign
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run([
      nome, email, telefone || '', empresa || '', vaga_titulo || '', vaga_id || '',
      trabalhou_antes || '', ultimo_emprego || '', tempo_ultimo_emprego || '',
      motivo_demissao || '', salario_anterior || '', experiencia_anos || 0,
      idade || null, cidade || '', estado || '', disponibilidade || '', pretensao_salarial || '',
      observacoes || '', mensagem || '', fonte || 'site', utm_source || '', utm_medium || '', utm_campaign || ''
    ]);

    // Atualizar estatísticas do dia
    const hoje = new Date().toISOString().split('T')[0];
    const updateStats = db.prepare(`
      INSERT OR REPLACE INTO estatisticas_diarias (data, leads_novos, candidaturas)
      VALUES (?, COALESCE((SELECT leads_novos FROM estatisticas_diarias WHERE data = ?), 0) + 1,
                 COALESCE((SELECT candidaturas FROM estatisticas_diarias WHERE data = ?), 0) + 1)
    `);
    updateStats.run([hoje, hoje, hoje]);

    res.json({ 
      success: true, 
      message: 'Lead salvo com sucesso!',
      leadId: info.lastInsertRowid
    });

  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// GET /api/leads - Listar todos os leads
router.get('/', async (req, res) => {
  try {
    db.all('SELECT * FROM leads ORDER BY data_criacao DESC', (err, rows) => {
      if (err) {
        console.error('Erro ao buscar leads:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Erro ao buscar leads' 
        });
      }

      res.json({ 
        success: true, 
        leads: rows 
      });
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// GET /api/leads/:id - Buscar lead específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    db.get('SELECT * FROM leads WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar lead:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Erro ao buscar lead' 
        });
      }

      if (!row) {
        return res.status(404).json({ 
          success: false, 
          message: 'Lead não encontrado' 
        });
      }

      res.json({ 
        success: true, 
        lead: row 
      });
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

export default router;
