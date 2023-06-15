import Phaser from "phaser";
import Turret from "./Turret";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "assets/json/2DTowerDefense.json");
    this.load.image("tiles", "assets/images/2Dsprites.png");
    this.load.image("turret", "assets/images/Turret2D.png");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("2Dsprites", "tiles", 32, 32);

    const layer1 = map.createLayer(0, tileset);
    const layer2 = map.createLayer(1, tileset);

    layer1.setInteractive(); // Make layer1 clickable
    layer1.on("pointerdown", this.onTileClicked, this); // Add click event listener
  }

  onTileClicked(pointer) {
    const map = this.make.tilemap({ key: "map" });
    const tile = map.worldToTileXY(pointer.worldX, pointer.worldY);
    console.log("Clicked on tile:", tile);
    const tileWidth = map.tileWidth;
    const tileHeight = map.tileHeight;
    const offsetX = tileWidth / 2;
    const offsetY = tileHeight / 2;
    const centerX = tile.x * tileWidth + offsetX;
    const centerY = tile.y * tileHeight + offsetY;

    // Place the turret at the center of the clicked tile
    const turret = new Turret(this, centerX, centerY, "turret");
  }
}
