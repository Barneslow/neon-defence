import Phaser from "phaser";
import MapScene from "../src/Map";

const startBtn = document.getElementById("start");

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 1024,
  height: 768,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [MapScene],
};

startBtn.addEventListener("click", () => console.log("start"));

export default new Phaser.Game(config);
