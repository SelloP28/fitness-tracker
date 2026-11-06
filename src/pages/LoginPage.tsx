import { useState } from 'react';
import type { FormEvent } from 'react';
import { Activity } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../lib/AuthContext';

const inputClassName = 'w-full min-h-[44px] rounded-[8px] border border-[var(--color-border-card)] bg-[var(--color-bg-page)] px-3 text-[14px] text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]';

export function LoginPage() {
  const { user, loading, authError, login, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <div className="min-h-screen bg-[var(--color-bg-page)] p-6" aria-label="Checking sign-in" />;
  }
  if (user) return <Navigate to="/today" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/today', { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Sign-in failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[var(--color-accent)] text-[var(--color-accent-on)] flex items-center justify-center">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="text-[16px] font-medium">Fuel &amp; Form</span>
        </div>
        <Card>
          <PageHeader title="Sign in" subtitle="Use your account to continue" />
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            {authError && (
              <Banner
                message={authError}
                action={{ label: 'Retry', onClick: () => void refreshUser() }}
              />
            )}
            {error && <Banner message={error} />}
            <label className="block space-y-1.5">
              <span className="text-[13px] text-[var(--color-text-secondary)]">Email</span>
              <input
                className={inputClassName}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[13px] text-[var(--color-text-secondary)]">Password</span>
              <input
                className={inputClassName}
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <Button type="submit" variant="primary" fullWidth disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
