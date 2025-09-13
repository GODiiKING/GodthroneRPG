import { makeEnemy } from "./entities/enemy";
import { makePlayer } from "./entities/player";
import k from "./kaplayCtx";
import playerStatsManager from "./state/playerStatsManager";
import makeBattleSystem from "./systems/battleSystem";

// Define a scene called "playground"
k.scene("playground", () => {
  // black background
  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);

  // Create the player entity
  const player = makePlayer(k.center(), "Alpha Tester");
  player.setControls();

  // Create an enemy entity //! Mongen
  makeEnemy(
    k.vec2(1000, 300), // Position of the enemy
    "Mongen", // Name of the enemy
    "mongen", // Sprite ID
    {
      name: "ringPattern", // Shader name
      uniforms: () => ({
        // Uniforms for the shader
        u_time: k.time() / 10,
        u_color1: k.Color.fromHex("#e0d020"),
        u_color2: k.Color.fromHex("#e09810"),
        u_speed: k.vec2(1, -2),
        u_aspect: 950 / 900,
        u_opacity: 1,
      }),
    },
    {
      // Stats for the enemy
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
      // Inventory of the enemy
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

  // Create another enemy entity //! Wrazzix
  makeEnemy(
    k.vec2(600, 300), // Position of the enemy
    "Wrazzix", // Name of the enemy
    "wrazzix", // Sprite ID
    {
      name: "spiralPattern", // Shader name
      uniforms: () => ({
        // Uniforms for the shader
        u_time: k.time(),
        u_color: k.Color.fromHex("#4883bd"),
        u_aspect: 1,
        u_opacity: 0.6,
      }),
    },
    {
      // Stats for the enemy
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
    [{ name: "spear", target: "enemy", effect: "harm", value: 7 }] // Inventory of the enemy
  );


  makeEnemy(
    k.vec2(400, 150), // Different position
    "Officer", // Changed name
    "officer", // Sprite ID
    {
      name: "spiralPattern", // Shader name
      uniforms: () => ({
        // Uniforms for the shader
        u_time: k.time(),
        u_color: k.Color.fromHex("#4883bd"),
        u_aspect: 1,
        u_opacity: 0.6,
      }),
    },
    {
      // Stats for the enemy
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
    [{ name: "spear", target: "enemy", effect: "harm", value: 7 }] // Inventory of the enemy
  );


  makeEnemy(
    k.vec2(400, 150), // Different position
    "Officer", // Changed name
    "officer", // Sprite ID
    {
      name: "spiralPattern", // Shader name
      uniforms: () => ({
        // Uniforms for the shader
        u_time: k.time(),
        u_color: k.Color.fromHex("#4883bd"),
        u_aspect: 1,
        u_opacity: 0.6,
      }),
    },
    {
      // Stats for the enemy
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
    [{ name: "spear", target: "enemy", effect: "harm", value: 7 }] // Inventory of the enemy
  );



// Create another enemy entity //! shinblade
makeEnemy(
  k.vec2(800, 450), // Position of the enemy
  "Shinblade", // Name of the enemy
  "shinblade", // Sprite ID
  {
    name: "spiralPattern", // Shader name
    uniforms: () => ({
      // Uniforms for the shader
      u_time: k.time(),
      u_color: k.Color.fromHex("#4883bd"),
      u_aspect: 1,
      u_opacity: 0.6,
    }),
  },
  {
    // Stats for the enemy
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
  [{ name: "spear", target: "enemy", effect: "harm", value: 7 }] // Inventory of the enemy
);

























  // When the player collides with an enemy, initiate a battle
  player.onCollide("enemy", (enemy) => {
    makeBattleSystem(player, enemy);
  });
});

// Define a scene called "gameover"
k.scene("gameover", () => {
  // Reset player illness
  playerStatsManager.setIllness(null, 0);

  // Black background
  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);
  // Game over text
  k.add([
    k.text("GAME OVER!", { size: 64 }),
    k.anchor("center"),
    k.pos(k.center()),
  ]);

  // On confirm button press, go to the playground scene
  k.onButtonPress("confirm", () => {
    k.go("playground");
  });
});

// Start the game in the "playground" scene
k.go("playground");