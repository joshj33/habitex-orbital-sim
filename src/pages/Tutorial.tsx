import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, BookOpen, Info } from "lucide-react";
import type { MissionConfig } from "./MissionSetup";

const Tutorial = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const missionConfig = location.state?.missionConfig as MissionConfig;

  const handleProceed = () => {
    navigate("/allocation", { state: { missionConfig } });
  };

  if (!missionConfig) {
    navigate("/setup");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 scanlines">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-primary animate-float" />
          </div>
          <h1 className="text-5xl font-bold neon-glow">How to Play</h1>
          <p className="text-lg text-muted-foreground">
            Learn the basics before you begin your mission
          </p>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Info className="w-6 h-6" />
              Mission Overview
            </h2>
            <p className="text-foreground/90 leading-relaxed">
              You will design a space habitat by allocating space to different modules. Your goal is to 
              keep your crew alive, healthy, and productive throughout the entire mission.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Key Concepts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold mb-2">Life Support</h4>
                <p className="text-sm text-muted-foreground">
                  Systems that provide oxygen, remove CO₂, and maintain temperature and pressure. 
                  Essential for survival.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold mb-2">Food Production</h4>
                <p className="text-sm text-muted-foreground">
                  Hydroponics, storage, and meal prep. Ensures nutrition and can boost morale 
                  with fresh food.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold mb-2">Crew Morale</h4>
                <p className="text-sm text-muted-foreground">
                  Mental well-being affected by recreation, social spaces, and mission events. 
                  Low morale reduces efficiency.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold mb-2">Maintenance</h4>
                <p className="text-sm text-muted-foreground">
                  Tools and spare parts for repairs. Critical systems will fail without adequate 
                  maintenance resources.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold mb-2">Medical Bay</h4>
                <p className="text-sm text-muted-foreground">
                  Health monitoring and emergency treatment. Prevents illness from becoming 
                  mission-critical.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold mb-2">Stowage</h4>
                <p className="text-sm text-muted-foreground">
                  General storage for supplies and equipment. Provides buffer for unexpected 
                  needs.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-primary/20">
            <h3 className="text-xl font-semibold text-primary">Gameplay Flow</h3>
            <ol className="space-y-3 text-foreground/90">
              <li className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>Allocate habitat space based on your intuition and mission requirements</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>Watch the simulation run in real-time (1 day = 1 second, adjustable speed)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>Respond to 3-6 dynamic events that test your decision-making</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>Receive detailed feedback on crew performance, systems, and habitat design</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">5.</span>
                <span>Learn from advice and replay with improved strategies</span>
              </li>
            </ol>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <p className="text-sm text-foreground/90">
              <span className="font-semibold text-warning">Note:</span> No resource limits are shown 
              during allocation. You must rely on logic and balance. Your difficulty level (
              <span className="font-semibold capitalize">{missionConfig.difficulty}</span>) will affect 
              event complexity and grading strictness.
            </p>
          </div>

          <Button
            variant="neon"
            size="lg"
            onClick={handleProceed}
            className="w-full text-lg"
          >
            Begin Habitat Design
            <ArrowRight className="ml-2" />
          </Button>
        </Card>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/setup")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Mission Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
