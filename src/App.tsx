import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TabBar } from './components/TabBar';
import { TodayPage } from './pages/TodayPage';
import { LogPage } from './pages/LogPage';
import { TrainPage } from './pages/TrainPage';
import { ProgressPage } from './pages/ProgressPage';
import { MorePage } from './pages/MorePage';
import { LoginPage } from './pages/LoginPage';
import { TargetsPage } from './pages/TargetsPage';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Banner } from './components/Banner';
import { Button } from './components/Button';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthenticatedLayout />}>
              <Route path="/" element={<Navigate to="/today" replace />} />
              <Route path="/today" element={<TodayPage />} />
              <Route path="/log" element={<LogPage />} />
              <Route path="/train" element={<TrainPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/more" element={<MorePage />} />
              <Route path="/more/targets" element={<TargetsPage />} />
              <Route path="*" element={<Navigate to="/today" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function AuthenticatedLayout() {
  const { user, loading, authError, refreshUser } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-[var(--color-bg-page)]" aria-label="Checking sign-in" />;
  }
  if (!user && authError) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] p-6 flex items-center justify-center">
        <div className="w-full max-w-md space-y-3">
          <Banner message={authError} action={{ label: 'Retry', onClick: () => void refreshUser() }} />
          <Button variant="secondary" onClick={() => navigate('/login')}>Go to sign in</Button>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)] flex flex-col md:flex-row transition-colors">
      <Sidebar />
      <main className="flex-1 w-full min-w-0">
        <div className="max-w-[960px] mx-auto w-full px-4 sm:px-6 py-5 md:py-8 pb-24 md:pb-12">
          <Outlet />
        </div>
      </main>
      <TabBar />
    </div>
  );
}
