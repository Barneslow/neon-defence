import Phaser from "phaser";
import FlappyScene from "./Flappy";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [FlappyScene],
};

export default new Phaser.Game(config);
