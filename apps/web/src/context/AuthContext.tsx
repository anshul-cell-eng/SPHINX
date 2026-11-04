/**
 * @file AuthContext.tsx
 * @module context/AuthContext
 * @description Centralized React Context providing JWT lifecycle state, RBAC role enforcement,
 * session bootstrap (/auth/me), and protected route gates for Freelancer vs Client roles.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { apiClient, TokenStorage, type ApiResponse } from "../api/client";

export type UserRole = "freelancer" | "client" | "FREELANCER" | "CLIENT" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  workspaceId?: string;
  avatar?: string;
  companyName?: string;
  currency?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: "freelancer" | "client" | null;
  login: (credentials: { email: string; password: string; role?: string }) => Promise<AuthUser>;
  register: (payload: { email: string; password: string; name?: string; role?: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(TokenStorage.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Normalize role string to "freelancer" | "client"
  const normalizedRole: "freelancer" | "client" | null = user?.role
    ? (user.role.toLowerCase() as "freelancer" | "client")
    : null;

  /**
   * Refreshes the currently authenticated user profile from /auth/me
   */
  const refreshUser = useCallback(async () => {
    try {
      const token = TokenStorage.getToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const res = await apiClient.get<AuthUser>("/auth/me");
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
        TokenStorage.clear();
      }
    } catch {
      setUser(null);
      TokenStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /**
   * Logs in a user via POST /auth/login
   */
  const login = async (credentials: { email: string; password: string; role?: string }) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<any>(
        "/auth/login",
        credentials,
        { skipAuth: true }
      );

      const payload = res.data;
      const newToken = payload.tokens?.accessToken || payload.accessToken;
      const newRefreshToken = payload.tokens?.refreshToken || payload.refreshToken;
      const authUser = payload.user;

      TokenStorage.setTokens({ accessToken: newToken, refreshToken: newRefreshToken });
      setAccessToken(newToken);
      setUser(authUser);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registers a new user via POST /auth/register
   */
  const register = async (payloadData: { email: string; password: string; name?: string; role?: string }) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<any>(
        "/auth/register",
        payloadData,
        { skipAuth: true }
      );

      const payload = res.data;
      const newToken = payload.tokens?.accessToken || payload.accessToken;
      const newRefreshToken = payload.tokens?.refreshToken || payload.refreshToken;
      const authUser = payload.user;

      TokenStorage.setTokens({ accessToken: newToken, refreshToken: newRefreshToken });
      setAccessToken(newToken);
      setUser(authUser);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clears session locally and notifies backend via POST /auth/logout
   */
  const logout = async () => {
    try {
      await apiClient.post("/auth/logout").catch(() => {});
    } finally {
      TokenStorage.clear();
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        role: normalizedRole,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Route Guard for Freelancer Workspace routes (/app/*, /workspace/*)
 */
export const ProtectedFreelancerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050508] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-400 font-mono tracking-wider">VERIFYING FREELANCER CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If a client logs in, redirect to their scoped client portal
  if (user.role && user.role.toLowerCase() === "client") {
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
};

/**
 * Route Guard for Client Portal routes (/portal/*)
 */
export const ProtectedClientRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050508] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-400 font-mono tracking-wider">LOADING CLIENT PORTAL...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
