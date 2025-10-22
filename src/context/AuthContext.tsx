import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email?: string;
};

type AuthContextValue = {
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<User>;
  register: (data: { name?: string; email: string; password: string }) => Promise<User>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string }) => Promise<User>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "petpal_user_v1";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // try to fetch current user from server
    let mounted = true;
    (async () => {
      try {
        const me = await apiFetch("/api/me");
        if (me && mounted) {
          setUser(me);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(me)); } catch (e) {}
        }
      } catch (e) {
        // fallback to local storage
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setUser(JSON.parse(raw));
        } catch (e) {}
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }, [user]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setUser(res);
      toast({ title: "Signed in", description: `Welcome, ${res.name || res.email}!` });
      return res;
    } catch (e: any) {
      toast({ title: "Sign in failed", description: e.message || String(e) });
      throw e;
    }
  };

  const register = async ({ name, email, password }: { name?: string; email: string; password: string }) => {
    try {
      const res = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
      setUser(res);
      toast({ title: "Account created", description: `Welcome, ${res.name || res.email}!` });
      return res;
    } catch (e: any) {
      toast({ title: "Registration failed", description: e.message || String(e) });
      throw e;
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    setUser(null);
    toast({ title: "Signed out", description: "You have been signed out." });
  };

  const updateProfile = async ({ name, email }: { name?: string; email?: string }) => {
    try {
      const res = await apiFetch("/api/auth/update-profile", { method: "POST", body: JSON.stringify({ name, email }) });
      setUser(res);
      toast({ title: "Profile updated" });
      return res;
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message || String(e) });
      throw e;
    }
  };

  const changePassword = async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
    try {
      await apiFetch("/api/auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) });
      toast({ title: "Password changed" });
    } catch (e: any) {
      toast({ title: "Change password failed", description: e.message || String(e) });
      throw e;
    }
  };

  return <AuthContext.Provider value={{ user, login, register, logout, updateProfile, changePassword }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
