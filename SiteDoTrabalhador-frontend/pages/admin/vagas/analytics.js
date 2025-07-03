import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

const AdminVagasAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs-analytics`)
      const data = await response.json()

      if (data.success) {
        setAnalytics(data)
      } else {
        console.error('Erro ao carregar analytics:', data.message)
      }
    } catch (error) {
      console.error('Erro ao buscar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const forceRefreshJobs = async () => {
    if (!confirm('Tem certeza que deseja substituir as vagas pouco visitadas? Esta ação irá remover vagas com baixo engajamento do sistema de tracking.')) {
      return
    }

    try {
      setRefreshing(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs-analytics`, {
        method: 'PUT'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ Refresh realizado! ${data.jobsReplaced} vagas foram marcadas para substituição.`)
        fetchAnalytics() // Recarregar dados
      } else {
        alert('❌ Erro ao realizar refresh: ' + data.message)
      }
    } catch (error) {
      console.error('Erro ao forçar refresh:', error)
      alert('❌ Erro ao realizar refresh')
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div>Carregando analytics...</div>
    )
  }

  return (
    <AdminLayout>
      <Head>
        <title>Analytics de Vagas - Admin</title>
      </Head>
      {/* ...restante do componente de analytics... */}
    </AdminLayout>
  )
}

export default AdminVagasAnalytics
