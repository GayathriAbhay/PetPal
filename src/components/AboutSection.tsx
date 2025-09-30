import { Code, Database, Users } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white/50 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About PetPal</h2>
            <p className="text-muted-foreground mb-6">
              PetPal is a full-stack web application designed to simplify pet adoption, manage health records, and build a community
              around responsible pet care. Browse and adopt pets, track vaccinations and vet visits, and report lost/found pets.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Tech Stack</div>
                  <div className="text-sm text-muted-foreground">Next.js (React + SSR), Tailwind CSS, NextAuth.js, MySQL</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Data & Records</div>
                  <div className="text-sm text-muted-foreground">Digital health records, vaccination tracking, and vet appointment management.</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Community</div>
                  <div className="text-sm text-muted-foreground">Forums, lost & found alerts, and community support for pet owners.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/95 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-3">Project</h3>
            <p className="text-sm text-muted-foreground mb-4">PetPal - Adopt, Care, Connect</p>
            <h4 className="font-semibold">Group Members</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside mt-2">
              <li>Anu Raphel</li>
              <li>Diya Martin</li>
              <li>Gayathri A Menon</li>
            </ul>

            <h4 className="font-semibold mt-4">Abstract</h4>
            <p className="text-sm text-muted-foreground mt-2">A platform to simplify pet adoption, manage health records, and build a community around responsible pet care.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
