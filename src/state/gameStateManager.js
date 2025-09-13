function makeGameStateManager() {
  const state = {
    isInBattle: false,
    inventory: [
      { name: "Devil's Brownies", target: "self", effect: "heal", value: 2 },
      { name: "One Above All", target: "enemy", effect: "harm", value: 3 },
      {
        name: "Kief of the Void",
        target: "enemy",
        effect: "illness",
        type: "poison",
        value: 2,
        rate: 0.8,
      },
      { name: "Thousand-Faced", target: "self", effect: "cure", type: "poison" },
      { name: "Abysmal Sight", target: "enemy", effect: "analyze" },
      {
        name: "Azazeal",
        target: "enemy",
        effect: "debuff",
        targetStat: "attack",
        value: 2,
      },
      {
        name: "Carnage Enigma",
        target: "self",
        effect: "buff",
        targetStat: "attack",
        value: 2,
      },
    ],
  };

  return {
    current() {
      return { ...state };
    },
    set(key, value) {
      if (key in state) {
        state[key] = value;
        return;
      }

      throw new Error("Can only modify existing state props!");
    },
  };
}

const gameStateManager = makeGameStateManager();

export default gameStateManager;
