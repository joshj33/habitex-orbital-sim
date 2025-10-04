import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, TrendingUp, AlertCircle, Rocket } from "lucide-react";
import type { MissionConfig } from "./MissionSetup";
import type { ZoneAllocations } from "./ZoneAllocation";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { missionConfig, zoneAllocations, finalStats, eventChoices } = location.state as {
    missionConfig: MissionConfig;
    zoneAllocations: ZoneAllocations;
    finalStats: { oxygen: number; water: number; food: number; power: number; morale: number; repairs: number };
    eventChoices: Array<{ eventId: number; choice: string }>;
  };

  // Calculate overall score
  const avgStats = Object.values(finalStats).reduce((a, b) => a + b, 0) / 6;
  const totalAllocation = Object.values(zoneAllocations).reduce((a, b) => a + b, 0);
  
  // Generate grade
  const getGrade = () => {
    if (avgStats >= 80) return { letter: "A", color: "text-success", message: "Outstanding!" };
    if (avgStats >= 60) return { letter: "B", color: "text-primary", message: "Well Done!" };
    if (avgStats >= 40) return { letter: "C", color: "text-warning", message: "Good Effort!" };
    return { letter: "D", color: "text-destructive", message: "Keep Learning!" };
  };

  const grade = getGrade();

  // Generate story based on performance
  const generateStory = () => {
    const stories = [];
    
    if (finalStats.oxygen < 40) {
      stories.push("The crew struggled with oxygen supply, leading to emergency protocols and reduced activity.");
    } else if (finalStats.oxygen > 80) {
      stories.push("Life support systems operated flawlessly, keeping the crew well-oxygenated throughout the mission.");
    }

    if (finalStats.morale < 40) {
      stories.push("Crew morale plummeted due to limited recreation facilities, affecting mission efficiency.");
    } else if (finalStats.morale > 80) {
      stories.push("Strong team cohesion and adequate recreation maintained excellent crew morale.");
    }

    if (finalStats.food < 40) {
      stories.push("Food shortages forced the crew to ration supplies, causing stress and health concerns.");
    }

    if (finalStats.power < 40) {
      stories.push("Power management became critical, with frequent brownouts affecting operations.");
    }

    if (stories.length === 0) {
      stories.push("The mission proceeded smoothly with balanced resource management and crew cooperation.");
    }

    return stories.join(" ");
  };

  // Generate improvement advice
  const generateAdvice = () => {
    const advice = [];

    if (zoneAllocations.lifeSupport < 15) {
      advice.push("**Life Support**: Increase allocation to at least 20% to ensure stable oxygen and climate control.");
    }
    if (zoneAllocations.food < 12) {
      advice.push("**Food Production**: Boost to 15%+ for reliable nutrition and hydroponics backup.");
    }
    if (zoneAllocations.recreation < 8) {
      advice.push("**Recreation**: Allocate 10-15% to maintain crew mental health on long missions.");
    }
    if (zoneAllocations.maintenance < 8) {
      advice.push("**Maintenance**: Ensure 10%+ for repairs and spare parts to handle emergencies.");
    }
    if (zoneAllocations.medical < 8) {
      advice.push("**Medical**: Dedicate 10%+ for health monitoring and emergency treatment.");
    }
    if (totalAllocation < 90 || totalAllocation > 110) {
      advice.push("**Balance**: Your total allocation is unbalanced. Aim for around 100% distributed wisely.");
    }

    if (advice.length === 0) {
      advice.push("**Excellent balance!** Consider minor tweaks based on mission-specific needs.");
    }

    return advice;
  };

  const story = generateStory();
  const advice = generateAdvice();

  return (
    <div className="min-h-screen p-6 scanlines">
      <div className="max-w-5xl mx-auto space-y-8 py-12 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <Trophy className="w-20 h-20 text-primary mx-auto animate-float" />
          <h1 className="text-5xl font-bold neon-glow">Mission Complete</h1>
          <p className="text-lg text-muted-foreground">
            {missionConfig.destination} • {missionConfig.duration} Days • {missionConfig.crewSize} Crew
          </p>
        </div>

        {/* Grade */}
        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card text-center">
          <h2 className="text-2xl font-semibold mb-4">Mission Grade</h2>
          <div className={`text-8xl font-bold ${grade.color} neon-glow mb-2`}>
            {grade.letter}
          </div>
          <p className="text-xl text-muted-foreground">{grade.message}</p>
        </Card>

        {/* Story */}
        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            Mission Story
          </h2>
          <p className="text-lg leading-relaxed text-foreground/90">
            {story}
          </p>
        </Card>

        {/* Final Stats */}
        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Final Resource Levels
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(finalStats).map(([key, value]) => (
              <div key={key} className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground capitalize">{key}</p>
                <p className={`text-3xl font-bold ${value > 70 ? 'text-success' : value > 40 ? 'text-warning' : 'text-destructive'}`}>
                  {value.toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Zone Allocations */}
        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card">
          <h2 className="text-2xl font-semibold mb-6">Your Zone Allocations</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(zoneAllocations).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center bg-muted/20 rounded p-3">
                <span className="capitalize text-foreground/90">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-bold text-primary">{value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-primary/20">
            <p className="text-right font-semibold">
              Total: <span className={totalAllocation === 100 ? 'text-success' : 'text-warning'}>{totalAllocation}%</span>
            </p>
          </div>
        </Card>

        {/* Advice */}
        <Card className="p-8 bg-card/50 backdrop-blur-md border-warning/20 shadow-card">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-warning" />
            Improvement Recommendations
          </h2>
          <div className="space-y-3">
            {advice.map((item, idx) => (
              <div key={idx} className="bg-muted/20 rounded-lg p-4">
                <p className="text-foreground/90">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="neon"
            size="lg"
            onClick={() => navigate("/setup")}
            className="text-lg"
          >
            Try Another Mission
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/")}
            className="text-lg"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
