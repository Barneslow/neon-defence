import Phaser from "phaser";
import Tower from "./Tower";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "assets/json/2DTowerDefense.json");
    this.load.image("tiles", "assets/images/2Dsprites.png");
    // this.load.image("tower", "assets/images/Tower.png");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("2Dsprites", "tiles", 32, 32);

    const layer1 = map.createLayer("layer1", tileset);
    const layer2 = map.createLayer("layer2", tileset);
  }
}
