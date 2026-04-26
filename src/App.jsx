import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';

import AppLayout from '@/components/layout/AppLayout';
import PageNotFound from './lib/PageNotFound';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Clienti from '@/pages/Clienti';
import DettaglioCliente from '@/pages/DettaglioCliente';
import Engagements from '@/pages/Engagements';
import DettaglioEngagement from '@/pages/DettaglioEngagement';
import Cataloghi from '@/pages/Cataloghi';
import Impostazioni from '@/pages/Impostazioni';
import Analytics from '@/pages/Analytics';
import StatoAvanzamento from '@/pages/StatoAvanzamento';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">E</div>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
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
        <Route path="/cataloghi" element={<Cataloghi />} />
        <Route path="/impostazioni" element={<Impostazioni />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/stato-avanzamento" element={<StatoAvanzamento />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
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
