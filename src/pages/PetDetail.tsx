import { useParams } from "react-router-dom";
import { usePetContext } from "@/context/PetContext";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PetDetail = () => {
  const { id } = useParams();
  const { getPet, getHealthForPet, addHealthRecord, requestAdoption } = usePetContext();
  const pet = id ? getPet(id) : undefined;
  const records = id ? getHealthForPet(id) : [];
  const [note, setNote] = useState("");
  const [requestName, setRequestName] = useState("");

  if (!pet) return <div className="p-8">Pet not found</div>;

  const onAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    addHealthRecord({ petId: id, title: "Vaccine", notes: note, date: new Date().toISOString() });
    setNote("");
  };

  const onRequestAdopt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !requestName) return;
    requestAdoption({ petId: id, requester: requestName, message: "I'd love to adopt!" });
    setRequestName("");
    alert("Adoption request sent — stored locally.");
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src={pet.image} alt={pet.name} className="w-full h-96 object-cover" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{pet.name}</h1>
              <div className="text-muted-foreground">{pet.breed} · {pet.age}</div>
              <div className="flex items-center text-sm text-muted-foreground mt-2"><MapPin className="h-4 w-4 mr-1" />{pet.location}</div>
            </div>
            <div>
              <Button variant="ghost" size="icon"><Heart className="h-5 w-5 text-red-500" /></Button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{pet.description}</p>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Health Records</h4>
              <form onSubmit={onAddRecord} className="flex gap-2 mb-4">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes (vaccination, vet visit)" className="flex-1 p-2 rounded-md border border-input bg-background" />
                <Button type="submit" variant="hero">Add</Button>
              </form>

              <div className="space-y-3">
                {records.length === 0 && <div className="text-sm text-muted-foreground">No records yet.</div>}
                {records.map((r) => (
                  <div key={r.id} className="p-3 bg-background rounded-md border border-input">
                    <div className="text-sm font-semibold">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</div>
                    <div className="text-sm mt-1">{r.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Request Adoption</h4>
              <form onSubmit={onRequestAdopt} className="flex gap-2">
                <input value={requestName} onChange={(e) => setRequestName(e.target.value)} placeholder="Your name" className="flex-1 p-2 rounded-md border border-input bg-background" />
                <Button type="submit" variant="hero">Request</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetDetail;
