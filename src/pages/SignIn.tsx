import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const { login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      navigate(from);
    } catch (err) {
      // handled by toast in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">{isRegister ? "Create an account" : "Sign in to PetPal"}</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          {isRegister && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-2 rounded-md border border-input bg-background" />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 rounded-md border border-input bg-background" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 rounded-md border border-input bg-background" />
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm">
                <input type="checkbox" checked={isRegister} onChange={(e) => setIsRegister(e.target.checked)} className="mr-2" />
                Create account
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit" variant="hero" disabled={loading}>{loading ? (isRegister ? "Creating..." : "Signing in...") : (isRegister ? "Create" : "Sign In")}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
