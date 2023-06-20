import Phaser from "phaser";
import Turret from "./classes/turrets/Turret";
import Enemy from "./classes/enemies/Enemy";
import Bullet from "./Bullet";
import BigBoy from "./classes/enemies/BigBoy";
import { placeTurretOnMap } from "./helpers/helpers";
import AutoTurret from "./classes/turrets/AutoTurret";
import CustomMoveEnemy from "./classes/enemies/CustomMoveEnemy";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
    this.one = true;
    this.resources = 100;
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
    this.resourceText = this.add.text(10, 10, `Resources: ${this.resources}`, {
      fontSize: "24px",
      // @ts-ignore
      fill: "#ffffff",
    });

    layer1.setInteractive();
    layer1.on("pointerdown", this.onTileClicked, this);

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

  updateResources() {
    this.resourceText.setText(`Resources: ${this.resources}`);
  }

  onTileClicked(pointer) {
    const tile = this.map.worldToTileXY(pointer.worldX, pointer.worldY);
    const tileId = this.map.getTileAt(tile.x, tile.y, true).index;

    if (tileId != 7 || this.resources < 50) return; // prevent tile resource issues

    // PLACE TURRET ON THE MAP
    const boundPlaceTurretOnMapFunc = placeTurretOnMap.bind(this); // Bind the function to transfer this keyword
    const newRes = boundPlaceTurretOnMapFunc(pointer, this.resources, this.map);
    this.resources = newRes;
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

// DAMAGE FUNCTION
function damageEnemy(enemy, bullet) {
  bullet.destroy();
  enemy.damageTaken(bullet.damage);
}

// DISTANCE BETWEEN TOWER AND BULLET
