import { Box, Circle } from "lucide-react";
import type { ZoneAllocations } from "@/pages/ZoneAllocation";

interface HabitatVisualProps {
  allocations: ZoneAllocations;
}

const HabitatVisual = ({ allocations }: HabitatVisualProps) => {
  const modules = [
    { key: "lifeSupport", label: "Life Support", color: "bg-success/30 border-success" },
    { key: "food", label: "Food", color: "bg-accent/30 border-accent" },
    { key: "hygiene", label: "Hygiene", color: "bg-primary/30 border-primary" },
    { key: "recreation", label: "Recreation", color: "bg-secondary/30 border-secondary" },
    { key: "medical", label: "Medical", color: "bg-destructive/30 border-destructive" },
    { key: "maintenance", label: "Maintenance", color: "bg-warning/30 border-warning" },
    { key: "stowage", label: "Stowage", color: "bg-muted border-muted-foreground" },
    { key: "science", label: "Science", color: "bg-primary-glow/30 border-primary-glow" },
  ];

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Box className="w-5 h-5 text-primary" />
        Habitat Modules
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modules.map((module) => {
          const allocation = allocations[module.key as keyof ZoneAllocations];
          const size = Math.max(60, allocation * 1.2);
          
          return (
            <div
              key={module.key}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:scale-105 transition-transform"
            >
              <div
                className={`${module.color} border-2 rounded-lg flex items-center justify-center mb-2 animate-pulse-glow`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              >
                <Circle className="w-4 h-4 fill-current opacity-50" />
              </div>
              <p className="text-xs font-semibold text-center">{module.label}</p>
              <p className="text-xs text-muted-foreground">{allocation}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitatVisual;
