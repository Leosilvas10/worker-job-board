import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSiteContext } from '../src/contexts/SiteContext'
import HeroSection from '../src/components/HeroSection/HeroSection'
import LeadModal from '../src/components/LeadModal'

export default function Home() {
  const { siteConfig } = useSiteContext()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  // Buscar vagas em destaque
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/all-jobs-combined')
        const data = await response.json()
        
        if (data.success && data.jobs) {
          // Pegar apenas as 6 primeiras vagas para exibir em destaque
          setJobs(data.jobs.slice(0, 6))
        }
      } catch (error) {
        console.error('Erro ao buscar vagas:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchJobs()
  }, [])

  const handleApplyClick = (job) => {
    setSelectedJob(job)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedJob(null)
  }

  return (
    <>
      <Head>
        <title>Encontre a Sua Vaga Ideal e Conheça Seus Direitos! | Site do Trabalhador</title>
        <meta name="description" content="Milhares de vagas de empregos simples te esperam! Doméstica, Cuidador(a), Porteiro, Limpeza e muito mais. Aprenda seus direitos trabalhistas de forma fácil e gratuita." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/site-do-trabalhador.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/site-do-trabalhador.ico" />
      </Head>
      
      <main className="min-h-screen">
        {/* Hero Section Original */}
        <HeroSection />

        {/* Vagas em Destaque */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-govblue-700">
                💼 Vagas em Destaque
              </h2>
              <p className="text-xl text-gray-600">
                As melhores oportunidades de trabalho selecionadas para você
              </p>
            </div>
            
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {jobs.map((job, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-govblue-700 line-clamp-2">
                        {job.title}
                      </h3>
                      <span className="text-xs bg-govgreen-100 text-govgreen-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {job.location}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      {job.company && (
                        <p><strong>Empresa:</strong> {job.company}</p>
                      )}
                      {job.salary && (
                        <p><strong>Salário:</strong> {job.salary}</p>
                      )}
                      {job.type && (
                        <p><strong>Tipo:</strong> {job.type}</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleApplyClick(job)}
                      className="w-full bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      Quero me candidatar
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center">
              <Link href="/vagas">
                <button className="bg-govblue-600 hover:bg-govblue-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                  👔 Ver Todas as Vagas →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Cards de Serviços */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-govblue-700">
                🔧 Nossos Serviços
              </h2>
              <p className="text-xl text-gray-600">
                Ferramentas e recursos para o trabalhador brasileiro
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Calculadora de Direitos */}
              <div className="bg-gradient-to-br from-govgreen-500 to-govgreen-600 rounded-xl p-8 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-4">🧮</div>
                <h3 className="text-2xl font-bold mb-4">Calculadora de Direitos</h3>
                <p className="text-green-100 mb-6">
                  Calcule seus direitos trabalhistas de forma gratuita e descubra se você tem valores a receber.
                </p>
                <Link href="/calculadora">
                  <button className="bg-white text-govgreen-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    Calcular Agora →
                  </button>
                </Link>
              </div>

              {/* Empresas */}
              <div className="bg-gradient-to-br from-govblue-500 to-govblue-600 rounded-xl p-8 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold mb-4">Para Empresas</h3>
                <p className="text-blue-100 mb-6">
                  Publique vagas gratuitamente e encontre os melhores profissionais para sua empresa.
                </p>
                <Link href="/empresas">
                  <button className="bg-white text-govblue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    Publicar Vaga →
                  </button>
                </Link>
              </div>

              {/* Contato */}
              <div className="bg-gradient-to-br from-govyellow-500 to-govyellow-600 rounded-xl p-8 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-4">📞</div>
                <h3 className="text-2xl font-bold mb-4">Fale Conosco</h3>
                <p className="text-yellow-100 mb-6">
                  Tire suas dúvidas sobre direitos trabalhistas ou sobre nossas vagas de emprego.
                </p>
                <Link href="/contato">
                  <button className="bg-white text-govyellow-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    Entre em Contato →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Final */}
        <section className="py-16 bg-gradient-to-r from-govblue-600 to-govblue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                ⚡ Não Perca Mais Tempo!
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Sua próxima oportunidade de trabalho e a garantia dos seus direitos estão aqui. 
                Junte-se a milhares de trabalhadores que já encontraram o que procuravam!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/vagas">
                  <button className="bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                    🔍 Buscar Vagas
                  </button>
                </Link>
                <Link href="/calculadora">
                  <button className="bg-govyellow-500 hover:bg-govyellow-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                    🧮 Calcular Direitos
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Modal de Candidatura */}
        {showModal && selectedJob && (
          <LeadModal
            isOpen={showModal}
            onClose={handleModalClose}
            job={selectedJob}
          />
        )}
      </main>
    </>
  )
}
