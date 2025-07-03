import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useSiteContext } from '../../contexts/SiteContext'

const AdminLayout = ({ children, title = 'Painel Administrativo' }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { siteConfig } = useSiteContext()

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('admin_token')
      const adminUser = localStorage.getItem('admin_user')

      console.log('Verificando autenticação...', { adminToken, adminUser })

      if (!adminToken || adminToken !== 'admin_authenticated') {
        console.log('Token inválido, redirecionando para login')
        router.push('/admin/login')
        return
      }

      if (adminUser) {
        try {
          const userData = JSON.parse(adminUser)
          console.log('Dados do usuário:', userData)
          if (userData.authenticated) {
            setUser(userData)
            setLoading(false)
          } else {
            console.log('Usuário não autenticado')
            router.push('/admin/login')
          }
        } catch (e) {
          console.error('Erro ao parsear dados do usuário:', e)
          router.push('/admin/login')
        }
      } else {
        console.log('Dados do usuário não encontrados')
        router.push('/admin/login')
      }
    }

    // Pequeno delay para garantir que o localStorage está disponível
    setTimeout(checkAuth, 100)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    console.log('Logout realizado')
    router.push('/admin/login')
  }

  const navigateToHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Head>
        <title>{title}</title>
      </Head>
      {/* Header, Sidebar, etc. */}
      <main className="p-8">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
