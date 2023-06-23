import Phaser from "phaser";
import Turret from "./classes/turrets/Turret";
import BaseEnemy from "./classes/enemies/BaseEnemy";
import Bullet from "./classes/bullet/Bullet";
import { formatDuration, placeTurretOnMap } from "./helpers/helpers";
import { enemyClassTypes } from "./config/enemy-config";
import BaseTurret from "./classes/turrets/BaseTurret";
import { WAVE_DATA } from "./config/wave-config";
import { turretsClassTypes } from "./config/turrets-config";
import PowerTurret from "./classes/turrets/PowerTurret";
import DroneEnemy from "./classes/enemies/DroneClass";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
    this.resources = 2000;
    this.score = 0;
    this.isWaveInProgress = false;
    this.startedGame = false;
    this.waveIndex = 0;
    this.boss = false;
    this.turretType = "auto";
    this.waveArray = convertObjectToArray(WAVE_DATA[this.waveIndex]);
    this.hearts = 3;
    this.electric = false;
    this.fire = false;
    this.freeze = false;
    this.speedMultiplyer = 1;
    this.difficulty = 1;
    this.timeUntilNextWave = 0;
    this.isGamePaused = false;
    this.isAudioMuted = false;
  }

  preload() {
    this.load.tilemapTiledJSON("map", "assets/json/2DTowerDefense.json");
    this.load.image("tiles", "assets/images/2Dsprites.png");

    loadAllSprites(this);

    loadAllAudio(this);
  }

  create() {
    const startBtn = document.getElementById("start");
    startBtn.addEventListener("click", this.startWave.bind(this));
    this.startBtn = startBtn;

    const speedBtn = document.getElementById("speed-up");
    speedBtn.addEventListener("click", this.increaseGameSpeed.bind(this));

    const pauseBtn = document.getElementById("pause");
    pauseBtn.addEventListener("click", this.togglePause.bind(this));

    const modalPauseBtnClose = document
      .getElementById("modalPause")
      .querySelector(".close-button");

    modalPauseBtnClose.addEventListener("click", this.togglePause.bind(this));

    const settingsBtn = document.getElementById("settings");
    settingsBtn.addEventListener("click", this.togglePause.bind(this));

    const modalSettingsBtnClose = document
      .getElementById("modalSettings")
      .querySelector(".close-button");

    modalSettingsBtnClose.addEventListener(
      "click",
      this.togglePause.bind(this)
    );

    const modalSettingsBtnAudio = document.getElementById("music");

    modalSettingsBtnAudio.addEventListener(
      "click",
      this.toggleAudioMute.bind(this)
    );

    const replayBtn = document.getElementById("replay-button");
    replayBtn.addEventListener("click", () => location.reload());

    const heartContainer = document.getElementById("heart-container");
    this.heartContainer = heartContainer;
    const autoTurret = document.getElementById("auto-turret");
    const laserTurret = document.getElementById("laser-turret");
    const shotgunTurret = document.getElementById("shotgun-turret");
    const humanTurret = document.getElementById("human-turret");

    autoTurret.addEventListener("click", this.chooseTurretType.bind(this));
    laserTurret.addEventListener("click", this.chooseTurretType.bind(this));
    shotgunTurret.addEventListener("click", this.chooseTurretType.bind(this));
    humanTurret.addEventListener("click", this.chooseTurretType.bind(this));

    const electricTower = document.getElementById("electric");
    electricTower.addEventListener(
      "click",
      this.purchaseTower.bind(this, "electric", electricTower)
    );

    const fireTower = document.getElementById("fire");
    fireTower.addEventListener(
      "click",
      this.purchaseTower.bind(this, "fire", fireTower)
    );

    const freezeTower = document.getElementById("freeze");
    freezeTower.addEventListener(
      "click",
      this.purchaseTower.bind(this, "freeze", freezeTower)
    );

    const map = this.make.tilemap({ key: "map" });
    this.map = map;
    const tileset = map.addTilesetImage("2Dsprites", "tiles", 32, 32);

    const layer1 = map.createLayer(0, tileset);

    // createContainerText(this);
    this.resourceText = this.add.text(0, 0, `Resources: ${this.resources}`, {
      fontSize: "26px",
      backgroundColor: "#180727",
      fontFamily: "Work Sans",
      // @ts-ignore
      padding: 10,
    });

    this.scoreText = this.add.text(900, 0, `Score: ${this.score}`, {
      fontSize: "26px",
      backgroundColor: "#180727",
      fontFamily: "Work Sans",
      // @ts-ignore
      padding: 10,
    });

    this.waveTimeRemainingText = this.add.text(
      350,
      0,
      `Time Until Next Wave: ${this.timeUntilNextWave}`,
      {
        fontSize: "24px",
        backgroundColor: "black",
        fontFamily: "Work Sans",
        // @ts-ignore
        padding: 10,
      }
    );

    layer1.setInteractive();
    // layer2.setInteractive(false);
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

    // OVERLAP FUNCTION
    this.physics.add.overlap(this.enemies, this.bullets, damageEnemy);

    this.displayHearts();
  }

  toggleAudioMute() {
    if (this.isAudioMuted) {
      this.game.sound.mute = true;
    } else {
      this.game.sound.mute = false;
    }
  }

  purchaseTower(type, element) {
    if (this[type] === true) return;
    let tileID;

    if (type === "electric") {
      tileID = 39;
    }
    if (type === "fire") {
      tileID = 59;
    }
    if (type === "freeze") {
      tileID = 49;
    }
    const tileInstances = [];

    const tileLayer = this.map.getLayer(0);

    tileLayer.data.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile.index === tileID) {
          tileInstances.push({ x, y });
        }
      });
    });

    const tile = tileInstances[0];
    const tileWidth = this.map.tileWidth;
    const tileHeight = this.map.tileHeight;
    const offsetX = tileWidth;
    const offsetY = tileHeight;
    const centerX = tile.x * tileWidth + offsetX;
    const centerY = tile.y * tileHeight + offsetY - 15;

    new PowerTurret(this, centerX, centerY, turretsClassTypes[type]);

    this[type] = true;
  }

  displayHearts() {
    const hearts = Array.from(Array(this.hearts).keys());
    this.heartContainer.innerHTML = "";
    hearts.forEach((heart) => {
      const imageElement = document.createElement("img");
      imageElement.classList.add("heart-icon");
      imageElement.src = `./assets/images/life-heart.png`;
      this.heartContainer.appendChild(imageElement);
    });
  }

  increaseGameSpeed() {
    this.speedMultiplyer = 2;
  }

  updateResources() {
    this.resourceText.setText(`Resources: ${this.resources}`);
    this.scoreText.setText(`Score: ${this.score}`);
  }

  updateWaveTimeRemaining() {
    // console.log(this.timeUntilNextWave);
    this.waveTimeRemainingText.setText(
      `Time Until Next Wave: ${formatDuration(this.timeUntilNextWave)}`
    );
  }

  onTileClicked(pointer) {
    const tile = this.map.worldToTileXY(pointer.worldX, pointer.worldY);
    const tileId = this.map.getTileAt(tile.x, tile.y, true).index;
    // console.log(tileId);
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

  togglePause() {
    if (this.isGamePaused) {
      this.physics.resume();
      this.scene.resume();
      this.isGamePaused = false;
    } else {
      this.physics.pause();
      this.scene.pause();
      this.isGamePaused = true;
    }
  }

  chooseTurretType(e) {
    const type = e.target.dataset.type;
    this.turretType = type;
  }

  takeHeart() {
    this.hearts--;
    if (this.hearts == 0) {
      this.gameOver();
    }
    this.displayHearts();
  }

  gameOver() {
    this.physics.resume();
    this.scene.resume();
    const modalGameOver = document.getElementById("modalGameOver");
    modalGameOver.setAttribute("open", "");

    const score = document.getElementById("score");

    score.textContent = `Your Score ${this.score.toString()}`;
  }

  spawnEnemiesForWave(enemyType) {
    let enemy;
    if (enemyType === "drone") {
      enemy = new DroneEnemy(this, 0, 0, enemyClassTypes[enemyType]);
    } else {
      enemy = new BaseEnemy(this, 0, 0, enemyClassTypes[enemyType]);
    }
    this.enemies.add(enemy);
    this.waveArray.shift();
  }

  startWave() {
    this.startedGame = true;
    // @ts-ignore
    this.startBtn.disabled = true;
    // @ts-ignore
    const previousTimers = this.time._active;
    // remove previous timer
    if (previousTimers.length > 0) {
      previousTimers.forEach((timer) => this.time.removeEvent(timer));
    }

    if (WAVE_DATA.length <= this.waveIndex) {
      return;
    }

    if (!this.isWaveInProgress) {
      this.isWaveInProgress = true;
      this.waveArray = convertObjectToArray(WAVE_DATA[this.waveIndex]);

      const time = this.waveArray.length * 2000;

      this.timeUntilNextWave = time;

      this.time.addEvent({
        delay: 1000,
        repeat: time / 1000,
        callback: () => {
          this.timeUntilNextWave = this.timeUntilNextWave - 1000;
        },
        callbackScope: this,
      });
    }
  }

  endWave() {
    this.waveIndex++;
    this.isWaveInProgress = false;
    if (this.waveIndex >= WAVE_DATA.length) return;
    this.waveArray = convertObjectToArray(WAVE_DATA[this.waveIndex]);
  }

  // victory() {
  //   this.physics.resume();
  //   this.scene.resume();
  //   const modalGameOver = document.getElementById("modalGameOver");
  //   modalGameOver.setAttribute("open", "");

  //   const score = document.getElementById("score");

  //   score.textContent = this.score.toString();
  // }

  update(time, delta) {
    if (!this.startedGame) return;
    this.updateWaveTimeRemaining();

    if (this.enemies.getLength() === 0 && WAVE_DATA.length <= this.waveIndex) {
      this.gameOver();
    }

    if (this.timeUntilNextWave <= 0) {
      this.startWave();
    }
    if (!this.isWaveInProgress) return;

    if (time > this.nextEnemy && this.waveArray.length > 0) {
      // CHANGE DURATION OF ENEMY RESPAWN
      this.spawnEnemiesForWave(this.waveArray[0]);
      this.nextEnemy = time + 2000 / this.speedMultiplyer;
    }

    if (time > this.nextEnemy && this.waveArray.length === 0) {
      this.endWave();
      // @ts-ignore
      this.startBtn.disabled = false;
    }
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

function loadAllSprites(scene) {
  // Turret Sprites
  scene.load.image("turret", "assets/images/turrets/Turret2D.png");
  scene.load.image("turret2", "assets/images/turrets/Turret2Dlvl2.png");
  scene.load.image("turret3", "assets/images/turrets/Turret2Dlvl3.png");

  // Laser Sprites
  scene.load.image("laser", "assets/images/turrets/LaserTurret.png");
  scene.load.image("laser2", "assets/images/turrets/LaserTurretlvl2.png");
  scene.load.image("laser3", "assets/images/turrets/LaserTurretlvl3.png");

  // Shotgun Sprites
  scene.load.image("shotgun", "assets/images/turrets/ShotGunTurret.png");
  scene.load.image("shotgun2", "assets/images/turrets/ShotGunTurretlvl2.png");
  scene.load.image("shotgun3", "assets/images/turrets/ShotGunTurretlvl3.png");

  // Human Sprites
  scene.load.image("human", "assets/images/turrets/HumanTurret.png");
  scene.load.image("human2", "assets/images/turrets/HumanTurretlvl2.png");
  scene.load.image("human3", "assets/images/turrets/HumanTurretlvl3.png");

  // Electric Sprites
  scene.load.image("electric", "assets/images/turrets/ElectricTowerActive.png");
  scene.load.image(
    "electric-inactive",
    "assets/images/turrets/ElectricTowerInactive.png"
  );

  // Freeze Sprites
  scene.load.image("freeze", "assets/images/turrets/FreezeTowerActive.png");
  scene.load.image(
    "freeze-inactive",
    "assets/images/turrets/ElectricTowerInactive.png"
  );

  // Fire Sprites
  scene.load.image("fire", "assets/images/turrets/FireTowerActive.png");
  scene.load.image(
    "fire-inactive",
    "assets/images/turrets/FireTowerInactive.png"
  );

  // Enemy Sprites
  scene.load.image("robot", "assets/images/enemies/robot.png");
  scene.load.image("heavybot", "assets/images/enemies/heavybot.png");
  scene.load.image("spider", "assets/images/enemies/spider.png");
  scene.load.image("drone", "assets/images/enemies/drone.png");
  scene.load.image("golem", "assets/images/enemies/golem.png");
  scene.load.image("boss", "assets/images/enemies/boss.png");

  // Bullet Sprites
  scene.load.image("bullet", "assets/images/Bullet.png");
  scene.load.image("ShotGunBullet", "assets/images/ShotGunBullet.png");
  scene.load.image("HumanBullet", "assets/images/HumanBullet.png");
}

function loadAllAudio(scene) {
  scene.load.audio("electric-audio", "assets/sounds/electricity.mp3");
  scene.load.audio("fire-audio", "assets/sounds/fire.mp3");
  scene.load.audio("freeze-audio", "assets/sounds/freeze.mp3");
  scene.load.audio("power-up", "assets/sounds/power-up.mp3");
  scene.load.audio("laser", "assets/sounds/laser.mp3");

  scene.load.audio("bulletsound", "assets/sounds/BulletSound.mp3");
  scene.load.audio("dead", "assets/sounds/dead-enemy.mp3");
  scene.load.audio("dead-boss", "assets/sounds/dead-boss.mp3");
}
