import { useState } from "react";
import { usePetContext } from "@/context/PetContext";
import { Button } from "@/components/ui/button";

const Alerts = () => {
  const { alerts, addAlert } = usePetContext();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({ title, location });
    setTitle("");
    setLocation("");
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Alerts & Lost/Found</h2>
        <form onSubmit={onSubmit} className="flex gap-2 mb-6">
          <input className="flex-1 p-2 rounded-md border border-input bg-background" placeholder="Alert title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="w-48 p-2 rounded-md border border-input bg-background" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Button type="submit" variant="hero">Post Alert</Button>
        </form>

        <div className="space-y-4">
          {alerts.length === 0 && <div className="text-muted-foreground">No alerts yet.</div>}
          {alerts.map((a) => (
            <div key={a.id} className="p-4 bg-card rounded-md border border-input">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-muted-foreground">{a.location} · {new Date(a.date).toLocaleString()}</div>
                </div>
                <div className="text-sm text-muted-foreground">{a.resolved ? "Resolved" : "Active"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Alerts;
