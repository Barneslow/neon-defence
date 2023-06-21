import Phaser from "phaser";
import Turret from "./classes/turrets/Turret";
import BaseEnemy from "./classes/enemies/BaseEnemy";
import Bullet from "./Bullet";
import { placeTurretOnMap } from "./helpers/helpers";
import { enemyClassTypes } from "./config/enemy-config";
import BaseTurret from "./classes/turrets/BaseTurret";
import { WAVE_DATA, MIN_WAVE_DATA } from "./data/waves";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
    this.resources = 1000;
    this.score = 0;
    this.isWaveInProgress = false;
    this.waveIndex = 0;
    this.boss = false;
    this.turretType = "auto";
    this.waveArray = convertObjectToArray(WAVE_DATA[this.waveIndex]);
    this.hearts = 3;
  }

  preload() {
    this.load.tilemapTiledJSON("map", "assets/json/2DTowerDefense.json");
    this.load.image("tiles", "assets/images/2Dsprites.png");

    // Turret Sprites
    this.load.image("turret", "assets/images/Turret2D.png");
    this.load.image("turret2", "assets/images/Turret2Dlvl2.png");
    this.load.image("turret3", "assets/images/Turret2Dlvl3.png");

    // Laser Sprites
    this.load.image("laser", "assets/images/LaserTurret.png");
    this.load.image("laser2", "assets/images/LaserTurretlvl2.png");
    this.load.image("laser3", "assets/images/LaserTurretlvl3.png");

    // Enemy Sprites
    this.load.image("bird", "assets/images/bird.png");
    this.load.image("robot", "assets/images/Robot2D.png");
    this.load.image("boss", "assets/images/Boss.png");
    this.load.image("spider", "assets/images/spider.png");

    this.load.image("bullet", "assets/images/Bullet.png");
    this.load.audio("bulletsound", "assets/sounds/BulletSound.mp3");
    this.load.audio("dead", "assets/sounds/dead-enemy.mp3");
    this.load.audio("dead-boss", "assets/sounds/dead-boss.mp3");
  }

  create() {
    const startBtn = document.getElementById("start");
    startBtn.addEventListener("click", this.startWave.bind(this));
    const heartContainer = document.getElementById("heartContainer");
    this.heartContainer = heartContainer;
    const autoTurret = document.getElementById("auto-turret");
    const laserTurret = document.getElementById("laser-turret");
    this.displayHearts();
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
    this.scoreText = this.add.text(700, 10, `Score: ${this.score}`, {
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
      classType: BaseEnemy,
      runChildUpdate: true,
    });

    this.turrets = this.add.group({
      classType: Turret && BaseTurret,
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

  displayHearts() {
    const hearts = Array.from(Array(this.hearts).keys());
    this.heartContainer.innerHTML = "";
    hearts.forEach((heart) => {
      const html = document.createElement("img");
      html.src = `./assets/images/bird.png`;
      this.heartContainer.appendChild(html);
    });
    console.log(hearts);
  }

  updateResources() {
    this.resourceText.setText(`Resources: ${this.resources}`);
    this.scoreText.setText(`Score: ${this.score}`);
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

  chooseTurretType(e) {
    const type = e.target.dataset.type;
    this.turretType = type;
  }

  startWave() {
    if (!this.isWaveInProgress) {
      this.isWaveInProgress = true;
      this.waveArray = convertObjectToArray(WAVE_DATA[this.waveIndex]);
    }
  }

  // spawnEnemy(enemyType) {
  //   if (MIN_WAVE_DATA[this.waveIndex] > 0) {
  //     const enemy = new BaseEnemy(this, 0, 0, enemyClassTypes[enemyType]);
  //     this.enemies.add(enemy);

  //     MIN_WAVE_DATA[this.waveIndex]--;

  //     if (MIN_WAVE_DATA[this.waveIndex] === 0) {
  //       if (this.waveIndex === MIN_WAVE_DATA.length - 1) {
  //         console.log("game over");
  //         this.isWaveInProgress = false;
  //       } else {
  //         console.log("next wave");
  //         this.waveIndex++;
  //         this.isWaveInProgress = false;
  //       }
  //     }
  //   }
  // }

  takeHeart() {
    this.hearts--;
    if (this.hearts == 0) {
      this.gameOver();
    }
    this.displayHearts();
  }

  gameOver() {
    console.log("game over");
  }

  spawnEnemiesForWave(enemyType) {
    const enemy = new BaseEnemy(this, 0, 0, enemyClassTypes[enemyType]);
    this.enemies.add(enemy);
    this.waveArray.shift();
  }

  endWave() {
    this.waveIndex++;
    this.waveArray = convertObjectToArray(WAVE_DATA[this.waveIndex]);
    console.log("next wave");
    this.isWaveInProgress = false;
  }

  update(time, delta) {
    if (!this.isWaveInProgress) return;
    console.log(this.waveArray.length);

    if (time > this.nextEnemy && this.waveArray.length > 0) {
      // CHANGE DURATION OF ENEMY RESPAWN

      console.log("spawn enemy");
      this.spawnEnemiesForWave(this.waveArray[0]);
      this.nextEnemy = time + 2000;
    }
    if (time > this.nextEnemy && this.waveArray.length === 0) {
      this.endWave();
    }

    // if (time > 1000 && this.boss === false) {
    //   // CHANGE DURATION OF BOSS RESPAWN
    //   const bigboy = new BaseEnemy(this, 0, 0, enemyClassTypes.boss);
    //   this.enemies.add(bigboy);
    //   this.boss = true;
    //   // this.nextBoss = time + 10000;
    // }
  }
}

// DAMAGE FUNCTION
function damageEnemy(enemy, bullet) {
  bullet.destroy();

  enemy.damageTaken(bullet.damage);
}
function convertObjectToArray(obj) {
  const array = [];

  // Iterate over the object properties
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Skip the "boss" key for now
      if (key !== "boss" && value > 0) {
        // Create individual strings for each enemy type
        for (let i = 0; i < value; i++) {
          array.push(key);
        }
      }
    }
  }

  // Add the "boss" key last if it exists and its value is greater than 0
  if (obj.hasOwnProperty("boss") && obj.boss > 0) {
    array.push("boss");
  }

  return array.filter((element) => element !== "enemies");
}
