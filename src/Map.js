import Phaser from "phaser";
import Tower from "./Tower";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
  }
  preload() {
    this.load.tilemapTiledJSON("map", "assets/json/Map.json");
    this.load.image("tiles", "assets/images/BaseSpritev2.png");
    this.load.image("tower", "assets/images/Tower.png");
  }
// @ts-ignore
    
  create() {
    var map = this.make.tilemap({ key: "map" });
    if (!map) {
      console.error("Failed to load tilemap");
      return;
    }
    var tileset = map.addTilesetImage("BaseTilesV2", "tiles");

    var layerNames = [];
    var i = 0;
    var layerName = i + "layer";

    while (map.getLayer(layerName)) {
      layerNames.push(layerName);
      i++;
      layerName = i + "layer";
    }

    layerNames.forEach((layerName) => {
      var layer = map.createLayer(layerName, tileset);
    });

    var mapWidth = map.widthInPixels;
    var mapHeight = map.heightInPixels;
    var centerX = this.cameras.main.width / 2;
    var centerY = this.cameras.main.height / 2;
    var offsetX = centerX - mapWidth / 1.4;
    var offsetY = centerY - mapHeight / 1.2;
    this.cameras.main.scrollX = offsetX;
    this.cameras.main.scrollY = offsetY;


    const newTower = new Tower(this, 200, 500);
    this.add.existing(newTower);
  }
}
