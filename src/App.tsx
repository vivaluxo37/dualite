import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Layout } from '@/components/layout/Layout'

// Main Pages
import { HomePage } from '@/pages/HomePage'
import { BrokersPage } from '@/pages/BrokersPage'
import { BrokerProfilePage } from '@/pages/BrokerProfilePage'
import { EnhancedBrokerProfilePage } from '@/pages/EnhancedBrokerProfilePage'

import { ComparePage } from '@/pages/ComparePage'
import { CountryBrokerPage } from '@/pages/CountryBrokerPage'

// Tools
import { QuizPage } from '@/pages/QuizPage'
import { CalculatorsPage } from '@/pages/CalculatorsPage'
import { SimulatorPage } from '@/pages/SimulatorPage'
import { AIMatchPage } from '@/pages/AIMatchPage'
import { BrokerStylePage } from '@/pages/BrokerStylePage'

// Resources
import { LearningHubPage } from '@/pages/LearningHubPage'
import { MarketAnalysisPage } from '@/pages/MarketAnalysisPage'
import { RegulationGuidePage } from '@/pages/RegulationGuidePage'

// Support & Other
import { ContactPage } from '@/pages/ContactPage'
import { AboutPage } from '@/pages/AboutPage'
import { FaqPage } from '@/pages/FaqPage'
import { HelpPage } from '@/pages/HelpPage'
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage'
import { TermsOfServicePage } from '@/pages/TermsOfServicePage'

// User & Admin
import { DashboardPage } from '@/pages/DashboardPage'
import AdminPage from '@/pages/AdminPage'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import './App.css'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="brokeranalysis-theme">
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Main */}
                <Route index element={<HomePage />} />
                <Route path="brokers" element={<BrokersPage />} />

                <Route path="review/:slug" element={<EnhancedBrokerProfilePage />} />
                <Route path="compare" element={<ComparePage />} />
                <Route path="brokers/:country" element={<CountryBrokerPage />} />

                {/* Tools */}
                <Route path="ai-match" element={<AIMatchPage />} />
                <Route path="quiz" element={<QuizPage />} />
                <Route path="calculators" element={<CalculatorsPage />} />
                <Route path="simulator" element={<SimulatorPage />} />
                
                {/* Broker Style Routes */}
                <Route path="brokers/style/:style" element={<BrokerStylePage />} />
                
                {/* Resources */}
                <Route path="learn" element={<LearningHubPage />} />
                <Route path="learn/market-analysis" element={<MarketAnalysisPage />} />
                <Route path="regulation-guide" element={<RegulationGuidePage />} />

                {/* Support & Other */}
                <Route path="contact" element={<ContactPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="faq" element={<FaqPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="terms-of-service" element={<TermsOfServicePage />} />

                {/* User */}
                <Route path="dashboard" element={<ProtectedRoute />}>
                  <Route index element={<DashboardPage />} />
                </Route>
                
                {/* Admin */}
                <Route path="admin" element={<ProtectedRoute adminOnly />}>
                  <Route index element={<AdminPage />} />
                </Route>

              </Route>
            </Routes>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
