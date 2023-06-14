import Phaser from "phaser";
import MapScene from "../src/Map";
import Tower from "./Tower";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 1540,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [MapScene],
};

export default new Phaser.Game(config);
