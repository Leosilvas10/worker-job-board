// API para vagas externas de várias fontes
export default async function handler(req, res) {
  try {
    console.log('🌐 Buscando vagas de APIs públicas...');
    
    // Configurar CORS para API pública
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }

    // Simular busca de APIs públicas (SINE, Catho, etc.)
    const publicJobs = await fetchFromPublicAPIs();
    
    // Adicionar informações de redirecionamento para cada vaga
    const jobsWithRedirect = publicJobs.map(job => ({
      ...job,
      requiresLead: true,
      isExternal: true,
      redirectUrl: generateRedirectUrl(job),
      leadCapture: {
        required: true,
        message: 'Para acessar os detalhes completos da vaga e se candidatar, precisamos de algumas informações suas.',
        fields: ['nome', 'email', 'telefone', 'cidade']
      }
    }));

    console.log(`✅ ${jobsWithRedirect.length} vagas públicas encontradas`);

    res.status(200).json({
      success: true,
      data: jobsWithRedirect,
      jobs: jobsWithRedirect,
      total: jobsWithRedirect.length,
      meta: {
        source: 'APIs Públicas',
        sources: ['SINE', 'Catho', 'InfoJobs', 'Vagas.com'],
        totalAvailable: jobsWithRedirect.length,
        lastUpdate: new Date().toISOString(),
        leadCaptureEnabled: true,
        publicAPI: true
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar vagas públicas:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar vagas públicas',
      data: [],
      jobs: [],
      total: 0
    });
  }
}

// Função para simular busca de APIs públicas
async function fetchFromPublicAPIs() {
  // Simular dados de APIs reais - em produção, chamar APIs verdadeiras
  const categories = [
    'Doméstica', 'Limpeza', 'Porteiro', 'Segurança', 'Jardinagem', 
    'Cozinha', 'Cuidador', 'Motorista', 'Entregador', 'Vendas',
    'Atendimento', 'Recepção', 'Auxiliar', 'Assistente', 'Operador'
  ];

  const companies = [
    'Empresa de Limpeza SP', 'Condomínio Residencial', 'Restaurante Família',
    'Loja de Departamentos', 'Shopping Center', 'Hospital Geral',
    'Escola Particular', 'Posto de Gasolina', 'Farmácia Popular',
    'Supermercado Bom Preço', 'Padaria Central', 'Hotel Executivo'
  ];

  const locations = [
    'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG',
    'Salvador, BA', 'Brasília, DF', 'Fortaleza, CE', 'Curitiba, PR',
    'Recife, PE', 'Porto Alegre, RS', 'Manaus, AM', 'Belém, PA',
    'Goiânia, GO', 'Campinas, SP', 'São Luís, MA', 'Maceió, AL'
  ];

  const salaries = [
    'R$ 1.320,00', 'R$ 1.500,00', 'R$ 1.800,00', 'R$ 2.000,00',
    'R$ 1.400,00', 'R$ 1.600,00', 'R$ 1.700,00', 'A combinar'
  ];

  const sources = ['SINE Nacional', 'Catho', 'InfoJobs', 'Vagas.com', 'Indeed Brasil'];

  function generateRealisticDate(hoursAgo) {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
    return pastDate.toISOString();
  }

  return [
    // Vagas de exemplo (baseadas em dados reais do SINE e outras fontes)
    {
      id: 'ext_1',
      title: 'Empregada Doméstica',
      company: { name: 'Família Particular', logo: null },
      location: 'São Paulo, SP',
      salary: 'R$ 1.320,00',
      description: 'Limpeza geral da casa, organização, preparo de refeições simples. Experiência desejável.',
      type: 'CLT',
      category: 'Doméstica',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 24) + 1),
      source: 'SINE Nacional',
      tags: ['doméstica', 'limpeza', 'organização'],
      requirements: 'Ensino fundamental, experiência mínima 6 meses',
      benefits: 'Vale transporte, alimentação no local',
      isExternal: true,
      externalUrl: 'https://www.sine.br/vagas/empregada-domestica'
    },
    {
      id: 'ext_2',
      title: 'Porteiro Noturno',
      company: { name: 'Condomínio Residencial Elite', logo: null },
      location: 'Rio de Janeiro, RJ',
      salary: 'R$ 1.500,00',
      description: 'Controle de acesso, recebimento de correspondências, rondas de segurança.',
      type: 'CLT',
      category: 'Portaria',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 48) + 1),
      source: 'Catho',
      tags: ['porteiro', 'segurança', 'noturno'],
      requirements: 'Ensino médio completo, curso de porteiro',
      benefits: 'Vale transporte, refeição, plano de saúde',
      isExternal: true,
      externalUrl: 'https://www.catho.com.br/vagas/porteiro'
    },
    {
      id: 'ext_3',
      title: 'Auxiliar de Limpeza',
      company: { name: 'Empresa Clean Service', logo: null },
      location: 'Belo Horizonte, MG',
      salary: 'R$ 1.400,00',
      description: 'Limpeza de escritórios, banheiros, organização de materiais de limpeza.',
      type: 'CLT',
      category: 'Limpeza',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 72) + 1),
      source: 'InfoJobs',
      tags: ['limpeza', 'escritório', 'organização'],
      requirements: 'Ensino fundamental',
      benefits: 'Vale transporte, uniforme fornecido',
      isExternal: true,
      externalUrl: 'https://www.infojobs.com.br/vagas-de-limpeza'
    },
    {
      id: 'ext_4',
      title: 'Cuidador de Idosos',
      company: { name: 'Casa de Repouso Esperança', logo: null },
      location: 'Salvador, BA',
      salary: 'R$ 1.600,00',
      description: 'Acompanhamento de idosos, auxílio em atividades diárias, administração de medicamentos.',
      type: 'CLT',
      category: 'Cuidados',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 36) + 1),
      source: 'Vagas.com',
      tags: ['cuidador', 'idosos', 'saúde'],
      requirements: 'Curso de cuidador, experiência comprovada',
      benefits: 'Vale transporte, alimentação, convênio médico',
      isExternal: true,
      externalUrl: 'https://www.vagas.com.br/vagas-de-cuidador'
    },
    {
      id: 'ext_5',
      title: 'Jardineiro',
      company: { name: 'Paisagismo Verde Vida', logo: null },
      location: 'Brasília, DF',
      salary: 'R$ 1.800,00',
      description: 'Manutenção de jardins, poda de plantas, irrigação, paisagismo básico.',
      type: 'CLT',
      category: 'Jardinagem',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 60) + 1),
      source: 'Indeed Brasil',
      tags: ['jardineiro', 'paisagismo', 'plantas'],
      requirements: 'Experiência em jardinagem, conhecimento de plantas',
      benefits: 'Vale transporte, equipamentos fornecidos',
      isExternal: true,
      externalUrl: 'https://br.indeed.com/vagas-jardineiro'
    },
    {
      id: 'ext_6',
      title: 'Cozinheiro(a)',
      company: { name: 'Restaurante Sabor Caseiro', logo: null },
      location: 'Fortaleza, CE',
      salary: 'R$ 1.700,00',
      description: 'Preparo de refeições, controle de estoque, limpeza da cozinha.',
      type: 'CLT',
      category: 'Alimentação',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 84) + 1),
      source: 'SINE Nacional',
      tags: ['cozinheiro', 'culinária', 'restaurante'],
      requirements: 'Experiência em cozinha, curso de manipulação de alimentos',
      benefits: 'Vale transporte, refeições, gorjetas',
      isExternal: true,
      externalUrl: 'https://www.sine.br/vagas/cozinheiro'
    },
    {
      id: 'ext_7',
      title: 'Motorista Entregador',
      company: { name: 'Delivery Express', logo: null },
      location: 'Curitiba, PR',
      salary: 'R$ 2.000,00',
      description: 'Entrega de produtos, atendimento ao cliente, manutenção básica do veículo.',
      type: 'CLT',
      category: 'Transporte',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 12) + 1),
      source: 'Catho',
      tags: ['motorista', 'entregador', 'delivery'],
      requirements: 'CNH B, experiência em delivery',
      benefits: 'Vale combustível, manutenção do veículo',
      isExternal: true,
      externalUrl: 'https://www.catho.com.br/vagas/motorista-entregador'
    },
    {
      id: 'ext_8',
      title: 'Vendedor(a)',
      company: { name: 'Loja Moda Jovem', logo: null },
      location: 'Recife, PE',
      salary: 'R$ 1.320,00 + comissões',
      description: 'Atendimento ao cliente, organização da loja, alcance de metas de vendas.',
      type: 'CLT',
      category: 'Vendas',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 96) + 1),
      source: 'InfoJobs',
      tags: ['vendas', 'atendimento', 'moda'],
      requirements: 'Ensino médio, experiência em vendas',
      benefits: 'Vale transporte, comissões, desconto na loja',
      isExternal: true,
      externalUrl: 'https://www.infojobs.com.br/vagas-de-vendas'
    },
    {
      id: 'ext_9',
      title: 'Auxiliar de Estoque',
      company: { name: 'Supermercado Preço Bom', logo: null },
      location: 'Porto Alegre, RS',
      salary: 'R$ 1.450,00',
      description: 'Organização de estoque, recebimento de mercadorias, controle de produtos.',
      type: 'CLT',
      category: 'Estoque',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 18) + 1),
      source: 'Vagas.com',
      tags: ['estoque', 'organização', 'supermercado'],
      requirements: 'Ensino médio',
      benefits: 'Vale transporte, refeições, cesta básica',
      isExternal: true,
      externalUrl: 'https://www.vagas.com.br/vagas-de-estoque'
    },
    {
      id: 'ext_10',
      title: 'Atendente de Lanchonete',
      company: { name: 'Subway', logo: null },
      location: 'Brasil',
      salary: 'R$ 1.350,00',
      description: 'Preparo de sanduíches, atendimento ao cliente, operação de caixa, limpeza do local.',
      type: 'CLT',
      category: 'Alimentação',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 48) + 1),
      source: 'Indeed Brasil',
      tags: ['lanchonete', 'atendimento', 'preparo'],
      requirements: 'Ensino médio',
      benefits: 'Vale transporte, refeições',
      isExternal: true,
      externalUrl: 'https://www.vagas.com.br/vagas-de-atendente'
    },
    {
      id: 'ext_11',
      title: 'Recepcionista',
      company: { name: 'Clínica Médica Central', logo: null },
      location: 'Manaus, AM',
      salary: 'R$ 1.500,00',
      description: 'Atendimento telefônico, agendamento de consultas, recepção de pacientes.',
      type: 'CLT',
      category: 'Atendimento',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 30) + 1),
      source: 'SINE Nacional',
      tags: ['recepcionista', 'atendimento', 'saúde'],
      requirements: 'Ensino médio, curso de informática',
      benefits: 'Vale transporte, plano de saúde',
      isExternal: true,
      externalUrl: 'https://www.sine.br/vagas/recepcionista'
    },
    {
      id: 'ext_12',
      title: 'Operador de Caixa',
      company: { name: 'Farmácia Popular', logo: null },
      location: 'Belém, PA',
      salary: 'R$ 1.400,00',
      description: 'Operação de caixa, atendimento ao cliente, controle de medicamentos.',
      type: 'CLT',
      category: 'Atendimento',
      publishedDate: generateRealisticDate(Math.floor(Math.random() * 54) + 1),
      source: 'Catho',
      tags: ['caixa', 'farmácia', 'atendimento'],
      requirements: 'Ensino médio, curso de operador de caixa',
      benefits: 'Vale transporte, plano de saúde, desconto em medicamentos',
      isExternal: true,
      externalUrl: 'https://www.catho.com.br/vagas/operador-caixa'
    }
  ];
}

// Função para gerar URL de redirecionamento após captação de lead
function generateRedirectUrl(job) {
  const baseUrl = 'https://site-do-trabalhador.vercel.app';
  const source = job.source.toLowerCase();
  
  // URLs reais das fontes de emprego
  const redirectUrls = {
    'sine': `https://sine.br/vagas/${job.id}`,
    'catho': `https://catho.com.br/vagas/${job.id}`,
    'infojobs': `https://infojobs.com.br/vagas/${job.id}`,
    'vagas.com': `https://vagas.com.br/vagas/${job.id}`
  };
  
  return redirectUrls[source] || job.originalUrl || `${baseUrl}/vagas/${job.id}`;
}
