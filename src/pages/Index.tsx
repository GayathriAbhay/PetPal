import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedPets from "@/components/FeaturedPets";
import Features from "@/components/Features";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [showAbout, setShowAbout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#about") {
      setShowAbout(true);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Header onAboutClick={() => setShowAbout(true)} />
      <HeroSection />

      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-4xl w-full relative">
            <button onClick={() => setShowAbout(false)} className="absolute -top-3 -right-3 bg-card p-2 rounded-full shadow">
              Close
            </button>
            <AboutSection />
          </div>
        </div>
      )}

      <FeaturedPets />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
