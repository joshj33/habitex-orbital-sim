import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Rocket, Target, Users, LineChart } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 scanlines">
      <div className="max-w-5xl w-full space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold neon-glow tracking-wider">
            HABITEX
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Space Habitat Survival Simulation
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-card/50 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-primary/20 shadow-card">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">
                Why Simulation Matters
              </h2>
              <p className="text-lg text-foreground/90 leading-relaxed">
                Before humans venture into the depths of space, astronauts train extensively using 
                sophisticated simulations. These models help them understand resource management, 
                anticipate emergencies, and prepare for the psychological challenges of long-duration 
                missions.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                In <span className="text-primary font-semibold">Habitex</span>, you'll design and manage a space habitat, 
                making critical decisions about life support, crew welfare, and mission success. Every 
                choice matters—just like in real space travel.
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 pt-6">
              <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/30 border border-primary/10 transition-all duration-300 hover:bg-muted/50 hover:border-primary/30 hover:shadow-neon hover:scale-105 hover:-translate-y-1 cursor-pointer group">
                <Rocket className="w-8 h-8 text-primary flex-shrink-0 mt-1 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">Real-World Science</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on actual space mission planning and resource requirements
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/30 border border-primary/10 transition-all duration-300 hover:bg-muted/50 hover:border-secondary/30 hover:shadow-neon hover:scale-105 hover:-translate-y-1 cursor-pointer group">
                <Target className="w-8 h-8 text-secondary flex-shrink-0 mt-1 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-secondary transition-colors">Strategic Decisions</h3>
                  <p className="text-sm text-muted-foreground">
                    Balance resources, crew morale, and mission objectives
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/30 border border-primary/10 transition-all duration-300 hover:bg-muted/50 hover:border-accent/30 hover:shadow-neon hover:scale-105 hover:-translate-y-1 cursor-pointer group">
                <Users className="w-8 h-8 text-accent flex-shrink-0 mt-1 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">Dynamic Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Respond to emergencies and unexpected challenges
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/30 border border-primary/10 transition-all duration-300 hover:bg-muted/50 hover:border-success/30 hover:shadow-neon hover:scale-105 hover:-translate-y-1 cursor-pointer group">
                <LineChart className="w-8 h-8 text-success flex-shrink-0 mt-1 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-success transition-colors">Learn & Improve</h3>
                  <p className="text-sm text-muted-foreground">
                    Get detailed feedback and optimize your habitat design
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center pt-6">
              <Button 
                variant="neon" 
                size="lg"
                onClick={() => navigate("/setup")}
                className="text-lg px-12 py-6 h-auto"
              >
                Begin Simulation
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground">
          A realistic space habitat management experience
        </p>
      </div>
    </div>
  );
};

export default Landing;
