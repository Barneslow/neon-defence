import Phaser from "phaser";
import Turret from "./classes/turrets/Turret";
import Enemy from "./classes/enemies/Enemy";
import Bullet from "./Bullet";
import BigBoy from "./classes/enemies/BigBoy";
import { placeTurretOnMap } from "./helpers/helpers";
import AutoTurret from "./classes/turrets/AutoTurret";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
    this.resources = 1000;
    this.startWave = false;
    this.waveNumber = 10;
    this.boss = false;
    this.turretType = "auto";
  }

  preload() {
    this.load.tilemapTiledJSON("map", "assets/json/2DTowerDefense.json");
    this.load.image("tiles", "assets/images/2Dsprites.png");
    this.load.image("turret", "assets/images/Turret2D.png");
    this.load.image("laser", "assets/images/laser2D.png");
    this.load.image("bird", "assets/images/bird.png");
    this.load.image("robot", "assets/images/Robot2D.png");
    this.load.image("boss", "assets/images/Boss.png");
    this.load.image("bullet", "assets/images/Bullet.png");
    this.load.audio("bulletsound", "assets/sounds/BulletSound.mp3");
    this.load.audio("dead", "assets/sounds/dead-enemy.mp3");
    this.load.audio("dead-boss", "assets/sounds/dead-boss.mp3");
  }

  create() {
    const startBtn = document.getElementById("start");
    startBtn.addEventListener("click", this.startWaveFunc.bind(this));

    const autoTurret = document.getElementById("auto-turret");
    const laserTurret = document.getElementById("laser-turret");

    autoTurret.addEventListener("click", this.chooseTurretType.bind(this));
    laserTurret.addEventListener("click", this.chooseTurretType.bind(this));

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
    this.nextBoss = 0;

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
    console.log(this.resources);
  }

  onTileClicked(pointer) {
    const tile = this.map.worldToTileXY(pointer.worldX, pointer.worldY);
    const tileId = this.map.getTileAt(tile.x, tile.y, true).index;
    if (tileId != 7 || this.resources < 50) return; // prevent tile resource issues
    if (!this.turretType) return;

    // PLACE TURRET ON THE MAP
    const boundPlaceTurretOnMapFunc = placeTurretOnMap.bind(this); // Bind the function to transfer this keyword
    const newRes = boundPlaceTurretOnMapFunc(
      pointer,
      this.resources,
      this.map,
      this.turretType
    );
    this.resources = newRes;
  }

  startWaveFunc() {
    this.startWave = true;
  }

  chooseTurretType(e) {
    const type = e.target.dataset.type;
    this.turretType = type;
  }

  update(time, delta) {
    if (!this.startWave) return;
    // this.one === true
    // if (time > this.nextEnemy && this.waveNumber > 0) {
    //   // CHANGE DURATION OF ENEMY RESPAWN
    //   const enemy = new CustomMoveEnemy(this, 0, 0, "robot");
    //   this.enemies.add(enemy);

    //   this.nextEnemy = time + 2000;
    //   this.waveNumber--;
    // }

    if (time > 1000 && this.boss === false) {
      // CHANGE DURATION OF BOSS RESPAWN
      const bigboy = new BigBoy(this, 0, 0, "boss");
      this.enemies.add(bigboy);

      this.boss = true;
      // this.nextBoss = time + 10000;
    }
  }
}

// DAMAGE FUNCTION
function damageEnemy(enemy, bullet) {
  bullet.destroy();

  enemy.damageTaken(bullet.damage);
}
