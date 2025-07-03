// API para capturar leads de candidatos que se candidatam às vagas

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido' 
    })
  }

  try {
    const {
      // Dados pessoais
      nome,
      telefone,
      email,
      idade,
      cidade,
      estado,
      
      // Dados da vaga
      vagaId,
      vagaTitulo,
      vagaEmpresa,
      vagaLocalizacao,
      
      // Dados sobre trabalho anterior (para análise de demissão)
      trabalhouAntes,
      ultimoEmprego,
      tempoUltimoEmprego,
      motivoDemissao,
      salarioAnterior,
      experienciaAnos,
      
      // Dados complementares
      disponibilidade,
      pretensaoSalarial,
      observacoes,
      
      // Dados de rastreamento
      fonte,
      utm_source,
      utm_medium,
      utm_campaign
    } = req.body

    // Validações básicas
    if (!nome || !telefone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nome, telefone e email são obrigatórios'
      })
    }

    // Criar objeto do lead
    const leadData = {
      id: Date.now(), // ID simples para desenvolvimento
      
      // Dados pessoais
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim().toLowerCase(),
      idade: idade || null,
      cidade: cidade || '',
      estado: estado || '',
      
      // Dados da vaga
      vaga: {
        id: vagaId,
        titulo: vagaTitulo,
        empresa: vagaEmpresa,
        localizacao: vagaLocalizacao
      },
      
      // Dados profissionais (chave para análise)
      profissional: {
        trabalhouAntes: trabalhouAntes || false,
        ultimoEmprego: ultimoEmprego || '',
        tempoUltimoEmprego: tempoUltimoEmprego || '',
        motivoDemissao: motivoDemissao || '',
        salarioAnterior: salarioAnterior || '',
        experienciaAnos: experienciaAnos || 0,
        disponibilidade: disponibilidade || '',
        pretensaoSalarial: pretensaoSalarial || ''
      },
      
      // Metadados
      observacoes: observacoes || '',
      fonte: fonte || 'site',
      utm: {
        source: utm_source || '',
        medium: utm_medium || '',
        campaign: utm_campaign || ''
      },
      
      // Status e timestamps
      status: 'novo',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      contatado: false,
      convertido: false
    }

    // Em produção, salvar no banco de dados
    // Para desenvolvimento, vou simular salvamento
    console.log('💾 Novo lead capturado:', {
      nome: leadData.nome,
      vaga: leadData.vaga.titulo,
      motivoDemissao: leadData.profissional.motivoDemissao,
      fonte: leadData.fonte
    })

    // Simular salvamento no "banco de dados" (localStorage para desenvolvimento)
    if (typeof window !== 'undefined') {
      const existingLeads = JSON.parse(localStorage.getItem('captured_leads') || '[]')
      existingLeads.push(leadData)
      localStorage.setItem('captured_leads', JSON.stringify(existingLeads))
    }

    // Em produção, você pode integrar com:
    // - Google Sheets
    // - CRM (HubSpot, Pipedrive, etc.)
    // - Email marketing (Mailchimp, etc.)
    // - WhatsApp Business API
    // - Banco de dados (PostgreSQL, MongoDB, etc.)

    return res.status(200).json({
      success: true,
      message: 'Candidatura enviada com sucesso! Entraremos em contato em breve.',
      data: {
        leadId: leadData.id,
        nome: leadData.nome,
        vaga: leadData.vaga.titulo
      }
    })

  } catch (error) {
    console.error('❌ Erro ao processar candidatura:', error)
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
