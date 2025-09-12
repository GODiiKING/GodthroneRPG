import k from "../kaplayCtx";

export default function makeStatBox() {
  const statBox = k.add([
    k.rect(350, 500, { radius: 4 }),
    k.color(0, 0, 0),
    k.outline(5, new k.Color(230, 230, 230)),
    k.pos(100, -600),
    {
      activate() {
        k.tween(
          this.pos.y,
          150,
          0.5,
          (newPos) => (this.pos.y = newPos),
          k.easings.linear
        );
      },
      deactivate() {
        k.tween(
          this.pos.y,
          -600,
          0.5,
          (newPos) => (this.pos.y = newPos),
          k.easings.linear
        );
      },
    },
  ]);

  const player = k.get("player")[0];

  const nameCard = statBox.add([
    k.rect(350, 60),
    k.color(0, 0, 0),
    k.outline(5, new k.Color(230, 230, 230)),
  ]);

  nameCard.add([
    k.text(player.name),
    k.anchor("center"),
    k.pos(nameCard.width / 2, 30),
  ]);

  let prevPosY = 80;
  for (const key in player.stats) {
    if (key === "maxHealth" || key === "illness") continue;

    const statText = statBox.add([
      k.text(`${key} : ${player.stats[key]}`),
      k.color(230, 230, 230),
      k.pos(15, prevPosY),
      {
        updateOnChange() {
          this.onUpdate(() => {
            this.text = `${key} : ${player.stats[key]}`;
          });
        },
      },
    ]);
    statText.updateOnChange();
    prevPosY += 50;
  }

  return statBox;
}
