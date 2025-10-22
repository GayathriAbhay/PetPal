import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/api/auth/forgot", { method: "POST", body: JSON.stringify({ email }) });
      toast({ title: "Reset email sent", description: "If the email exists, you will receive reset instructions." });
    } catch (e: any) {
      toast({ title: "Request failed", description: e.message || String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="w-full p-2 rounded-md border border-input bg-background" />
          <div className="flex justify-end">
            <Button type="submit" variant="hero" disabled={loading}>{loading ? "Sending..." : "Send reset email"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
