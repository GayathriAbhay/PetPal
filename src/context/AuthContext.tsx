import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email?: string;
};

type AuthContextValue = {
  user: User | null;
  login: (data: { name: string; email?: string; password?: string }) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "petpal_user_v1";

const fakeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }, [user]);

  const login = async ({ name, email }: { name: string; email?: string }) => {
    if (!name) {
      toast({ title: "Login failed", description: "Please provide a name." });
      throw new Error("Missing name");
    }
    // fake delay
    await new Promise((res) => setTimeout(res, 300));
    const u = { id: fakeId(), name, email };
    setUser(u);
    toast({ title: "Signed in", description: `Welcome, ${name}!` });
    return u;
  };

  const logout = () => {
    setUser(null);
    toast({ title: "Signed out", description: "You have been signed out." });
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
