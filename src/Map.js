import Phaser from "phaser";
import Turret from "./Turret";
import Enemy from "./Enemy";
import Bullet from "./Bullet";

let path;
let bird;
let graphics;
const MAP_HEIGHT = 768;
const MAP_WIDTH = 1024;
const PATHS = [
  { x: 145, y: 430 },
  { x: 275, y: 430 },
  { x: 275, y: 500 },
  { x: 300, y: 500 },
  { x: 300, y: 700 },
  { x: 450, y: 700 },
  { x: 450, y: 400 },
  { x: 530, y: 400 },
  { x: 530, y: 350 },
  { x: 650, y: 350 },
  { x: 650, y: 400 },
  { x: 700, y: 400 },
  { x: 725, y: 400 },
  { x: 725, y: 630 },
  { x: 690, y: 660 },
  { x: 690, y: 725 },
  { x: 875, y: 725 },
  { x: 875, y: 250 },
  { x: 400, y: 250 },
  { x: 400, y: 350 },
  { x: 300, y: 350 },
  { x: 300, y: 250 },
  { x: 175, y: 250 },
  { x: 175, y: 150 },
  { x: 450, y: 150 },
];

const speed = 2;
let currentPathIndex = 0; // Starting index of the path line

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
    this.bird = bird;
  }

  preload() {
    this.load.tilemapTiledJSON("map", "assets/json/2DTowerDefense.json");
    this.load.image("tiles", "assets/images/2Dsprites.png");

    this.load.image("turret", "assets/images/Turret2D.png");
    this.load.image("bird", "assets/images/bird.png");
    this.load.image("bullet", "assets/images/Bullet.png");
    this.load.audio("bulletsound", "assets/sounds/BulletSound.mp3");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("2Dsprites", "tiles", 32, 32);

    const layer1 = map.createLayer(0, tileset);
    const layer2 = map.createLayer(1, tileset);

    layer1.setInteractive();
    layer1.on("pointerdown", this.onTileClicked, this);

    graphics = this.add.graphics();
    path = this.add.path(145, MAP_HEIGHT);
    drawWaypointPath();
    graphics.lineStyle(5, 0xffff00, 1);
    path.draw(graphics);

    this.bird = new Enemy(this, 0, 0, "bird", path);
    this.bird.startOnPath();
  }

  onTileClicked(pointer) {
    const map = this.make.tilemap({ key: "map" });
    const tile = map.worldToTileXY(pointer.worldX, pointer.worldY);
    const tileId = map.getTileAt(tile.x, tile.y, true).index; // Get the tile index
    console.log(tileId);
    console.log("Clicked on tile:", tile);
    if (tileId === 7) {
      // Calculate the position of the center of the clicked tile
      const tileWidth = map.tileWidth;
      const tileHeight = map.tileHeight;
      const offsetX = tileWidth / 2;
      const offsetY = tileHeight / 2;
      const centerX = tile.x * tileWidth + offsetX;
      const centerY = tile.y * tileHeight + offsetY;

      // Create a new turret at the center of the clicked tile
      const turret = new Turret(this, centerX, centerY, tileId);
    }
  }

  update(time, delta) {
    this.bird.update(time, delta);
  }
}

// DRAWING PATH LINE FUNCTION
function drawWaypointPath() {
  PATHS.forEach((vector) => path.lineTo(vector.x, vector.y));
}
