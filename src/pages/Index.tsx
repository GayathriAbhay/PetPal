import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedPets from "@/components/FeaturedPets";
import Features from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedPets />
      <Features />
    </div>
  );
};

export default Index;