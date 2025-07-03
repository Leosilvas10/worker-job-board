import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

export default function AdminUsuarios() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'admin',
    active: true
  })

  useEffect(() => {
    // Verificar autenticação
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      router.push('/admin/login')
      return
    }
    
    setIsAuthenticated(true)
    loadUsuarios()
    setLoading(false)
  }, [])

  const loadUsuarios = () => {
    // Simular carregamento de usuários do localStorage
    const savedUsers = localStorage.getItem('admin_users')
    if (savedUsers) {
      setUsuarios(JSON.parse(savedUsers))
    } else {
      // Usuário padrão
      const defaultUsers = [
        {
          id: 1,
          name: 'Administrador',
          username: 'admin',
          email: 'admin@sitedotrabalhador.com.br',
          role: 'super_admin',
          active: true,
          created_at: new Date().toISOString()
        }
      ]
      setUsuarios(defaultUsers)
      localStorage.setItem('admin_users', JSON.stringify(defaultUsers))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // ...restante do submit...
  }

  return (
    <AdminLayout>
      <Head>
        <title>Usuários - Admin</title>
      </Head>
      {/* ...restante do componente de usuários... */}
    </AdminLayout>
  )
}
