import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../src/components/Admin/AdminLayout'
import DashboardStats from '../../src/components/Admin/DashboardStats'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('admin_token')
      const adminUser = localStorage.getItem('admin_user')

      console.log('Verificando autenticação no dashboard...', { adminToken, adminUser })

      if (!adminToken || adminToken !== 'admin_authenticated') {
        console.log('Token inválido, redirecionando...')
        router.push('/admin/login')
        return
      }

      if (adminUser) {
        try {
          const userData = JSON.parse(adminUser)
          if (userData.authenticated) {
            setUser(userData)
            setIsAuthenticated(true)
            setLoading(false)
            console.log('Usuário autenticado com sucesso!')
          } else {
            router.push('/admin/login')
          }
        } catch (e) {
          console.error('Erro no parse dos dados:', e)
          router.push('/admin/login')
        }
      } else {
        router.push('/admin/login')
      }
    }

    // Pequeno delay para garantir que o localStorage está disponível
    setTimeout(checkAuth, 100)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-govgray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-12 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-govblue-600 mx-auto mb-4"></div>
          <p className="text-govgray-600 font-medium">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout user={user}>
      <Head>
        <title>Painel Administrativo - Site do Trabalhador</title>
      </Head>
      <DashboardStats />
    </AdminLayout>
  )
}
