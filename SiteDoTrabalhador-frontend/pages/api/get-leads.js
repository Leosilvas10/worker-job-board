// API para listar leads capturados das candidaturas

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido' 
    })
  }

  try {
    // Buscar dados reais do backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    console.log('🔍 Tentando conectar ao backend:', backendUrl)
    
    let leadsReais = []
    try {
      const backendResponse = await fetch(`${backendUrl}/api/leads`)
      console.log('📡 Status da resposta do backend:', backendResponse.status)
      
      if (backendResponse.ok) {
        const backendData = await backendResponse.json()
        console.log('✅', backendData.leads?.length, 'leads reais carregados do backend')
        
        if (backendData.success && backendData.leads) {
          leadsReais = backendData.leads.map(lead => ({
            id: lead.id,
            nome: lead.nome,
            telefone: lead.telefone,
            email: lead.email,
            idade: lead.idade,
            cidade: lead.cidade,
            estado: lead.estado,
            vaga: {
              id: lead.vaga_id,
              titulo: lead.vaga_titulo,
              empresa: lead.empresa,
              localizacao: `${lead.cidade}, ${lead.estado}`
            },
            profissional: {
              trabalhouAntes: lead.trabalhou_antes === 'sim' || lead.trabalhou_antes === true,
              ultimoEmprego: lead.ultimo_emprego,
              tempoUltimoEmprego: lead.tempo_ultimo_emprego,
              motivoDemissao: lead.motivo_demissao,
              salarioAnterior: lead.salario_anterior,
              experienciaAnos: lead.experiencia_anos || 0,
              disponibilidade: lead.disponibilidade,
              pretensaoSalarial: lead.pretensao_salarial
            },
            observacoes: lead.observacoes || lead.mensagem,
            fonte: lead.fonte || 'site',
            utm: {
              source: lead.utm_source || '',
              medium: lead.utm_medium || '',
              campaign: lead.utm_campaign || ''
            },
            status: 'novo', // Status padrão para leads vindos do backend
            criadoEm: lead.data_criacao || new Date().toISOString(),
            contatado: false,
            convertido: false
          }))
        }
      }
    } catch (error) {
      console.log('Erro ao buscar leads do backend, usando dados de exemplo:', error.message)
    }

    // Dados de exemplo para demonstração (caso o backend esteja indisponível)
    const exemploLeads = [
      {
        id: 1,
        nome: 'Maria Silva Santos',
        telefone: '(11) 98765-4321',
        email: 'maria.santos@email.com',
        idade: 35,
        cidade: 'São Paulo',
        estado: 'SP',
        vaga: {
          id: 'job_1',
          titulo: 'Auxiliar de Limpeza',
          empresa: 'Empresa de Limpeza ABC',
          localizacao: 'São Paulo, SP'
        },
        profissional: {
          trabalhouAntes: true,
          ultimoEmprego: 'Diarista em residências',
          tempoUltimoEmprego: '2 anos',
          motivoDemissao: 'Família mudou de cidade',
          salarioAnterior: 'R$ 1.400,00',
          experienciaAnos: 8,
          disponibilidade: 'Integral',
          pretensaoSalarial: 'R$ 1.600,00'
        },
        observacoes: 'Tenho experiência com limpeza pesada e delicada',
        fonte: 'site',
        utm: {
          source: 'google',
          medium: 'organic',
          campaign: ''
        },
        status: 'novo',
        criadoEm: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        contatado: false,
        convertido: false
      },
      {
        id: 2,
        nome: 'João Carlos Oliveira',
        telefone: '(11) 97654-3210',
        email: 'joao.oliveira@email.com',
        idade: 42,
        cidade: 'São Paulo',
        estado: 'SP',
        vaga: {
          id: 'job_2',
          titulo: 'Porteiro',
          empresa: 'Condomínio Residencial',
          localizacao: 'São Paulo, SP'
        },
        profissional: {
          trabalhouAntes: true,
          ultimoEmprego: 'Segurança em shopping',
          tempoUltimoEmprego: '3 anos',
          motivoDemissao: 'Demitido sem justa causa - corte de custos',
          salarioAnterior: 'R$ 1.800,00',
          experienciaAnos: 12,
          disponibilidade: 'Escala 12x36',
          pretensaoSalarial: 'R$ 1.700,00'
        },
        observacoes: 'Experiência com controle de acesso e CFTV',
        fonte: 'site',
        utm: {
          source: 'facebook',
          medium: 'social',
          campaign: 'vagas-porteiro'
        },
        status: 'contatado',
        criadoEm: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
        contatado: true,
        convertido: false
      },
      {
        id: 3,
        nome: 'Ana Paula Costa',
        telefone: '(11) 96543-2109',
        email: 'ana.costa@email.com',
        idade: 28,
        cidade: 'Guarulhos',
        estado: 'SP',
        vaga: {
          id: 'job_3',
          titulo: 'Cuidadora de Idosos',
          empresa: 'Home Care Assistência',
          localizacao: 'São Paulo, SP'
        },
        profissional: {
          trabalhouAntes: true,
          ultimoEmprego: 'Auxiliar de enfermagem',
          tempoUltimoEmprego: '1 ano e 6 meses',
          motivoDemissao: 'Pediu demissão - busca melhor oportunidade',
          salarioAnterior: 'R$ 1.500,00',
          experienciaAnos: 5,
          disponibilidade: 'Plantão 24h',
          pretensaoSalarial: 'R$ 1.800,00'
        },
        observacoes: 'Curso técnico em enfermagem, experiência com idosos',
        fonte: 'whatsapp',
        utm: {
          source: 'whatsapp',
          medium: 'referral',
          campaign: ''
        },
        status: 'convertido',
        criadoEm: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
        contatado: true,
        convertido: true
      }
    ]

    // Priorizar leads reais do backend, com dados de exemplo como fallback
    let allLeads = []
    
    if (leadsReais.length > 0) {
      // Se temos leads reais do backend, usar eles
      allLeads = [...leadsReais]
      console.log(`✅ ${leadsReais.length} leads reais carregados do backend`)
    } else {
      // Fallback para dados de exemplo se backend indisponível
      allLeads = [...exemploLeads]
      console.log(`⚠️ Usando ${exemploLeads.length} leads de exemplo (backend indisponível)`)
    }

    // Estatísticas dos leads
    const stats = {
      total: allLeads.length,
      novos: allLeads.filter(lead => lead.status === 'novo').length,
      contatados: allLeads.filter(lead => lead.contatado).length,
      convertidos: allLeads.filter(lead => lead.convertido).length,
      hoje: allLeads.filter(lead => {
        const hoje = new Date().toDateString()
        const leadDate = new Date(lead.criadoEm).toDateString()
        return hoje === leadDate
      }).length,
      porFonte: {
        site: allLeads.filter(lead => lead.fonte === 'site').length,
        whatsapp: allLeads.filter(lead => lead.fonte === 'whatsapp').length,
        facebook: allLeads.filter(lead => lead.utm.source === 'facebook').length,
        google: allLeads.filter(lead => lead.utm.source === 'google').length
      },
      // Análise de demissões (dado valioso!)
      motivosDemissao: {
        'sem-justa-causa': allLeads.filter(lead => 
          lead.profissional.motivoDemissao?.toLowerCase().includes('demitido') ||
          lead.profissional.motivoDemissao?.toLowerCase().includes('justa causa')
        ).length,
        'pediu-demissao': allLeads.filter(lead => 
          lead.profissional.motivoDemissao?.toLowerCase().includes('pediu') ||
          lead.profissional.motivoDemissao?.toLowerCase().includes('saiu')
        ).length,
        'fim-contrato': allLeads.filter(lead => 
          lead.profissional.motivoDemissao?.toLowerCase().includes('contrato') ||
          lead.profissional.motivoDemissao?.toLowerCase().includes('temporário')
        ).length,
        'outros': allLeads.filter(lead => 
          lead.profissional.motivoDemissao && 
          !lead.profissional.motivoDemissao.toLowerCase().includes('demitido') &&
          !lead.profissional.motivoDemissao.toLowerCase().includes('pediu') &&
          !lead.profissional.motivoDemissao.toLowerCase().includes('contrato')
        ).length
      }
    }

    return res.status(200).json({
      success: true,
      leads: allLeads.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)), // Mais recentes primeiro
      stats: stats,
      message: `${allLeads.length} leads encontrados`
    })

  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error)
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao carregar leads',
      leads: [],
      stats: {},
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
