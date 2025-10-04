import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import type { MissionConfig } from "./MissionSetup";

export interface ZoneAllocations {
  lifeSupport: number;
  food: number;
  hygiene: number;
  recreation: number;
  medical: number;
  maintenance: number;
  stowage: number;
  science: number;
}

const zones = [
  { key: "lifeSupport" as keyof ZoneAllocations, label: "Life Support", description: "Oxygen, CO₂ scrubbing, climate control" },
  { key: "food" as keyof ZoneAllocations, label: "Food Production", description: "Hydroponics, food storage, preparation" },
  { key: "hygiene" as keyof ZoneAllocations, label: "Hygiene", description: "Bathrooms, water recycling, sanitation" },
  { key: "recreation" as keyof ZoneAllocations, label: "Recreation", description: "Exercise, entertainment, social spaces" },
  { key: "medical" as keyof ZoneAllocations, label: "Medical Bay", description: "Health monitoring, treatment, emergency" },
  { key: "maintenance" as keyof ZoneAllocations, label: "Maintenance", description: "Tools, repairs, spare parts" },
  { key: "stowage" as keyof ZoneAllocations, label: "Stowage", description: "General supplies, equipment storage" },
  { key: "science" as keyof ZoneAllocations, label: "Science", description: "Research, experiments, data collection" },
];

const ZoneAllocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const missionConfig = location.state?.missionConfig as MissionConfig;

  const [allocations, setAllocations] = useState<ZoneAllocations>({
    lifeSupport: 20,
    food: 15,
    hygiene: 10,
    recreation: 10,
    medical: 10,
    maintenance: 10,
    stowage: 15,
    science: 10,
  });

  const handleSliderChange = (key: keyof ZoneAllocations, value: number[]) => {
    setAllocations({ ...allocations, [key]: value[0] });
  };

  const handleStartSimulation = () => {
    navigate("/simulation", {
      state: {
        missionConfig,
        zoneAllocations: allocations,
      },
    });
  };

  if (!missionConfig) {
    navigate("/setup");
    return null;
  }

  return (
    <div className="min-h-screen p-6 scanlines">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Layers className="w-16 h-16 text-primary animate-float" />
          </div>
          <h1 className="text-5xl font-bold neon-glow">Habitat Design</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Allocate space for each habitat module. Use your intuition and knowledge 
            of what crews need to survive. No limits are shown—rely on logic and balance.
          </p>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card">
          <div className="space-y-8">
            <div className="grid gap-8">
              {zones.map((zone) => (
                <div key={zone.key} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Label className="text-lg font-semibold text-foreground">
                        {zone.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {zone.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">
                        {allocations[zone.key]}%
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[allocations[zone.key]]}
                    onValueChange={(value) => handleSliderChange(zone.key, value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-primary/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Mission Details</p>
                  <p className="text-lg font-semibold">
                    {missionConfig.crewSize} crew • {missionConfig.duration} days • {missionConfig.destination}
                  </p>
                </div>
              </div>
              
              <Button
                variant="neon"
                size="lg"
                onClick={handleStartSimulation}
                className="w-full text-lg"
              >
                Launch Simulation
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
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

export default ZoneAllocation;
