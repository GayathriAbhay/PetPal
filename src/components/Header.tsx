import { Heart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white/70 to-white/30 dark:from-black/60 dark:to-black/30 backdrop-blur-md border-b border-border shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary fill-current" />
              <div className="leading-tight">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">PetPal</span>
                <div className="text-xs text-muted-foreground">Adopt · Care · Connect</div>
              </div>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/pets" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">
              Adopt
            </Link>
            <Link to="/pets" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">
              Care
            </Link>
            <Link to="/forum" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">
              Community
            </Link>
            <Link to="/" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/pets"><Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button></Link>
            <Button variant="outline" className="hidden sm:flex">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Link to="/add-pet"><Button variant="hero" className="hidden sm:flex">
              List Pet
            </Button></Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
