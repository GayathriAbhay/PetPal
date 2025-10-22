import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  useEffect(() => {
    if (!token) {
      toast({ title: "Invalid link", description: "Missing password reset token." });
      navigate("/sign-in");
    }
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      await apiFetch("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
      toast({ title: "Password reset", description: "You can now sign in with your new password." });
      navigate("/sign-in");
    } catch (err: any) {
      toast({ title: "Reset failed", description: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="New password" className="w-full p-2 rounded-md border border-input bg-background" />
          <div className="flex justify-end">
            <Button type="submit" variant="hero" disabled={loading}>{loading ? "Saving..." : "Reset Password"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
