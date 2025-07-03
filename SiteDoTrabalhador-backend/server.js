import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jobsStatsRouter from './api/jobs-stats.js';
import leadsRouter from './api/leads.js';
// Importe outras rotas conforme necessário

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

// Rotas
app.use('/api/jobs-stats', jobsStatsRouter);
app.use('/api/leads', leadsRouter);
// app.use('/api/OUTRA-ROTA', outraRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
