// API para estatísticas reais das vagas
export default async function handler(req, res) {
  try {
    console.log('📊 Buscando estatísticas reais das vagas...');
    
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }

    // Buscar todas as vagas combinadas
    const allJobsResponse = await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/all-jobs-combined`);
    const allJobsData = await allJobsResponse.json();

    if (!allJobsData.success || !allJobsData.data) {
      throw new Error('Erro ao buscar vagas');
    }

    const jobs = allJobsData.data;
    const totalJobs = jobs.length;

    // Contar vagas por categoria
    const categoryCounts = {};
    const locationCounts = {};
    const salaryRanges = {};
    const contractTypes = {};

    jobs.forEach(job => {
      // Categorias
      if (job.category) {
        categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
      }

      // Localizações
      if (job.location) {
        const location = job.location.toLowerCase();
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      }

      // Tipos de contrato
      if (job.contractType) {
        contractTypes[job.contractType] = (contractTypes[job.contractType] || 0) + 1;
      }

      // Faixas salariais (simplificada)
      if (job.salary) {
        const salaryText = job.salary.toLowerCase();
        if (salaryText.includes('1.') || salaryText.includes('até 2000')) {
          salaryRanges['Até R$ 2.000'] = (salaryRanges['Até R$ 2.000'] || 0) + 1;
        } else if (salaryText.includes('2.') || salaryText.includes('3.')) {
          salaryRanges['R$ 2.000 - R$ 4.000'] = (salaryRanges['R$ 2.000 - R$ 4.000'] || 0) + 1;
        } else if (salaryText.includes('4.') || salaryText.includes('5.')) {
          salaryRanges['R$ 4.000 - R$ 6.000'] = (salaryRanges['R$ 4.000 - R$ 6.000'] || 0) + 1;
        } else if (salaryText.includes('acima') || salaryText.includes('6.')) {
          salaryRanges['Acima de R$ 6.000'] = (salaryRanges['Acima de R$ 6.000'] || 0) + 1;
        } else {
          salaryRanges['A combinar'] = (salaryRanges['A combinar'] || 0) + 1;
        }
      } else {
        salaryRanges['A combinar'] = (salaryRanges['A combinar'] || 0) + 1;
      }
    });

    // Mapear categorias para categorias padrão do site
    const standardCategories = {
      'Serviços Domésticos': 
        (categoryCounts['domestica'] || 0) + 
        (categoryCounts['cozinheira'] || 0) + 
        (categoryCounts['baba'] || 0) + 
        (categoryCounts['domestic'] || 0),
      
      'Segurança e Portaria': 
        (categoryCounts['porteiro'] || 0) + 
        (categoryCounts['vigilante'] || 0) + 
        (categoryCounts['security'] || 0) + 
        (categoryCounts['recepcao'] || 0),
      
      'Cuidados e Saúde': 
        (categoryCounts['cuidador'] || 0) + 
        (categoryCounts['enfermagem'] || 0) + 
        (categoryCounts['saude'] || 0) + 
        (categoryCounts['acompanhante'] || 0),
      
      'Limpeza e Conservação': 
        (categoryCounts['limpeza'] || 0) + 
        (categoryCounts['faxineira'] || 0) + 
        (categoryCounts['conservacao'] || 0) + 
        (categoryCounts['auxiliar-limpeza'] || 0),
      
      'Transporte e Logística': 
        (categoryCounts['motorista'] || 0) + 
        (categoryCounts['entregador'] || 0) + 
        (categoryCounts['logistica'] || 0) + 
        (categoryCounts['transport'] || 0),
      
      'Vendas e Atendimento': 
        (categoryCounts['vendedor'] || 0) + 
        (categoryCounts['atendente'] || 0) + 
        (categoryCounts['vendas'] || 0) + 
        (categoryCounts['comercial'] || 0),
    };

    // Calcular outras estatísticas
    const currentDate = new Date();
    const lastWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentJobs = jobs.filter(job => {
      if (job.datePosted) {
        const jobDate = new Date(job.datePosted);
        return jobDate >= lastWeek;
      }
      return false;
    });

    // Cidades com mais vagas (top 10)
    const topCities = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([city, count]) => ({ city, count }));

    const stats = {
      totalJobs,
      recentJobs: recentJobs.length,
      categories: standardCategories,
      allCategories: categoryCounts,
      topCities,
      salaryRanges,
      contractTypes,
      internalJobs: allJobsData.meta?.internal || 0,
      externalJobs: allJobsData.meta?.external || 0,
      sources: allJobsData.meta?.sources || [],
      lastUpdate: new Date().toISOString(),
      
      // Estatísticas formatadas para uso direto no frontend
      formatted: {
        totalJobsFormatted: totalJobs.toLocaleString('pt-BR'),
        recentJobsFormatted: recentJobs.length.toLocaleString('pt-BR'),
        topCategory: Object.entries(standardCategories).sort((a, b) => b[1] - a[1])[0],
        avgJobsPerCategory: Math.round(totalJobs / Object.keys(standardCategories).length),
      }
    };

    console.log(`✅ Estatísticas calculadas: ${totalJobs} vagas totais`);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Erro ao calcular estatísticas:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao calcular estatísticas das vagas',
      data: {
        totalJobs: 0,
        recentJobs: 0,
        categories: {},
        error: error.message
      }
    });
  }
}
