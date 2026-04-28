import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';

import AppLayout from '@/components/layout/AppLayout';
import PageNotFound from './lib/PageNotFound';
import Login from '@/pages/Login';

// Lazy-loaded routes (Q1 — code splitting). Login stays eager because it's
// the entry point and tiny; AppLayout stays eager because it's the chrome.
const Dashboard           = lazy(() => import('@/pages/Dashboard'));
const Clienti             = lazy(() => import('@/pages/Clienti'));
const DettaglioCliente    = lazy(() => import('@/pages/DettaglioCliente'));
const Engagements         = lazy(() => import('@/pages/Engagements'));
const DettaglioEngagement = lazy(() => import('@/pages/DettaglioEngagement'));
const GeneraBilancio      = lazy(() => import('@/pages/GeneraBilancio'));
const Cataloghi           = lazy(() => import('@/pages/Cataloghi'));
const Impostazioni        = lazy(() => import('@/pages/Impostazioni'));
const Analytics           = lazy(() => import('@/pages/Analytics'));
const StatoAvanzamento    = lazy(() => import('@/pages/StatoAvanzamento'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

function FullscreenSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">E</div>
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <FullscreenSpinner />;

  return (
    <Suspense fallback={<FullscreenSpinner />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clienti" element={<Clienti />} />
          <Route path="/clienti/:id" element={<DettaglioCliente />} />
          <Route path="/engagements" element={<Engagements />} />
          <Route path="/engagements/:id" element={<DettaglioEngagement />} />
          <Route path="/engagements/:id/bilancio" element={<GeneraBilancio />} />
          <Route path="/cataloghi" element={<Cataloghi />} />
          <Route path="/impostazioni" element={<Impostazioni />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/stato-avanzamento" element={<StatoAvanzamento />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <AppRoutes />
              <Toaster />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
