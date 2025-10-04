export interface CrewMember {
  id: number;
  name: string;
  role: string;
  health: number;
  morale: number;
  performance: number;
  story: string;
}

const FIRST_NAMES = [
  "Alex", "Jordan", "Sam", "Morgan", "Casey", "Riley", "Taylor", "Quinn",
  "Avery", "Dakota", "Skyler", "Rowan", "Blake", "Cameron", "Parker", "Reese"
];

const LAST_NAMES = [
  "Chen", "Patel", "Rodriguez", "Kim", "Johnson", "Martinez", "Williams",
  "Garcia", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson"
];

const ROLES = [
  "Commander",
  "Pilot",
  "Engineer",
  "Medical Officer",
  "Science Officer",
  "Life Support Specialist",
  "Communications Officer",
  "Maintenance Chief"
];

export const generateCrew = (size: number): CrewMember[] => {
  const crew: CrewMember[] = [];
  const usedNames = new Set<string>();
  const assignedRoles = new Set<string>();

  for (let i = 0; i < size; i++) {
    let fullName: string;
    do {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));
    
    usedNames.add(fullName);

    // Assign roles in order of importance first, then repeat if needed
    let role: string;
    if (i < ROLES.length && !assignedRoles.has(ROLES[i])) {
      role = ROLES[i];
      assignedRoles.add(role);
    } else {
      role = ROLES[i % ROLES.length];
    }

    crew.push({
      id: i + 1,
      name: fullName,
      role,
      health: 100,
      morale: 100,
      performance: 100,
      story: "",
    });
  }

  return crew;
};

export const updateCrewStats = (
  crew: CrewMember[],
  stats: { oxygen: number; water: number; food: number; morale: number; repairs: number },
  allocations: any,
  difficulty: string
): CrewMember[] => {
  const difficultyMultiplier = difficulty === "hard" ? 1.5 : difficulty === "easy" ? 0.7 : 1.0;

  return crew.map((member) => {
    let healthChange = 0;
    let moraleChange = 0;
    let performanceChange = 0;

    // Health affected by oxygen, water, food, medical
    if (stats.oxygen < 50) healthChange -= (50 - stats.oxygen) * 0.3 * difficultyMultiplier;
    if (stats.water < 40) healthChange -= (40 - stats.water) * 0.25 * difficultyMultiplier;
    if (stats.food < 40) healthChange -= (40 - stats.food) * 0.3 * difficultyMultiplier;
    
    // Medical allocation helps health
    if (allocations.medical < 10) healthChange -= (10 - allocations.medical) * 0.5 * difficultyMultiplier;

    // Morale affected by recreation, food quality, general stats
    moraleChange = (stats.morale - 100) * 0.1;
    if (allocations.recreation < 10) moraleChange -= (10 - allocations.recreation) * 0.4 * difficultyMultiplier;

    // Performance is composite of health and morale
    const newHealth = Math.max(0, Math.min(100, member.health + healthChange));
    const newMorale = Math.max(0, Math.min(100, member.morale + moraleChange));
    performanceChange = (newHealth + newMorale) / 2 - member.performance;

    return {
      ...member,
      health: newHealth,
      morale: newMorale,
      performance: Math.max(0, Math.min(100, member.performance + performanceChange)),
    };
  });
};

export const generateCrewStories = (
  crew: CrewMember[],
  finalStats: any,
  allocations: any,
  difficulty: string
): CrewMember[] => {
  return crew.map((member) => {
    const storyParts: string[] = [];

    // Health-based stories
    if (member.health < 30) {
      storyParts.push(`${member.name} struggled with serious health issues throughout the mission.`);
    } else if (member.health < 60) {
      storyParts.push(`${member.name} experienced periodic health concerns but remained functional.`);
    } else if (member.health > 85) {
      storyParts.push(`${member.name} maintained excellent health throughout the mission.`);
    }

    // Morale-based stories
    if (member.morale < 30) {
      storyParts.push(`The isolation took a severe toll on ${member.name}'s mental state.`);
    } else if (member.morale < 60) {
      storyParts.push(`${member.name} found the mission psychologically challenging at times.`);
    } else if (member.morale > 85) {
      storyParts.push(`${member.name} remained positive and became a morale booster for the team.`);
    }

    // Role-specific stories
    if (member.role === "Engineer" && allocations.maintenance < 10) {
      storyParts.push(`As ${member.role}, they were constantly overwhelmed by repair demands.`);
    } else if (member.role === "Medical Officer" && allocations.medical < 10) {
      storyParts.push(`As ${member.role}, they struggled with limited medical resources.`);
    } else if (member.role === "Life Support Specialist" && finalStats.oxygen < 50) {
      storyParts.push(`As ${member.role}, they worked overtime to keep oxygen systems operational.`);
    }

    // Performance conclusion
    if (member.performance > 85) {
      storyParts.push(`Overall, ${member.name} performed admirably and exceeded expectations.`);
    } else if (member.performance < 40) {
      storyParts.push(`${member.name}'s performance suffered significantly under mission stress.`);
    }

    return {
      ...member,
      story: storyParts.join(" ") || `${member.name} completed the mission without major incident.`,
    };
  });
};
