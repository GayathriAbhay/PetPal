import { Heart, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-pets.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Floating Hearts Animation */}
          <div className="absolute -top-10 left-1/4 animate-float">
            <Heart className="h-6 w-6 text-white/30 fill-current" />
          </div>
          <div className="absolute -top-6 right-1/3 animate-float" style={{ animationDelay: '1s' }}>
            <Star className="h-8 w-8 text-white/40" />
          </div>
          <div className="absolute top-4 left-1/3 animate-float" style={{ animationDelay: '2s' }}>
            <Heart className="h-5 w-5 text-white/35 fill-current" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent animate-pulse-glow">
              Perfect Companion
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with loving pets waiting for their forever homes. Track their health, build community, and make a difference in their lives.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by breed, age, location..."
                  className="border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>
              <Button variant="hero" size="lg" className="shrink-0">
                <Search className="h-5 w-5 mr-2" />
                Find Pets
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl" className="group">
              <Heart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Start Adopting
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">1,200+</div>
              <div className="text-white/80 text-sm md:text-base">Pets Adopted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
              <div className="text-white/80 text-sm md:text-base">Happy Families</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
              <div className="text-white/80 text-sm md:text-base">Partner Shelters</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;