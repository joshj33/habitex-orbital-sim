import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Pause, Play, FastForward } from "lucide-react";
import SimulationStats from "@/components/SimulationStats";
import HabitatVisual from "@/components/HabitatVisual";
import EventDialog, { GameEvent } from "@/components/EventDialog";
import type { MissionConfig } from "./MissionSetup";
import type { ZoneAllocations } from "./ZoneAllocation";
import { generateCrew, updateCrewStats, type CrewMember } from "@/utils/crewGenerator";

const EASY_EVENTS: GameEvent[] = [
  {
    id: 1,
    title: "Minor Equipment Check",
    description: "Routine maintenance reveals a minor issue with the air filtration system.",
    optionA: "Schedule immediate repair during next maintenance window",
    optionB: "Monitor the system closely and address if it worsens",
  },
  {
    id: 2,
    title: "Food Variety Request",
    description: "The crew is requesting more variety in their meals.",
    optionA: "Use extra rations to prepare special meals",
    optionB: "Explain resource constraints and maintain standard menu",
  },
  {
    id: 3,
    title: "Recreation Time",
    description: "Crew members want to organize a movie night.",
    optionA: "Approve and encourage team bonding activities",
    optionB: "Suggest they stay focused on mission tasks",
  },
];

const MEDIUM_EVENTS: GameEvent[] = [
  {
    id: 4,
    title: "Solar Flare Warning",
    description: "A moderate solar flare is approaching. Radiation levels will spike.",
    optionA: "Shelter crew in the most shielded areas and reduce power consumption",
    optionB: "Boost electromagnetic shielding at the cost of stored power reserves",
  },
  {
    id: 5,
    title: "Hydroponics Contamination",
    description: "Contamination detected in hydroponics. Food production may be affected.",
    optionA: "Ration food supplies and rely on stored reserves",
    optionB: "Expand the greenhouse area by converting some recreation space",
  },
  {
    id: 6,
    title: "Water Recycling Malfunction",
    description: "The water reclamation system efficiency has dropped by 30%.",
    optionA: "Reduce water usage across all systems and crew activities",
    optionB: "Divert maintenance resources to fix the system immediately",
  },
  {
    id: 7,
    title: "Crew Morale Declining",
    description: "Extended isolation is affecting crew mental health.",
    optionA: "Organize team-building activities and increase recreation time",
    optionB: "Implement strict work schedules to maintain productivity",
  },
];

const HARD_EVENTS: GameEvent[] = [
  {
    id: 8,
    title: "Critical Solar Storm",
    description: "A massive X-class solar flare is inbound. Radiation will reach dangerous levels. Systems may fail.",
    optionA: "Emergency shutdown of non-essential systems, full crew shelter protocol",
    optionB: "Attempt to maintain partial operations while reinforcing critical shielding",
  },
  {
    id: 9,
    title: "Cascading System Failure",
    description: "Life support malfunction triggered secondary failures. Oxygen production dropping rapidly.",
    optionA: "Emergency repair using all maintenance reserves, pause other operations",
    optionB: "Ration oxygen while attempting partial repairs with available resources",
  },
  {
    id: 10,
    title: "Medical Emergency",
    description: "A crew member has collapsed with unknown symptoms. Possibly contagious.",
    optionA: "Quarantine patient, run full diagnostics, use experimental treatment",
    optionB: "Treat symptomatically, monitor all crew, preserve medical supplies",
  },
  {
    id: 11,
    title: "Critical Power Failure",
    description: "Micro-meteorite damage has disabled 40% of solar panels. Power reserves depleting.",
    optionA: "Immediate EVA repair mission (high risk, uses maintenance)",
    optionB: "Reduce all systems to minimum, implement rotating brownouts",
  },
  {
    id: 12,
    title: "Psychological Crisis",
    description: "Multiple crew members showing signs of severe depression and conflict. Team cohesion breaking down.",
    optionA: "Mandatory counseling sessions, increase recreation, reduce work hours",
    optionB: "Separate conflicting parties, maintain schedules, prioritize mission objectives",
  },
];

const Simulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { missionConfig, zoneAllocations } = location.state as {
    missionConfig: MissionConfig;
    zoneAllocations: ZoneAllocations;
  };

  const [currentDay, setCurrentDay] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1000); // 1 day per second
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [eventChoices, setEventChoices] = useState<Array<{ eventId: number; choice: string }>>([]);
  const [usedEventIds, setUsedEventIds] = useState<Set<number>>(new Set());
  const [crew, setCrew] = useState<CrewMember[]>([]);

  // Stats state
  const [stats, setStats] = useState({
    oxygen: 100,
    water: 100,
    food: 100,
    power: 100,
    morale: 100,
    repairs: 100,
  });

  // Initialize crew
  useEffect(() => {
    if (missionConfig) {
      setCrew(generateCrew(missionConfig.crewSize));
    }
  }, [missionConfig]);

  useEffect(() => {
    if (!missionConfig || !zoneAllocations) {
      navigate("/setup");
      return;
    }
  }, [missionConfig, zoneAllocations, navigate]);

  // Simulation timer
  useEffect(() => {
    if (!isRunning || currentEvent) return;

    const interval = setInterval(() => {
      setCurrentDay((prev) => {
        const nextDay = prev + 1;

        // Trigger events at specific intervals (every ~20% of mission)
        const eventInterval = Math.floor(missionConfig.duration / 5);
        if (nextDay % eventInterval === 0 && nextDay < missionConfig.duration) {
          triggerRandomEvent();
        }

        // Update stats based on allocations
        updateStats();

        // Check if simulation should end
        if (nextDay >= missionConfig.duration) {
          endSimulation();
          return prev;
        }

        return nextDay;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, currentEvent, speed, missionConfig.duration]);

  const triggerRandomEvent = () => {
    // Select events based on difficulty
    let eventPool: GameEvent[] = [];
    if (missionConfig.difficulty === "easy") {
      eventPool = EASY_EVENTS;
    } else if (missionConfig.difficulty === "medium") {
      eventPool = MEDIUM_EVENTS;
    } else {
      eventPool = HARD_EVENTS;
    }

    const availableEvents = eventPool.filter((e) => !usedEventIds.has(e.id));
    if (availableEvents.length > 0) {
      const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
      setCurrentEvent(randomEvent);
      setIsRunning(false);
    }
  };

  const handleEventChoice = (choice: "A" | "B") => {
    if (currentEvent) {
      setEventChoices([...eventChoices, { eventId: currentEvent.id, choice }]);
      setUsedEventIds(new Set([...usedEventIds, currentEvent.id]));
      
      // Apply event consequences to stats
      applyEventConsequences(currentEvent.id, choice);
      
      setCurrentEvent(null);
      setIsRunning(true);
    }
  };

  const applyEventConsequences = (eventId: number, choice: string) => {
    // Simulate event impact on resources
    setStats((prev) => {
      const impact = Math.floor(Math.random() * 10) + 5;
      const newStats = { ...prev };

      switch (eventId) {
        case 1: // Solar flare
          newStats.power = Math.max(0, prev.power - (choice === "A" ? impact : impact * 2));
          break;
        case 2: // Food issue
          newStats.food = Math.max(0, prev.food - impact);
          newStats.morale = Math.max(0, prev.morale - (choice === "A" ? impact : impact / 2));
          break;
        case 3: // Morale
          newStats.morale = Math.min(100, prev.morale + (choice === "A" ? impact : -impact));
          break;
        case 4: // Water
          newStats.water = Math.max(0, prev.water - impact);
          newStats.repairs = Math.max(0, prev.repairs - (choice === "B" ? impact : 0));
          break;
        case 5: // Medical
          newStats.morale = Math.max(0, prev.morale - impact / 2);
          break;
        case 6: // Power
          newStats.power = Math.max(0, prev.power - impact);
          newStats.repairs = Math.max(0, prev.repairs - (choice === "B" ? impact : 0));
          break;
      }

      return newStats;
    });
  };

  const updateStats = () => {
    setStats((prev) => {
      // Calculate decay rates based on allocations and difficulty
      const difficultyMultiplier = missionConfig.difficulty === "hard" ? 1.3 : 
                                   missionConfig.difficulty === "easy" ? 0.7 : 1.0;
      
      const lifeDecay = Math.max(0, (20 - zoneAllocations.lifeSupport) / 20);
      const foodDecay = Math.max(0, (15 - zoneAllocations.food) / 15);
      const hygieneDecay = Math.max(0, (10 - zoneAllocations.hygiene) / 10);
      const recreationImpact = Math.max(0, (10 - zoneAllocations.recreation) / 10);
      const maintenanceDecay = Math.max(0, (10 - zoneAllocations.maintenance) / 10);

      const newStats = {
        oxygen: Math.max(0, prev.oxygen - lifeDecay * 0.5 * difficultyMultiplier),
        water: Math.max(0, prev.water - hygieneDecay * 0.3 * difficultyMultiplier),
        food: Math.max(0, prev.food - foodDecay * 0.4 * difficultyMultiplier),
        power: Math.max(0, prev.power - 0.3 * difficultyMultiplier),
        morale: Math.max(0, prev.morale - recreationImpact * 0.2 * difficultyMultiplier),
        repairs: Math.max(0, prev.repairs - maintenanceDecay * 0.2 * difficultyMultiplier),
      };

      // Update crew stats based on habitat performance
      setCrew((prevCrew) => updateCrewStats(prevCrew, newStats, zoneAllocations, missionConfig.difficulty));

      return newStats;
    });
  };

  const endSimulation = () => {
    setIsRunning(false);
    navigate("/results", {
      state: {
        missionConfig,
        zoneAllocations,
        finalStats: stats,
        eventChoices,
        crew,
      },
    });
  };

  const toggleSpeed = () => {
    if (speed === 1000) setSpeed(500); // 2x speed
    else if (speed === 500) setSpeed(250); // 4x speed
    else setSpeed(1000); // back to 1x
  };

  const progress = (currentDay / missionConfig.duration) * 100;

  return (
    <div className="min-h-screen p-6 scanlines">
      {currentEvent && <EventDialog event={currentEvent} onChoice={handleEventChoice} />}

      <div className="max-w-7xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold neon-glow">Mission In Progress</h1>
            <p className="text-muted-foreground mt-2">
              Day {currentDay} of {missionConfig.duration}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsRunning(!isRunning)}
              disabled={!!currentEvent}
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSpeed}
              disabled={!!currentEvent}
            >
              <FastForward className="h-5 w-5" />
              <span className="absolute -bottom-6 text-xs">
                {speed === 1000 ? "1x" : speed === 500 ? "2x" : "4x"}
              </span>
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-neon transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>

        {/* Stats */}
        <SimulationStats {...stats} />

        {/* Habitat Visual */}
        <HabitatVisual allocations={zoneAllocations} />

        {/* Emergency End */}
        <div className="text-center">
          <Button
            variant="destructive"
            onClick={endSimulation}
          >
            Abort Mission
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
