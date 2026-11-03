import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TabBar } from './components/TabBar';
import { TodayPage } from './pages/TodayPage';
import { LogPage } from './pages/LogPage';
import { TrainPage } from './pages/TrainPage';
import { ProgressPage } from './pages/ProgressPage';
import { MorePage } from './pages/MorePage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)] flex flex-col md:flex-row transition-colors">
        {/* Desktop Sidebar (>= 768px) */}
        <Sidebar />

        {/* Main Content Area: Centred in max-width column (~960px) */}
        <main className="flex-1 w-full min-w-0">
          <div className="max-w-[960px] mx-auto w-full px-4 sm:px-6 py-5 md:py-8 pb-24 md:pb-12">
            <Routes>
              <Route path="/" element={<Navigate to="/today" replace />} />
              <Route path="/today" element={<TodayPage />} />
              <Route path="/log" element={<LogPage />} />
              <Route path="/train" element={<TrainPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/more" element={<MorePage />} />
              <Route path="*" element={<Navigate to="/today" replace />} />
            </Routes>
          </div>
        </main>

        {/* Mobile Bottom TabBar (< 768px) */}
        <TabBar />
      </div>
    </BrowserRouter>
  );
}
