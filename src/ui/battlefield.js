import k from "../kaplayCtx";

export default function makeBattleField(
  enemyName,
  enemySprite,
  backgroundShader
) {
  const container = k.add([
    k.rect(1300, 900, { radius: 4 }),
    k.color(0, 0, 0),
    k.outline(5, new k.Color(230, 230, 230)),
    k.anchor("center"),
    k.pos(k.center().x + 200, 1600),
    {
      activate() {
        k.tween(
          this.pos.y,
          k.center().y,
          0.5,
          (newPos) => (this.pos.y = newPos),
          k.easings.linear
        );
      },
      deactivate() {
        k.tween(
          this.pos.y,
          1600,
          0.5,
          (newPos) => (this.pos.y = newPos),
          k.easings.linear
        );
      },
    },
  ]);

  container.add([
    k.uvquad(container.width - 4, container.height - 4),
    k.anchor("center"),
    k.shader(backgroundShader.name, backgroundShader.uniforms),
  ]);

  container.add([
    k.sprite(enemySprite),
    k.anchor("center"),
    k.scale(5),
    k.pos(0, -100),
    `enemy-in-battlefield-${enemyName}`,
  ]);

  return container;
}
