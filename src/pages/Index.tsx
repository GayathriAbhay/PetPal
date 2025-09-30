import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedPets from "@/components/FeaturedPets";
import Features from "@/components/Features";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <FeaturedPets />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
