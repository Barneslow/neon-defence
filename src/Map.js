import Phaser from "phaser";
import Turret from "./Turret";

let path;
let bird;
const MAP_HEIGHT = 768;
const MAP_WIDTH = 1024;

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
    const tileId = map.getTileAt(tile.x, tile.y, true).index; // Get the tile index
    console.log(tileId);
    console.log("Clicked on tile:", tile);
    if (tileId === 7) {
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
}

// DRAWING PATH LINE FUNCTION
function drawWaypointPath() {
  path.lineTo(145, 430);
  path.lineTo(260, 430);
  path.lineTo(300, 700);
  path.lineTo(450, 700);
  path.lineTo(450, 400);
  path.lineTo(725, 400);
  path.lineTo(725, 725);
  path.lineTo(875, 725);
  path.lineTo(875, 250);
  path.lineTo(400, 250);
  path.lineTo(400, 350);
  path.lineTo(300, 350);
  path.lineTo(300, 250);
  path.lineTo(175, 250);
  path.lineTo(175, 150);
  path.lineTo(450, 150);
}
