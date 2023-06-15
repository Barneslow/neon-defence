import Phaser from "phaser";
import Tower from "./Tower";

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
    this.load.image("bird", "assets/images/bird.png");

    // this.load.image("tower", "assets/images/Tower.png");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("2Dsprites", "tiles", 32, 32);

    const layer1 = map.createLayer("layer1", tileset);
    const layer2 = map.createLayer("layer2", tileset);

    // ADDING WAYPOINT PATH
    let graphics = this.add.graphics();
    path = this.add.path(145, MAP_HEIGHT);
    drawWaypointPath();
    graphics.lineStyle(5, 0xffff00, 1);
    path.draw(graphics);

    bird = this.add.sprite(0, 0, "bird");
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
