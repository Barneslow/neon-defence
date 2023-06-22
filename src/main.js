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
      gravity: { y: 0 },
    },
  },
  scene: [MapScene],
};

// // POWER TOWER DISABLE USE
// const elecBTN = document.getElementById("electric");

// elecBTN.addEventListener("click", () => console.log("test"));

export default new Phaser.Game(config);
