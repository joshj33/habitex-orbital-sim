import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export interface GameEvent {
  id: number;
  title: string;
  description: string;
  optionA: string;
  optionB: string;
}

interface EventDialogProps {
  event: GameEvent;
  onChoice: (choice: "A" | "B") => void;
}

const EventDialog = ({ event, onChoice }: EventDialogProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
      <Card className="max-w-2xl w-full p-8 bg-card border-warning shadow-glow">
        <div className="flex items-start gap-4 mb-6">
          <AlertTriangle className="w-12 h-12 text-warning flex-shrink-0 animate-pulse" />
          <div>
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p className="text-lg text-muted-foreground">{event.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onChoice("A")}
            className="w-full text-left justify-start h-auto py-4 px-6 hover:border-primary hover:bg-primary/10"
          >
            <span className="font-semibold mr-2">Option A:</span>
            {event.optionA}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onChoice("B")}
            className="w-full text-left justify-start h-auto py-4 px-6 hover:border-secondary hover:bg-secondary/10"
          >
            <span className="font-semibold mr-2">Option B:</span>
            {event.optionB}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EventDialog;
