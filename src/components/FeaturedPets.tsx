import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PetCard from "./PetCard";

const FeaturedPets = () => {
  const featuredPets = [
    {
      id: "1",
      name: "Luna",
      breed: "Golden Retriever",
      age: "2 years",
      location: "San Francisco, CA",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=faces",
      description: "Luna is a gentle, loving dog who adores children and other pets. She's house-trained and knows basic commands."
    },
    {
      id: "2", 
      name: "Whiskers",
      breed: "Maine Coon",
      age: "3 years",
      location: "Oakland, CA",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&crop=faces",
      description: "Whiskers is a calm and affectionate cat who loves to cuddle. Perfect for families looking for a gentle companion."
    },
    {
      id: "3",
      name: "Rocky",
      breed: "German Shepherd Mix",
      age: "4 years", 
      location: "Berkeley, CA",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=faces",
      description: "Rocky is an energetic and loyal dog. He loves outdoor activities and would be perfect for an active family."
    },
    {
      id: "4",
      name: "Bella",
      breed: "Siamese",
      age: "1 year",
      location: "Palo Alto, CA", 
      image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop&crop=faces",
      description: "Bella is a playful and curious kitten. She's very social and loves interactive toys and games."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet Your New
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Best Friend
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            These amazing pets are looking for their forever homes. Each one has been cared for by our partner shelters and is ready to bring joy to your family.
          </p>
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} {...pet} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="hero" size="lg" className="group">
            View All Pets
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPets;