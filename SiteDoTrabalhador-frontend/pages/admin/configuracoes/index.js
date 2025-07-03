import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

export default function AdminConfiguracoes() {
  const [settings, setSettings] = useState({
    siteName: 'Site do Trabalhador',
    siteDescription: 'Encontre as melhores oportunidades de trabalho',
    contactEmail: 'contato@sitedotrabalhador.com.br',
    whatsappNumber: '(11) 99999-9999',
    googleSheetsUrl: '',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsUserId: ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticação
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      router.push('/admin/login')
      return
    }

    // Carregar configurações (simular)
    // Em produção, buscar da API ou localStorage
  }, [])

  const handleSettingsSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular salvamento
    setTimeout(() => {
      alert('Configurações salvas com sucesso!')
      setLoading(false)
    }, 1000)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres!')
      return
    }
    // Simular alteração de senha
    setTimeout(() => {
      alert('Senha alterada com sucesso!')
    }, 1000)
  }

  return (
    <AdminLayout>
      <Head>
        <title>Configurações - Admin</title>
      </Head>
      {/* ...restante do componente de configurações... */}
    </AdminLayout>
  )
}
