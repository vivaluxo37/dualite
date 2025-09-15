import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ClerkAuthProvider } from '@/contexts/ClerkAuthContext';
import { ClerkAdminProvider } from '@/contexts/ClerkAdminContext';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useSecurityHeaders } from '@/hooks/useSecurity';

// Main Pages
import { HomePage } from '@/pages/HomePage';
import { BrokersPage } from '@/pages/BrokersPage';
import { BrokerProfilePage } from '@/pages/BrokerProfilePage';
import { EnhancedBrokerProfilePage } from '@/pages/EnhancedBrokerProfilePage';
import { ComparePage } from '@/pages/ComparePage';
import { CountryBrokerPage } from '@/pages/CountryBrokerPage';

// Tools
import { QuizPage } from '@/pages/QuizPage';
import { CalculatorsPage } from '@/pages/CalculatorsPage';
import { SimulatorPage } from '@/pages/SimulatorPage';
import { AIMatchPage } from '@/pages/AIMatchPage';
import { BrokerStylePage } from '@/pages/BrokerStylePage';

// Resources
import { LearningHubPage } from '@/pages/LearningHubPage';
import { MarketAnalysisPage } from '@/pages/MarketAnalysisPage';
import { RegulationGuidePage } from '@/pages/RegulationGuidePage';

// Support & Other
import { ContactPage } from '@/pages/ContactPage';
import { AboutPage } from '@/pages/AboutPage';
import { FaqPage } from '@/pages/FaqPage';
import { HelpPage } from '@/pages/HelpPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '@/pages/TermsOfServicePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Forex Brokers Pages
import { ForexBrokersLanding } from '@/pages/ForexBrokersLanding';

const ForexBrokersRouter = React.lazy(() =>
  import('./pages/forex-brokers/ForexBrokersRouter').then(module => ({
    default: module.ForexBrokersRouter
  }))
);

const MalaysiaStaticPage = React.lazy(() =>
  import('./pages/forex-brokers/regions/malaysia-static').then(module => ({
    default: module.default
  }))
);

// Blog Pages
import { BlogPage } from '@/pages/BlogPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { BlogCategoryPage } from '@/pages/BlogCategoryPage';

// User & Admin
import { DashboardPage } from '@/pages/DashboardPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import AdminPage from '@/pages/AdminPage';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

import './App.css';

function App() {
  // Apply security headers
  useSecurityHeaders();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ClerkAuthProvider>
            <ClerkAdminProvider>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    {/* Main */}
                    <Route index element={<HomePage />} />
                    <Route path="brokers" element={<BrokersPage />} />
                    <Route path="forex-brokers" element={<ForexBrokersLanding />} />
                    <Route path="review/:slug" element={<BrokerProfilePage />} />
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
                    <Route path="market-analysis" element={<MarketAnalysisPage />} />
                    <Route path="regulation-guide" element={<RegulationGuidePage />} />

                    {/* Blog */}
                    <Route path="blog" element={<BlogPage />} />
                    <Route path="blog/:slug" element={<BlogPostPage />} />
                    <Route path="blog/category/:slug" element={<BlogCategoryPage type="category" />} />
                    <Route path="blog/tag/:slug" element={<BlogCategoryPage type="tag" />} />

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
                    <Route path="profile" element={<ProtectedRoute />}>
                      <Route index element={<ProfilePage />} />
                    </Route>
                    <Route path="settings" element={<ProtectedRoute />}>
                      <Route index element={<SettingsPage />} />
                    </Route>

                    {/* Admin */}
                    <Route path="admin" element={<ProtectedRoute adminOnly />}>
                      <Route index element={<AdminPage />} />
                    </Route>

                    {/* Static test route */}
                    <Route path="malaysia-static" element={
                      <Suspense fallback={<div>Loading static test...</div>}>
                        <MalaysiaStaticPage />
                      </Suspense>
                    } />

                    {/* Forex Brokers Pages - All routes handled by router */}
                    <Route path="forex-brokers/*" element={
                      <Suspense fallback={
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      }>
                        <ForexBrokersRouter />
                      </Suspense>
                    } />

                    {/* 404 Page */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
                <Toaster richColors position="top-right" />
              </AuthProvider>
            </ClerkAdminProvider>
          </ClerkAuthProvider>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;