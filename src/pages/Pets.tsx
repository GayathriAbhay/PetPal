import { Link } from "react-router-dom";
import { usePetContext } from "@/context/PetContext";
import PetCard from "@/components/PetCard";

const Pets = () => {
  const { pets } = usePetContext();

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Available Pets</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pets.map((p) => (
            <Link key={p.id} to={`/pets/${p.id}`}>
              <PetCard {...p} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pets;
