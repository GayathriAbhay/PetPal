import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Account = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, email });
    } catch (e) {}
    setSaving(false);
  };

  const onChangePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {}
    setPwLoading(false);
  };

  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
        <form onSubmit={onSave} className="space-y-4 bg-card p-6 rounded-2xl shadow mb-6">
          <label className="block">Name</label>
          <input className="w-full p-2 rounded-md border border-input bg-background" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="block">Email</label>
          <input className="w-full p-2 rounded-md border border-input bg-background" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex justify-between items-center">
            <div>
              <Button type="submit" variant="hero" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
            <div>
              <Button variant="ghost" onClick={() => logout()}>Sign out</Button>
            </div>
          </div>
        </form>

        <div className="bg-card p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-3">Change Password</h3>
          <form onSubmit={onChangePwd} className="space-y-3">
            <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-2 rounded-md border border-input bg-background" />
            <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 rounded-md border border-input bg-background" />
            <div className="flex justify-end">
              <Button type="submit" variant="hero" disabled={pwLoading}>{pwLoading ? "Updating..." : "Change Password"}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
