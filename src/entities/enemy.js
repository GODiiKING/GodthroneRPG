import k from "../kaplayCtx";

export function makeEnemy(pos, name, sprite, backgroundShader, stats, items) {
  return k.add([
    k.rect(64, 64),
    k.color(200, 10, 100),
    k.anchor("center"),
    k.area(),
    k.body({ isStatic: true }),
    k.pos(pos),
    "enemy",
    {
      name,
      sprite,
      stats,
      items,
      backgroundShader,
      type: "enemy",
      async shake() {
        const enemyInBattlefield = k.get(`enemy-in-battlefield-${name}`, {
          recursive: true,
        })[0];
        const initialPos = enemyInBattlefield.pos.y;
        await k.tween(
          initialPos,
          enemyInBattlefield.pos.y + 20,
          0.02,
          (val) => (enemyInBattlefield.pos.y = val),
          k.easings.linear
        );
        await k.tween(
          enemyInBattlefield.pos.y,
          initialPos,
          0.02,
          (val) => (enemyInBattlefield.pos.y = val),
          k.easings.linear
        );
      },
      async dropDown() {
        const enemyInBattlefield = k.get(`enemy-in-battlefield-${name}`, {
          recursive: true,
        })[0];
        await k.tween(
          enemyInBattlefield.pos.y,
          enemyInBattlefield.pos.y + 310,
          0.2,
          (val) => (enemyInBattlefield.pos.y = val),
          k.easings.linear
        );
      },
    },
  ]);
}
