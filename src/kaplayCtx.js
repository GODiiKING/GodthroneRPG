import kaplay from "kaplay";

const k = kaplay({
  width: 1920,
  height: 1080,
  letterbox: true,
  global: false,
  debug: true,
  debugKey: "d",
  buttons: {
    confirm: {
      keyboard: ["space"],
    },
    left: {
      keyboard: ["left"],
    },
    right: {
      keyboard: ["right"],
    },
    up: {
      keyboard: ["up"],
    },
    down: {
      keyboard: ["down"],
    },
  },
});

k.loadSprite("officer", "/enemies/wrazzix.png");
k.loadSprite("spider", "/enemies/chaos.png");
k.loadShaderURL("ringPattern", null, "/shaders/ringPattern.frag");
k.loadShaderURL("trianglePattern", null, "/shaders/trianglePattern.frag");
k.loadShaderURL("spiralPattern", null, "/shaders/spiralPattern.frag");

export default k;
