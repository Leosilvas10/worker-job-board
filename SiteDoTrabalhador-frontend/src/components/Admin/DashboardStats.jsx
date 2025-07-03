import { useState, useEffect } from 'react'
import { useJobStats } from '../../hooks/useJobStats'

const DashboardStats = () => {
  const { stats: jobStats, loading: jobStatsLoading, error: jobStatsError } = useJobStats()
  
  const [stats, setStats] = useState({
    totalVagas: 0,
    vagasAtivas: 0,
    totalLeads: 0,
    leadsHoje: 0,
    acessosHoje: 0,
    empresasCadastradas: 0,
    usuariosAtivos: 0,
    taxaConversao: 0
  })

  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [jobStats])

  // Atualizar estatísticas quando os dados das vagas chegarem
  useEffect(() => {
    if (!jobStatsLoading && jobStats && !jobStatsError) {
      setStats(prevStats => ({
        ...prevStats,
        totalVagas: jobStats.totalJobs || 0,
        vagasAtivas: jobStats.recentJobs || 0
      }))
    }
  }, [jobStats, jobStatsLoading, jobStatsError])

  const resetDashboard = async () => {
    const zeroStats = {
      totalVagas: jobStats?.totalJobs || 0, // Preservar dados reais das vagas
      vagasAtivas: jobStats?.recentJobs || 0, // Preservar dados reais das vagas
      totalLeads: 0,
      leadsHoje: 0,
      acessosHoje: 0,
      empresasCadastradas: 0,
      usuariosAtivos: 0,
      taxaConversao: 0
    }

    const emptyActivities = []

    // Atualizar imediatamente o estado da UI
    setStats(zeroStats)
    setActivities(emptyActivities)
    
    // Salvar estado zerado no localStorage para persistir
    try {
      localStorage.setItem('dashboardStats', JSON.stringify(zeroStats))
      localStorage.setItem('dashboardActivities', JSON.stringify(emptyActivities))
      localStorage.setItem('dashboardResetFlag', 'true')
      localStorage.setItem('dashboardResetTime', new Date().toISOString())
    } catch (e) {
      console.error('Erro ao resetar dashboard:', e)
    }
  }

  const loadDashboardData = () => {
    // Simular carregamento de dados do dashboard
    setLoading(false)
  }

  return (
    <div>
      {/* ...restante do componente de estatísticas... */}
    </div>
  )
}

export default DashboardStats
