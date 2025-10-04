import { Progress } from "@/components/ui/progress";
import { Droplet, Wind, Utensils, Zap, Heart, Wrench } from "lucide-react";

interface SimulationStatsProps {
  oxygen: number;
  water: number;
  food: number;
  power: number;
  morale: number;
  repairs: number;
}

const SimulationStats = ({ oxygen, water, food, power, morale, repairs }: SimulationStatsProps) => {
  const stats = [
    { label: "Oxygen", value: oxygen, icon: Wind, color: "text-success" },
    { label: "Water", value: water, icon: Droplet, color: "text-primary" },
    { label: "Food", value: food, icon: Utensils, color: "text-accent" },
    { label: "Power", value: power, icon: Zap, color: "text-warning" },
    { label: "Morale", value: morale, icon: Heart, color: "text-secondary" },
    { label: "Repairs", value: repairs, icon: Wrench, color: "text-muted-foreground" },
  ];

  const getProgressColor = (value: number) => {
    if (value > 70) return "bg-success";
    if (value > 40) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${stat.color}`} />
              <span className="font-semibold text-sm">{stat.label}</span>
            </div>
            <div className="space-y-2">
              <Progress
                value={stat.value}
                className="h-2"
                indicatorClassName={getProgressColor(stat.value)}
              />
              <p className="text-right text-sm font-bold">{stat.value}%</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimulationStats;
