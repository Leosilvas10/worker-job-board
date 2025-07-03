import Head from 'next/head'
import { useState } from 'react'

const Contato = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    lgpdConsent: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message || !formData.lgpdConsent) {
      alert('Por favor, preencha todos os campos obrigatórios e aceite os termos.')
      return
    }

    setIsSubmitting(true)

    try {
      const leadData = {
        nome: formData.name,
        telefone: formData.phone,
        email: formData.email,
        assunto: formData.subject,
        mensagem: formData.message,
        source: 'Página de Contato',
        lgpdConsent: formData.lgpdConsent,
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          lgpdConsent: false
        })
      } else {
        throw new Error(data.message || 'Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro ao enviar formulário de contato:', error)
      alert('❌ Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Contato - Site do Trabalhador</title>
        <meta name="description" content="Entre em contato com o Site do Trabalhador. Estamos aqui para ajudar com suas dúvidas sobre direitos trabalhistas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/site-do-trabalhador.ico" />
      </Head>

      <main className="min-h-screen bg-govgray-50">{/* pt-28 removido pois já está no _app.js */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-govblue-800 mb-6">
                Entre em Contato Conosco
              </h1>
              <p className="text-xl text-govgray-600 leading-relaxed">
                Estamos aqui para ajudar com suas dúvidas sobre direitos trabalhistas. 
                Nossa equipe de especialistas está pronta para atendê-lo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Formulário de Contato */}
              <div className="bg-white rounded-xl shadow-lg border border-govgray-200 p-8">
                <h2 className="text-2xl font-bold text-govblue-800 mb-6">
                  📧 Envie sua Mensagem
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-govblue-800 font-medium mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-govblue-800 font-medium mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-govblue-800 font-medium mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-govblue-800 font-medium mb-2">
                      Assunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o assunto</option>
                      <option value="duvida">Dúvida geral</option>
                      <option value="direitos">Direitos trabalhistas</option>
                      <option value="empresa">Sou empresa</option>
                      <option value="candidato">Sou candidato</option>
                      <option value="suporte">Suporte técnico</option>
                      <option value="parceria">Parceria</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-govblue-800 font-medium mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent resize-vertical"
                      placeholder="Descreva sua dúvida ou mensagem..."
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="lgpdConsent"
                      name="lgpdConsent"
                      checked={formData.lgpdConsent}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                    <label htmlFor="lgpdConsent" className="text-sm text-govgray-700">
                      Aceito o tratamento dos meus dados conforme a{' '}
                      <a href="/politica-privacidade" className="text-govblue-600 hover:underline" target="_blank">
                        Política de Privacidade
                      </a>{' '}
                      e{' '}
                      <a href="/lgpd" className="text-govblue-600 hover:underline" target="_blank">
                        LGPD
                      </a>
                      . *
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-govblue-600 hover:bg-govblue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-base disabled:bg-govgray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '📤 Enviando...' : '📤 Enviar Mensagem'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

    </>
  )
}

export default Contato
