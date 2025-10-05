import { Card } from "@/components/ui/card";
import { User, Heart, Smile, Battery, AlertTriangle, Apple } from "lucide-react";
import { CrewMember } from "@/utils/crewGenerator";

interface CrewStatsPanelProps {
  crew: CrewMember[];
}

const CrewStatsPanel = ({ crew }: CrewStatsPanelProps) => {
  const getStatColor = (value: number, inverted = false) => {
    if (inverted) {
      if (value > 70) return "text-destructive";
      if (value > 40) return "text-warning";
      return "text-success";
    }
    if (value > 70) return "text-success";
    if (value > 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <h2 className="text-2xl font-bold mb-4 neon-glow">Crew Status</h2>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {crew.map((member) => (
          <div
            key={member.id}
            className="bg-muted/30 rounded-lg p-4 border border-primary/10 hover:border-primary/30 transition-all hover:shadow-neon"
          >
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Health</p>
                  <p className={`text-sm font-bold ${getStatColor(member.health)}`}>
                    {member.health.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Morale</p>
                  <p className={`text-sm font-bold ${getStatColor(member.morale)}`}>
                    {member.morale.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Fatigue</p>
                  <p className={`text-sm font-bold ${getStatColor(member.fatigue, true)}`}>
                    {member.fatigue.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Stress</p>
                  <p className={`text-sm font-bold ${getStatColor(member.stress, true)}`}>
                    {member.stress.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Nutrition</p>
                  <p className={`text-sm font-bold ${getStatColor(member.nutrition)}`}>
                    {member.nutrition.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-neon" />
                <div>
                  <p className="text-xs text-muted-foreground">Performance</p>
                  <p className={`text-sm font-bold ${getStatColor(member.performance)}`}>
                    {member.performance.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CrewStatsPanel;
