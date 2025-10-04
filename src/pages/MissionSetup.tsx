import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Rocket } from "lucide-react";

export interface MissionConfig {
  destination: string;
  crewSize: number;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
}

const MissionSetup = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<MissionConfig>({
    destination: "",
    crewSize: 0,
    duration: 0,
    difficulty: "medium",
  });

  const handleStart = () => {
    if (config.destination && config.crewSize && config.duration && config.difficulty) {
      navigate("/tutorial", { state: { missionConfig: config } });
    }
  };

  const isValid = config.destination && config.crewSize && config.duration && config.difficulty;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 scanlines">
      <div className="max-w-3xl w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Rocket className="w-16 h-16 text-primary animate-float" />
          </div>
          <h1 className="text-5xl font-bold neon-glow">Mission Setup</h1>
          <p className="text-lg text-muted-foreground">
            Configure your space habitat mission parameters
          </p>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card">
          <div className="space-y-8">
            {/* Destination */}
            <div className="space-y-3">
              <Label htmlFor="destination" className="text-lg font-semibold text-foreground">
                Destination
              </Label>
              <Select
                value={config.destination}
                onValueChange={(value) => setConfig({ ...config, destination: value })}
              >
                <SelectTrigger 
                  id="destination"
                  className="w-full h-12 bg-muted/30 border-primary/30 focus:border-primary"
                >
                  <SelectValue placeholder="Select mission destination" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-primary/30">
                  <SelectItem value="moon">Lunar Orbit</SelectItem>
                  <SelectItem value="mars">Mars Surface</SelectItem>
                  <SelectItem value="leo">Low Earth Orbit (LEO)</SelectItem>
                  <SelectItem value="asteroid">Asteroid Belt</SelectItem>
                  <SelectItem value="deep-space">Deep Space</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Crew Size */}
            <div className="space-y-3">
              <Label htmlFor="crew" className="text-lg font-semibold text-foreground">
                Crew Size
              </Label>
              <Select
                value={config.crewSize.toString()}
                onValueChange={(value) => setConfig({ ...config, crewSize: parseInt(value) })}
              >
                <SelectTrigger 
                  id="crew"
                  className="w-full h-12 bg-muted/30 border-primary/30 focus:border-primary"
                >
                  <SelectValue placeholder="Select number of crew members" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-primary/30">
                  <SelectItem value="2">2 Crew Members</SelectItem>
                  <SelectItem value="4">4 Crew Members</SelectItem>
                  <SelectItem value="6">6 Crew Members</SelectItem>
                  <SelectItem value="8">8 Crew Members</SelectItem>
                  <SelectItem value="12">12 Crew Members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label htmlFor="duration" className="text-lg font-semibold text-foreground">
                Mission Duration
              </Label>
              <Select
                value={config.duration.toString()}
                onValueChange={(value) => setConfig({ ...config, duration: parseInt(value) })}
              >
                <SelectTrigger 
                  id="duration"
                  className="w-full h-12 bg-muted/30 border-primary/30 focus:border-primary"
                >
                  <SelectValue placeholder="Select mission length" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-primary/30">
                  <SelectItem value="30">30 Days (1 Month)</SelectItem>
                  <SelectItem value="90">90 Days (3 Months)</SelectItem>
                  <SelectItem value="180">180 Days (6 Months)</SelectItem>
                  <SelectItem value="365">365 Days (1 Year)</SelectItem>
                  <SelectItem value="730">730 Days (2 Years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <Label htmlFor="difficulty" className="text-lg font-semibold text-foreground">
                Difficulty Level
              </Label>
              <Select
                value={config.difficulty}
                onValueChange={(value: "easy" | "medium" | "hard") => setConfig({ ...config, difficulty: value })}
              >
                <SelectTrigger 
                  id="difficulty"
                  className="w-full h-12 bg-muted/30 border-primary/30 focus:border-primary"
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-primary/30">
                  <SelectItem value="easy">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Easy</span>
                      <span className="text-xs text-muted-foreground">Forgiving grading, clear outcomes</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Medium</span>
                      <span className="text-xs text-muted-foreground">Balanced challenge, realistic</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hard">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Hard</span>
                      <span className="text-xs text-muted-foreground">Strict grading, complex events</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Button */}
            <Button
              variant="neon"
              size="lg"
              onClick={handleStart}
              disabled={!isValid}
              className="w-full text-lg"
            >
              Proceed to Habitat Design
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </Card>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissionSetup;
