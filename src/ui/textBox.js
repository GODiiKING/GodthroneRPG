import k from "../kaplayCtx";

export default function makeTextBox() {
  const textBox = k.add([
    k.rect(1400, 300, { radius: 4 }),
    k.color(0, 0, 0),
    k.outline(5, new k.Color(230, 230, 230)),
    k.pos(k.center().x + 1550, k.center().y + 150),
    {
      dialogue: null,
      lines: [],
      async displayLine(text) {
        this.lines.push(text);
        if (this.lines.length > 6) {
          this.lines.shift();
        }

        this.dialogue.text = this.lines.join("\n");
        await k.wait(1);
      },
      activate() {
        k.tween(
          this.pos.x,
          k.center().x - 500,
          0.5,
          (newPos) => (this.pos.x = newPos),
          k.easings.linear
        );
      },
      deactivate() {
        k.tween(
          this.pos.x,
          k.center().x + 1500,
          0.5,
          (newPos) => (this.pos.x = newPos),
          k.easings.linear
        );
      },
    },
  ]);

  textBox.dialogue = textBox.add([
    k.text(""),
    k.color(230, 230, 230),
    k.pos(50, 40),
  ]);

  return textBox;
}
