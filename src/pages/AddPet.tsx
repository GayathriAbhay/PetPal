import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePetContext } from "@/context/PetContext";

const AddPet = () => {
  const { addPet } = usePetContext();
  const [form, setForm] = useState({ name: "", breed: "", age: "", location: "", image: "", description: "" });
  const nav = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pet = addPet({ ...form, status: "available" });
    nav(`/pets/${pet.id}`);
  };

  return (
    <section className="py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Add a Pet</h2>
        <form onSubmit={onSubmit} className="space-y-4 bg-card p-6 rounded-2xl shadow">
          <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" />
          <Input value={form.breed} onChange={(e) => setForm((s) => ({ ...s, breed: e.target.value }))} placeholder="Breed" />
          <Input value={form.age} onChange={(e) => setForm((s) => ({ ...s, age: e.target.value }))} placeholder="Age" />
          <Input value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} placeholder="Location" />
          <Input value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} placeholder="Image URL" />
          <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} className="w-full p-3 rounded-md bg-background border border-input" placeholder="Description" />
          <div className="flex justify-end">
            <Button type="submit" variant="hero">Create Pet</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddPet;
