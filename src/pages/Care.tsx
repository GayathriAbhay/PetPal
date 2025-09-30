import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePetContext } from "@/context/PetContext";

const Care = () => {
  const { pets, getHealthForPet, addHealthRecord } = usePetContext();
  const [selectedPetId, setSelectedPetId] = useState<string | null>(pets.length ? pets[0].id : null);
  const [note, setNote] = useState("");
  const records = selectedPetId ? getHealthForPet(selectedPetId) : [];

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || !note) return;
    addHealthRecord({ petId: selectedPetId, title: "Vet Note", notes: note });
    setNote("");
  };

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Care Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage vaccinations, vet visits, and records for your pets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-4 rounded-2xl">
            <h3 className="font-semibold mb-3">Pets</h3>
            <div className="space-y-2">
              {pets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPetId(p.id)}
                  className={`w-full text-left p-2 rounded-md hover:bg-accent/5 ${selectedPetId === p.id ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.breed} · {p.age}</div>
                </button>
              ))}
              {pets.length === 0 && <div className="text-sm text-muted-foreground">No pets yet. Add a pet to get started.</div>}
            </div>
          </div>

          <div className="md:col-span-2 bg-card p-6 rounded-2xl">
            {!selectedPetId && <div className="text-muted-foreground">Select a pet to view health records.</div>}

            {selectedPetId && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Health Records</h3>
                  <div className="text-sm text-muted-foreground">{records.length} records</div>
                </div>

                <form onSubmit={onAdd} className="mb-4 flex gap-2">
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a health note or vaccination" className="flex-1 p-2 rounded-md border border-input bg-background" />
                  <Button type="submit" variant="hero">Add</Button>
                </form>

                <div className="space-y-3">
                  {records.length === 0 && <div className="text-sm text-muted-foreground">No records yet.</div>}
                  {records.map((r) => (
                    <div key={r.id} className="p-3 bg-background rounded-md border border-input">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm mt-1">{r.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Care;
