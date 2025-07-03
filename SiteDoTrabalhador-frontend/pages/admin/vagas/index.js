import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

export default function AdminVagas() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [vagas, setVagas] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar se está autenticado
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      carregarVagasReais()
    }
    setLoading(false)
  }, [])

  const carregarVagasReais = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Carregando vagas reais no painel admin (mesmas da home)...')

      // Usar EXATAMENTE a mesma API da página principal com cache busting
      const timestamp = new Date().getTime()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetch-jobs?t=${timestamp}&admin=true`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data && Array.isArray(data.data)) {
        setVagas(data.data)
        setLastUpdate(new Date())
        console.log(`✅ ${data.data.length} vagas reais carregadas no painel admin (mesmas da home)`)
        console.log('📊 Fontes das vagas:', data.data.map(v => v.source).filter((v, i, a) => a.indexOf(v) === i))
      } else {
        console.error('Erro na resposta da API:', data.message || 'Dados inválidos')
        setError(data.message || 'Dados inválidos recebidos')
        setVagas([])
      }
    } catch (error) {
      setError(error.message)
      setVagas([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <Head>
        <title>Vagas - Admin</title>
      </Head>
      {/* ...restante do componente de vagas... */}
    </AdminLayout>
  )
}
