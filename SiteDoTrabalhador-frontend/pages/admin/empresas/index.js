import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

export default function AdminEmpresas() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [solicitacoes, setSolicitacoes] = useState([])

  useEffect(() => {
    // Verificar autenticação
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      router.push('/admin/login')
      return
    }
    
    setIsAuthenticated(true)
    fetchEmpresas()
  }, [])

  const fetchEmpresas = async () => {
    try {
      setLoading(true)
      // Buscar leads de empresas da API real
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-leads`)
      const data = await response.json()

      if (data.success) {
        // Filtrar apenas leads que são de empresas
        const empresaLeads = data.leads.filter(lead => 
          lead.type === 'empresa' || 
          lead.source === 'formulario_empresas' ||
          lead.nomeEmpresa
        )
        setSolicitacoes(empresaLeads)
      } else {
        console.error('Erro ao carregar empresas:', data.message)
        // Fallback para dados mock se a API falhar
        setSolicitacoes([])
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error)
      // Manter dados mock em caso de erro
      setSolicitacoes([])
    } finally {
      setLoading(false)
    }
  }

  const deleteEmpresa = async (empresaId) => {
    if (!confirm('Tem certeza que deseja excluir esta solicitação de empresa?')) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete-lead?id=${empresaId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setSolicitacoes(solicitacoes.filter(emp => emp.id !== empresaId))
      } else {
        alert('Erro ao excluir empresa')
      }
    } catch (error) {
      alert('Erro ao excluir empresa')
    }
  }

  return (
    <AdminLayout>
      <Head>
        <title>Empresas - Admin</title>
      </Head>
      {/* ...restante do componente de empresas... */}
    </AdminLayout>
  )
}
