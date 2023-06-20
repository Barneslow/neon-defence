import Phaser from "phaser";
import Turret from "./classes/turrets/Turret";
import Enemy from "./classes/enemies/Enemy";
import Bullet from "./Bullet";
import BigBoy from "./classes/enemies/BigBoy";
import { placeTurretOnMap } from "./helpers/helpers";
import AutoTurret from "./classes/turrets/AutoTurret";
import CustomMoveEnemy from "./classes/enemies/CustomMoveEnemy";

let path;
let graphics;
const radius = 500;
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

let resources = 100;

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
    this.one = true;
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
    this.map = map;
    const tileset = map.addTilesetImage("2Dsprites", "tiles", 32, 32);

    const layer1 = map.createLayer(0, tileset);
    // const layer2 = map.createLayer(1, tileset);
    // const pathTiles = this.map.getTilesWithinWorldXY(145, 10, 700, 1000);
    // console.log(pathTiles);
    this.resourceText = this.add.text(10, 10, `Resources: ${resources}`, {
      fontSize: "24px",
      // @ts-ignore
      fill: "#ffffff",
    });

    layer1.setInteractive();
    layer1.on("pointerdown", this.onTileClicked, this);

    graphics = this.add.graphics();
    path = this.add.path(145, MAP_HEIGHT);
    drawWaypointPath();
    path.draw(graphics);
    this.nextEnemy = 0;

    // ADDING COLLISION FUNCTION BETWEEN CLASSES
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.turrets = this.add.group({
      classType: Turret && AutoTurret,
      runChildUpdate: true,
    });
    this.input.on("pointerdown", this.shootBullet, this);
    // OVERLAP FUNCTION
    this.physics.add.overlap(this.enemies, this.bullets, damageEnemy);
  }

  shootBullet(pointer) {
    const turretsInRange = this.turrets.getChildren().filter((turret) => {
      const distanceToPointer = Phaser.Math.Distance.Between(
        turret.x,
        turret.y,
        pointer.worldX,
        pointer.worldY
      );
      return distanceToPointer <= turret.range;
    });

    if (turretsInRange.length > 0) {
      const controlledTurret = turretsInRange[0]; // Use the first turret in range
      controlledTurret.shootBullet();
    }
  }

  onTileClicked(pointer) {
    const map = this.make.tilemap({ key: "map" });
    const tile = map.worldToTileXY(pointer.worldX, pointer.worldY);
    const tileId = map.getTileAt(tile.x, tile.y, true).index;
    console.log(tileId);
    // Bind functions to this keyword
    const boundPlaceTurretOnMapFunc = placeTurretOnMap.bind(this);
    boundPlaceTurretOnMapFunc(pointer, resources, map);
  }

  update(time, delta) {
    // this.one === true
    if (time > this.nextEnemy) {
      // CHANGE DURATION OF ENEMY RESPAWN
      const enemy = new CustomMoveEnemy(this, 0, 0, "bird");
      this.enemies.add(enemy);
      this.one = false;

      // if (time / 10 > this.nextEnemy) {
      //   const bigboy = new BigBoy(this, 0, 0, "bird", path);
      //   this.enemies.add(bigboy);
      // }

      this.nextEnemy = time + 2000;
    }
  }
}

// DRAWING PATH LINE FUNCTION
function drawWaypointPath() {
  PATHS.forEach((vector) => path.lineTo(vector.x, vector.y));
}

// DAMAGE FUNCTION
function damageEnemy(enemy, bullet) {
  bullet.destroy();
  enemy.damageTaken(50);
}

// DISTANCE BETWEEN TOWER AND BULLET
