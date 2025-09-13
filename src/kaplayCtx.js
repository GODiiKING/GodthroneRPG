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

// Add these with your existing sprite loading
k.loadSprite("ven", "/enemies/ven.png");
k.loadSprite("khalifa", "/enemies/khalifa.png");
k.loadSprite("joker", "/enemies/joker.png");
k.loadSprite("hoodini", "/enemies/hoodini.png");
k.loadSprite("vancuba", "/enemies/vancuba.png");
k.loadSprite("chaos", "/enemies/chaos.png");
k.loadSprite("spider", "/enemies/spider.png");
k.loadSprite("opriser", "/enemies/opriser.png");
k.loadSprite("kami", "/enemies/kami.png");
k.loadSprite("wrazzix", "/enemies/wrazzix.png"); //Block 3 //! Wrazzix
k.loadSprite("officer", "/enemies/officer.png");
k.loadSprite("mongen", "/enemies/mongen.png"); //Block 2 //! Mongen
k.loadSprite("shinblade", "/enemies/shinblade.png"); //Block 1 //! Shinblade
k.loadShaderURL("ringPattern", null, "/shaders/ringPattern.frag");
k.loadShaderURL("trianglePattern", null, "/shaders/trianglePattern.frag");
k.loadShaderURL("spiralPattern", null, "/shaders/spiralPattern.frag");

export default k;
