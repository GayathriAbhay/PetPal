import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const SignInModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ name, email });
      onClose();
    } catch (err) {
      // error handled in auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-w-md w-full bg-card p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-2">Sign in to PetPal</h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full p-2 rounded-md border border-input bg-background" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full p-2 rounded-md border border-input bg-background" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="hero" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;
