function makeGameStateManager() {
  const state = {
    isInBattle: false,
    inventory: [
      { name: "apple", target: "self", effect: "heal", value: 2 },
      { name: "boomerang", target: "enemy", effect: "harm", value: 3 },
      {
        name: "poison bottle",
        target: "enemy",
        effect: "illness",
        type: "poison",
        value: 2,
        rate: 0.8,
      },
      { name: "antidote", target: "self", effect: "cure", type: "poison" },
      { name: "revealing glass", target: "enemy", effect: "analyze" },
      {
        name: "leg hold trap",
        target: "enemy",
        effect: "debuff",
        targetStat: "attack",
        value: 2,
      },
      {
        name: "strong herb",
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
