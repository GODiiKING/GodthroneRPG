function makePlayerStatsManager() {
  const stats = {
    health: 10,
    maxHealth: 10,
    attack: 5,
    defense: 2,
    lvl: 1,
    exp: 0,
    illness: {
      type: null,
      recurringDamage: 0,
    },
  };

  return {
    current() {
      return { ...stats };
    },
    setIllness(type, recurringDamage) {
      stats.illness.type = type;
      stats.illness.recurringDamage = recurringDamage;
    },
  };
}

const playerStatsManager = makePlayerStatsManager();

export default playerStatsManager;
