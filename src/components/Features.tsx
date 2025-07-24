import { Heart, Shield, Users, Calendar } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Heart,
      title: "Easy Adoption Process",
      description: "Streamlined adoption workflow with digital applications, background checks, and meet-and-greet scheduling."
    },
    {
      icon: Shield,
      title: "Health Records & Care",
      description: "Complete digital health records, vaccination tracking, and vet appointment management for your pet's wellbeing."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with other pet owners, share experiences, and get support from our caring community."
    },
    {
      icon: Calendar,
      title: "Lost & Found Network",
      description: "Quickly report and search for lost pets with our community-powered lost and found system."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PetPal?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're more than just an adoption platform. We're building a comprehensive ecosystem for pet care and community connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;