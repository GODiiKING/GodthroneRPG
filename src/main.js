import { makeEnemy } from "./entities/enemy";
import { makePlayer } from "./entities/player";
import k from "./kaplayCtx";
import playerStatsManager from "./state/playerStatsManager";
import makeBattleSystem from "./systems/battleSystem";

k.scene("playground", () => {
  // black background
  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);

  const player = makePlayer(k.center(), "Breeze");
  player.setControls();

  makeEnemy(
    k.vec2(1000, 300),
    "Spider",
    "spider",
    {
      name: "ringPattern",
      uniforms: () => ({
        u_time: k.time() / 10,
        u_color1: k.Color.fromHex("#e0d020"),
        u_color2: k.Color.fromHex("#e09810"),
        u_speed: k.vec2(1, -2),
        u_aspect: 950 / 900,
        u_opacity: 1,
      }),
    },
    {
      attack: 5,
      defense: 3,
      health: 6,
      maxHealth: 6,
      illness: {
        type: null,
        recurringDamage: 0,
      },
      exp: 10,
    },
    [
      { name: "apple", target: "self", effect: "heal", value: 2 },
      {
        name: "poison bottle",
        target: "enemy",
        effect: "illness",
        type: "poison",
        value: 2,
        rate: 0.8,
      },
      { name: "antidote", target: "self", effect: "cure", type: "poison" },
      {
        name: "strong herb",
        target: "self",
        effect: "buff",
        targetStat: "attack",
        value: 2,
      },
      {
        name: "leg hold trap",
        target: "enemy",
        effect: "debuff",
        targetStat: "attack",
        value: 2,
      },
    ]
  );

  makeEnemy(
    k.vec2(600, 300),
    "Officer",
    "officer",
    {
      name: "spiralPattern",
      uniforms: () => ({
        u_time: k.time(),
        u_color: k.Color.fromHex("#4883bd"),
        u_aspect: 1,
        u_opacity: 0.6,
      }),
    },
    {
      attack: 6,
      defense: 2,
      health: 10,
      maxHealth: 10,
      illness: {
        type: null,
        recurringDamage: 0,
      },
      exp: 12,
    },
    [{ name: "spear", target: "enemy", effect: "harm", value: 7 }]
  );

  player.onCollide("enemy", (enemy) => {
    makeBattleSystem(player, enemy);
  });
});

k.scene("gameover", () => {
  playerStatsManager.setIllness(null, 0);

  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);
  k.add([
    k.text("GAME OVER!", { size: 64 }),
    k.anchor("center"),
    k.pos(k.center()),
  ]);

  k.onButtonPress("confirm", () => {
    k.go("playground");
  });
});

k.go("playground");
