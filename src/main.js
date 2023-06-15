import Phaser from "phaser";
import MapScene from "../src/Map";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 1024,
  height: 768,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [MapScene],
};

export default new Phaser.Game(config);
