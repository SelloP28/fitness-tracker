import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { account } from './appwrite';
import { authErrorMessage, friendlyError } from './api/errors';

export interface AuthUser {
  $id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isUnauthorized(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error &&
    Number((error as { code?: unknown }).code) === 401;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const current = await account.get();
      setUser({ $id: current.$id, email: current.email, name: current.name });
      setAuthError(null);
    } catch (error) {
      if (isUnauthorized(error)) {
        setUser(null);
        setAuthError(null);
      } else {
        setAuthError(authErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      await account.createEmailPasswordSession({ email, password });
      const current = await account.get();
      setUser({ $id: current.$id, email: current.email, name: current.name });
      setAuthError(null);
    } catch (error) {
      throw new Error(authErrorMessage(error));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession({ sessionId: 'current' });
      setUser(null);
      setAuthError(null);
    } catch (error) {
      throw friendlyError(error, 'sign out');
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, authError, login, logout, refreshUser }),
    [user, loading, authError, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
