import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../src/components/Admin/AdminLayout'

const AdminLeads = () => {
  const [leads, setLeads] = useState([])
  const [calculadoraLeads, setCalculadoraLeads] = useState([])
  const [activeTab, setActiveTab] = useState('all') // 'all', 'jobs', 'calculator'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    fetchLeads()
    fetchCalculadoraLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-leads`)
      const data = await response.json()

      if (data.success) {
        setLeads(data.leads)
      } else {
        setError('Erro ao carregar leads')
      }
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }

  const fetchCalculadoraLeads = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calculadora-leads`)
      const data = await response.json()

      if (data.success) {
        setCalculadoraLeads(data.leads)
      } else {
        console.error('Erro ao carregar leads da calculadora:', data.message)
      }
    } catch (error) {
      console.error('Erro ao buscar leads da calculadora:', error)
    }
  }

  const exportToCSV = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/get-leads?format=csv`, '_blank')
  }

  const deleteLead = async (leadId) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) {
      return
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete-lead?id=${leadId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setLeads(leads.filter(lead => lead.id !== leadId))
      } else {
        setError('Erro ao excluir lead')
      }
    } catch (error) {
      setError('Erro ao excluir lead')
    }
  }

  return (
    <AdminLayout>
      <Head>
        <title>Leads - Admin</title>
      </Head>
      {/* ...restante do componente de leads... */}
    </AdminLayout>
  )
}

export default AdminLeads
