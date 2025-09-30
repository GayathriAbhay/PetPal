import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ name, email });
      navigate("/");
    } catch (err) {
      // handled by toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign in to PetPal</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-2 rounded-md border border-input bg-background" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="w-full p-2 rounded-md border border-input bg-background" />
          <div className="flex justify-end gap-2">
            <Button type="submit" variant="hero" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
