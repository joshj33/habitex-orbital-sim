import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, TrendingUp, AlertCircle, Rocket, Users, Activity, Heart } from "lucide-react";
import type { MissionConfig } from "./MissionSetup";
import type { ZoneAllocations } from "./ZoneAllocation";
import { generateCrewStories, type CrewMember } from "@/utils/crewGenerator";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { missionConfig, zoneAllocations, finalStats, eventChoices, crew: rawCrew } = location.state as {
    missionConfig: MissionConfig;
    zoneAllocations: ZoneAllocations;
    finalStats: { oxygen: number; water: number; food: number; power: number; morale: number; repairs: number };
    eventChoices: Array<{ eventId: number; choice: string }>;
    crew: CrewMember[];
  };

  // Generate final crew stories
  const crew = generateCrewStories(rawCrew, finalStats, zoneAllocations, missionConfig.difficulty);

  // Calculate overall score
  const avgStats = Object.values(finalStats).reduce((a, b) => a + b, 0) / 6;
  const totalAllocation = Object.values(zoneAllocations).reduce((a, b) => a + b, 0);
  
  // Generate grade (scaled by difficulty)
  const getGrade = () => {
    let thresholds = { A: 80, B: 60, C: 40 };
    
    if (missionConfig.difficulty === "easy") {
      thresholds = { A: 70, B: 50, C: 30 };
    } else if (missionConfig.difficulty === "hard") {
      thresholds = { A: 85, B: 70, C: 50 };
    }

    if (avgStats >= thresholds.A) return { letter: "A", color: "text-success", message: "Outstanding Performance!" };
    if (avgStats >= thresholds.B) return { letter: "B", color: "text-primary", message: "Well Done!" };
    if (avgStats >= thresholds.C) return { letter: "C", color: "text-warning", message: "Mission Complete!" };
    return { letter: "D", color: "text-destructive", message: "Critical Learning Opportunity" };
  };

  const grade = getGrade();

  // Calculate team dynamics
  const avgCrewHealth = crew.reduce((sum, c) => sum + c.health, 0) / crew.length;
  const avgCrewMorale = crew.reduce((sum, c) => sum + c.morale, 0) / crew.length;
  const avgCrewPerformance = crew.reduce((sum, c) => sum + c.performance, 0) / crew.length;

  // Generate mission story
  const generateStory = () => {
    const stories = [];
    
    if (finalStats.oxygen < 40) {
      stories.push("Life support systems struggled throughout the mission. The crew spent days in emergency protocols, breathing thin air and rationing activity.");
    } else if (finalStats.oxygen > 80) {
      stories.push("Life support systems operated flawlessly, maintaining optimal atmospheric conditions that kept the crew energized and alert.");
    }

    if (avgCrewMorale < 40) {
      stories.push("Crew morale collapsed under the weight of isolation and limited recreation. Tensions rose and productivity plummeted.");
    } else if (avgCrewMorale > 80) {
      stories.push("Strong team cohesion emerged as crew members bonded through shared challenges and adequate recreational activities.");
    }

    if (finalStats.food < 40) {
      stories.push("Food shortages became severe. Ration cuts led to hunger, stress, and declining physical health across the crew.");
    } else if (finalStats.food > 80) {
      stories.push("The food production system thrived, providing fresh vegetables that boosted both nutrition and morale.");
    }

    if (finalStats.power < 40) {
      stories.push("Power crises dominated the mission. Frequent brownouts forced difficult choices about which systems to keep online.");
    }

    if (avgCrewHealth < 50) {
      stories.push("Medical resources proved inadequate. Crew health deteriorated, with multiple members requiring ongoing treatment.");
    }

    if (stories.length === 0) {
      stories.push("The mission proceeded smoothly with balanced resource management and strong crew cooperation throughout.");
    }

    return stories.join(" ");
  };

  // Generate system-by-system analysis
  const systemAnalysis = [
    {
      name: "Life Support",
      score: finalStats.oxygen,
      allocation: zoneAllocations.lifeSupport,
      feedback: finalStats.oxygen > 70 ? "Excellent oxygen and climate control" : 
                finalStats.oxygen > 40 ? "Adequate but could be improved" : 
                "Critical failures endangered crew"
    },
    {
      name: "Food Systems",
      score: finalStats.food,
      allocation: zoneAllocations.food,
      feedback: finalStats.food > 70 ? "Reliable food production and storage" : 
                finalStats.food > 40 ? "Occasional shortages occurred" : 
                "Severe malnutrition risk"
    },
    {
      name: "Water & Hygiene",
      score: finalStats.water,
      allocation: zoneAllocations.hygiene,
      feedback: finalStats.water > 70 ? "Efficient recycling maintained cleanliness" : 
                finalStats.water > 40 ? "Rationing was sometimes necessary" : 
                "Sanitation became a health hazard"
    },
    {
      name: "Crew Well-being",
      score: avgCrewMorale,
      allocation: zoneAllocations.recreation,
      feedback: avgCrewMorale > 70 ? "Recreation facilities boosted mental health" : 
                avgCrewMorale > 40 ? "Limited activities led to boredom" : 
                "Psychological support was inadequate"
    },
    {
      name: "Medical Bay",
      score: avgCrewHealth,
      allocation: zoneAllocations.medical,
      feedback: avgCrewHealth > 70 ? "Comprehensive health monitoring prevented issues" : 
                avgCrewHealth > 40 ? "Basic treatment available but limited" : 
                "Insufficient resources for emergencies"
    },
    {
      name: "Maintenance",
      score: finalStats.repairs,
      allocation: zoneAllocations.maintenance,
      feedback: finalStats.repairs > 70 ? "Well-stocked workshop handled all repairs" : 
                finalStats.repairs > 40 ? "Some repairs delayed due to shortages" : 
                "Critical systems went unrepaired"
    },
  ];

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
          <p className="text-sm text-muted-foreground mt-2">
            Difficulty: <span className="capitalize font-semibold">{missionConfig.difficulty}</span>
          </p>
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

        {/* Team Performance */}
        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Team Performance
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-success" />
              <p className="text-sm text-muted-foreground">Average Health</p>
              <p className={`text-3xl font-bold ${avgCrewHealth > 70 ? 'text-success' : avgCrewHealth > 40 ? 'text-warning' : 'text-destructive'}`}>
                {avgCrewHealth.toFixed(0)}%
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Average Morale</p>
              <p className={`text-3xl font-bold ${avgCrewMorale > 70 ? 'text-success' : avgCrewMorale > 40 ? 'text-warning' : 'text-destructive'}`}>
                {avgCrewMorale.toFixed(0)}%
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-sm text-muted-foreground">Average Performance</p>
              <p className={`text-3xl font-bold ${avgCrewPerformance > 70 ? 'text-success' : avgCrewPerformance > 40 ? 'text-warning' : 'text-destructive'}`}>
                {avgCrewPerformance.toFixed(0)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Individual Crew Members */}
        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card">
          <h2 className="text-2xl font-semibold mb-6">Individual Crew Reports</h2>
          <div className="space-y-6">
            {crew.map((member) => (
              <div key={member.id} className="bg-muted/20 rounded-lg p-6 border border-primary/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center bg-muted/20 rounded p-2">
                      <p className="text-xs text-muted-foreground">Health</p>
                      <p className={`font-bold ${member.health > 70 ? 'text-success' : member.health > 40 ? 'text-warning' : 'text-destructive'}`}>
                        {member.health.toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center bg-muted/20 rounded p-2">
                      <p className="text-xs text-muted-foreground">Morale</p>
                      <p className={`font-bold ${member.morale > 70 ? 'text-success' : member.morale > 40 ? 'text-warning' : 'text-destructive'}`}>
                        {member.morale.toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center bg-muted/20 rounded p-2">
                      <p className="text-xs text-muted-foreground">Performance</p>
                      <p className={`font-bold ${member.performance > 70 ? 'text-success' : member.performance > 40 ? 'text-warning' : 'text-destructive'}`}>
                        {member.performance.toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center bg-muted/20 rounded p-2">
                      <p className="text-xs text-muted-foreground">Fatigue</p>
                      <p className={`font-bold ${member.fatigue < 30 ? 'text-success' : member.fatigue < 60 ? 'text-warning' : 'text-destructive'}`}>
                        {member.fatigue.toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center bg-muted/20 rounded p-2">
                      <p className="text-xs text-muted-foreground">Stress</p>
                      <p className={`font-bold ${member.stress < 30 ? 'text-success' : member.stress < 60 ? 'text-warning' : 'text-destructive'}`}>
                        {member.stress.toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center bg-muted/20 rounded p-2">
                      <p className="text-xs text-muted-foreground">Nutrition</p>
                      <p className={`font-bold ${member.nutrition > 70 ? 'text-success' : member.nutrition > 40 ? 'text-warning' : 'text-destructive'}`}>
                        {member.nutrition.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-foreground/80 leading-relaxed">{member.story}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* System Analysis */}
        <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-card">
          <h2 className="text-2xl font-semibold mb-6">Habitat System Analysis</h2>
          <div className="space-y-4">
            {systemAnalysis.map((system, idx) => (
              <div key={idx} className="bg-muted/20 rounded-lg p-4 border border-primary/10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{system.name}</h3>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Allocated: <span className="font-bold text-primary">{system.allocation}%</span>
                    </span>
                    <span className={`font-bold ${system.score > 70 ? 'text-success' : system.score > 40 ? 'text-warning' : 'text-destructive'}`}>
                      Performance: {system.score.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{system.feedback}</p>
              </div>
            ))}
          </div>
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
