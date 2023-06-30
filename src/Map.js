import Phaser from "phaser";
import Turret from "./classes/turrets/Turret";
import BaseEnemy from "./classes/enemies/BaseEnemy";
import Bullet from "./classes/bullet/Bullet";
import { formatDuration, toggleCurrentEnemiesSpeed } from "./helpers/helpers";
import { enemyClassTypes } from "./config/enemy-config";
import BaseTurret from "./classes/turrets/BaseTurret";
import { WAVE_DATA } from "./config/wave-config";
import { turretsClassTypes } from "./config/turrets-config";
import PowerTurret from "./classes/turrets/PowerTurret";
import DroneEnemy from "./classes/enemies/DroneClass";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { firebaseAuth, firebaseDB } from "./config/firebase";
import * as Sprites from "./parcelSpriteImports";
import * as AudioFiles from "./parcelAudioImports";
import lifeHeartImage from "../assets/images/life-heart.png";
import { createGameMap } from "./helpers/mapCreationHelpers";

const NEXT_WAVE_TIME = 30000;
const difficulty = localStorage.getItem("difficulty") || "4";
let hearts;

if (difficulty === "1") {
  hearts = 5;
}
if (difficulty === "2") {
  hearts = 4;
}
if (difficulty === "4") {
  hearts = 3;
}
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
    this.hearts = hearts;
    this.electric = false;
    this.fire = false;
    this.freeze = false;
    this.speedMultiplyer = 1;
    this.timeUntilNextWave = 0;
    this.isGamePaused = false;
    this.isAudioMuted = false;
    this.isMusicMuted = false;
    this.humanTurret = false;
    this.difficulty = parseInt(difficulty);
  }
  preload() {
    this.load.tilemapTiledJSON("map", Sprites.gameMap);
    this.load.image("tiles", Sprites.map2Dsprites);
    loadAllSprites(this);
    loadAllAudio(this);
  }

  create() {
    // CREATE GAME MAP
    const { map, layer1, waveTimeRemainingText, scoreText, resourceText } =
      createGameMap(this);
    this.map = map;
    this.waveTimeRemainingText = waveTimeRemainingText;
    this.scoreText = scoreText;
    this.resourceText = resourceText;

    this.startBtn = document.getElementById("start");
    this.startBtn.addEventListener("click", this.startWave.bind(this));

    this.speedBtn = document.getElementById("speed-up");
    this.speedBtn.addEventListener("click", this.toggleGameSpeed.bind(this));

    this.pauseBtn = document.getElementById("pause");
    this.pauseIcon = this.pauseBtn.querySelector("i");
    this.pauseBtn.addEventListener("click", this.togglePause.bind(this));

    //Audio additions
    this.lifeDamage = this.sound.add("life-damage");

    const settingsBtn = document.getElementById("settings");
    settingsBtn.addEventListener("click", this.togglePause.bind(this));

    const modalSettingsBtnClose = document
      .getElementById("modalSettings")
      .querySelector(".close-button");

    modalSettingsBtnClose.addEventListener(
      "click",
      this.togglePause.bind(this)
    );

    const audioSettingsBtn = document.getElementById("music");
    this.musicSettingsBtn = document.getElementById("mute-sound");
    this.audio = document.getElementById("synthwave-track");

    audioSettingsBtn.addEventListener("click", this.toggleAudioMute.bind(this));
    this.musicSettingsBtn.addEventListener(
      "click",
      this.toggleMusicMute.bind(this)
    );

    const replayBtn = document.getElementById("replay-button");
    replayBtn.addEventListener("click", () => location.reload());

    this.heartContainer = document.getElementById("heart-container");
    const autoTurret = document.getElementById("auto-turret");
    const laserTurret = document.getElementById("laser-turret");
    const shotgunTurret = document.getElementById("shotgun-turret");
    const antiAirTurret = document.getElementById("antiAir-turret");

    const humanTurret = document.getElementById("human-turret");

    this.humanTurretBtn = humanTurret;

    antiAirTurret.addEventListener("click", this.chooseTurretType.bind(this));
    autoTurret.addEventListener("click", this.chooseTurretType.bind(this));
    laserTurret.addEventListener("click", this.chooseTurretType.bind(this));
    shotgunTurret.addEventListener("click", this.chooseTurretType.bind(this));
    humanTurret.addEventListener("click", this.chooseTurretType.bind(this));

    this.electricTower = document.getElementById("electric");
    this.electricTower.addEventListener(
      "click",
      this.purchaseTower.bind(this, "electric", this.electricTower)
    );
    this.fireTower = document.getElementById("fire");
    this.fireTower.addEventListener(
      "click",
      this.purchaseTower.bind(this, "fire", this.fireTower)
    );

    this.freezeTower = document.getElementById("freeze");
    this.freezeTower.addEventListener(
      "click",
      this.purchaseTower.bind(this, "freeze", this.freezeTower)
    );

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
    // @ts-ignore
    this.audio.play();
    // @ts-ignore
    this.audio.volume = 0.3;
  }

  toggleAudioMute() {
    if (!this.isAudioMuted) {
      this.game.sound.mute = true;
      this.isAudioMuted = true;
    } else {
      this.game.sound.mute = false;
      this.isAudioMuted = false;
    }
  }

  toggleMusicMute() {
    if (this.isMusicMuted) {
      this.audio.play();
      this.isMusicMuted = false;
    } else {
      this.audio.pause();
      this.isMusicMuted = true;
    }
  }

  purchaseTower(type) {
    if (this[type] === true) return;

    if (this.resources < turretsClassTypes[type].cost) {
      this.notEnoughRes();
      return;
    }

    this.resources = this.resources - turretsClassTypes[type].cost;
    this.updateResources();

    if (this[type] === true) return;
    let tileID;

    if (type === "electric") {
      tileID = 39;
      this.electricTower.innerHTML =
        '<i style="color: yellow" class="fa-solid fa-bolt-lightning"></i>';
    }
    if (type === "fire") {
      tileID = 59;
      this.fire.innerHTML =
        '<i style="color: red" class="fa-solid fa-fire"></i>';
    }
    if (type === "freeze") {
      tileID = 49;
      this.freezeTower.innerHTML =
        '<i style="color: aquamarine" class="fa-solid fa-icicles"></i>';
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

    const tower = new PowerTurret(
      this,
      centerX,
      centerY,
      turretsClassTypes[type]
    );

    if (type === "electric") {
      this.electricTower = tower;
      // @ts-ignore
      this.upgradeElectricBtn.disabled = false;
    }
    if (type === "freeze") {
      this.freezeTower = tower;
      // @ts-ignore
      this.upgradeFreezeBtn.disabled = false;
    }
    if (type === "fire") {
      this.fireTower = tower;
      // @ts-ignore
      this.upgradeFireBtn.disabled = false;
    }

    this[type] = true;
  }

  displayHearts() {
    const hearts = Array.from(Array(this.hearts).keys());
    this.heartContainer.innerHTML = "";
    hearts.forEach((heart) => {
      const imageElement = document.createElement("img");
      imageElement.classList.add("heart-icon");
      imageElement.src = lifeHeartImage;
      this.heartContainer.appendChild(imageElement);
    });
  }

  toggleGameSpeed() {
    const currentEnemies = Array.from(this.enemies.children.entries);
    const currentTurrets = Array.from(this.turrets.children.entries);

    if (this.speedMultiplyer === 2) {
      this.speedMultiplyer = 1;
      this.speedBtn.innerHTML =
        'x2 Speed <i class="fa-sharp fa-solid fa-forward-fast"></i>';

      toggleCurrentEnemiesSpeed(0.5, currentEnemies, currentTurrets);
    } else {
      this.speedMultiplyer = 2;
      this.speedBtn.innerHTML =
        'x1 Speed <i class="fa-solid fa-forward-step"></i>';
      toggleCurrentEnemiesSpeed(2, currentEnemies, currentTurrets);
    }
  }

  updateResources() {
    this.resourceText.setText(`Resources: ${this.resources}`);
    this.scoreText.setText(`Score: ${this.score}`);
  }

  updateWaveTimeRemaining() {
    this.waveTimeRemainingText.setText(
      `Time Until Next Wave: ${formatDuration(this.timeUntilNextWave)}`
    );
  }

  notEnoughRes() {
    this.resourceText.setText(`Resources: Not enough resources`);

    this.time.addEvent({
      delay: 1000,
      callback: this.updateResources,
      callbackScope: this,
    });
  }

  togglePause() {
    if (this.isGamePaused) {
      this.physics.resume();
      this.scene.resume();
      this.pauseBtn.innerHTML =
        'Pause <i class="fa-sharp fa-solid fa-pause"></i>';

      this.isGamePaused = false;
    } else {
      this.pauseBtn.innerHTML =
        'Play <i class="fa-sharp fa-solid fa-play"></i>';
      this.physics.pause();
      this.scene.pause();
      this.isGamePaused = true;
    }
  }

  chooseTurretType(e) {
    const buttons = Array.from(
      document.querySelector(".turret-buttons").querySelectorAll("button")
    );

    buttons.forEach((button) => button.classList.remove("selected"));

    const button = e.target.closest("button");
    button.classList.add("selected");
    const type = button.id.split("-")[0];

    this.turretType = type;
  }

  takeHeart() {
    this.hearts--;
    if (this.hearts == 0) {
      this.gameOver();
    }
    this.displayHearts();
    this.lifeDamage.play({ volume: 0.6 });
  }

  gameOver() {
    this.physics.pause();
    this.scene.pause();
    const modalGameOver = document.getElementById("modalGameOver");
    modalGameOver.setAttribute("open", "");

    const score = document.getElementById("score");

    saveUserHighScore(this.score);

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
    console.log(this.timeUntilNextWave);
    const bonus = (this.timeUntilNextWave * 10) / 1000;
    this.resources = this.resources + bonus;
    this.score = this.score + bonus;
    this.updateResources();
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
      this.waveArray = shuffleArray(
        convertObjectToArray(WAVE_DATA[this.waveIndex])
      );

      const time = this.waveArray.length * 1000 + NEXT_WAVE_TIME;

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
    this.waveArray = shuffleArray(
      convertObjectToArray(WAVE_DATA[this.waveIndex])
    );
  }

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
      this.nextEnemy = time + 1000 / this.speedMultiplyer;
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
  scene.load.image("interactive-tile", Sprites.interactiveTile);

  // AntiAir Sprites
  scene.load.image("antiAir", Sprites.antiAir);
  scene.load.image("antiAir2", Sprites.antiAir2);
  scene.load.image("antiAir3", Sprites.antiAir3);

  // Turret Sprites
  scene.load.image("turret", Sprites.turret);
  scene.load.image("turret2", Sprites.turret2);
  scene.load.image("turret3", Sprites.turret3);
  // Laser Sprites
  scene.load.image("laser", Sprites.laser);
  scene.load.image("laser2", Sprites.laser2);
  scene.load.image("laser3", Sprites.laser3);
  // Shotgun Sprites
  scene.load.image("shotgun", Sprites.shotgun);
  scene.load.image("shotgun2", Sprites.shotgun2);
  scene.load.image("shotgun3", Sprites.shotgun3);
  // Human Sprites
  scene.load.image("human", Sprites.human);
  scene.load.image("human2", Sprites.human2);
  scene.load.image("human3", Sprites.human3);
  // Electric Sprites
  scene.load.image("electric", Sprites.electricTowerActive);
  scene.load.image("electric-inactive", Sprites.electricTowerInactive);
  // Freeze Sprites
  scene.load.image("freeze", Sprites.freezeTowerActive);
  scene.load.image("freeze-inactive", Sprites.freezeTowerInactive);
  // Fire Sprites
  scene.load.image("fire", Sprites.fireTowerActive);
  scene.load.image("fire-inactive", Sprites.fireTowerInActive);
  // Enemy Sprites
  scene.load.image("robot", Sprites.robot);
  scene.load.image("heavybot", Sprites.heavyBot);
  scene.load.image("spider", Sprites.spider);
  scene.load.image("drone", Sprites.drone);
  scene.load.image("golem", Sprites.golem);
  scene.load.image("boss", Sprites.boss);
  // Bullet Sprites
  scene.load.image("bullet", Sprites.bullet);
  scene.load.image("ShotGunBullet", Sprites.shotgunBullet);
  scene.load.image("HumanBullet", Sprites.humanBullet);
  scene.load.image("AntiAerialBullet", Sprites.aerialBullet);
}

function loadAllAudio(scene) {
  scene.load.audio("electric-audio", AudioFiles.electricity);
  scene.load.audio("fire-audio", AudioFiles.fire);
  scene.load.audio("freeze-audio", AudioFiles.freeze);
  scene.load.audio("power-up", AudioFiles.powerUp);

  scene.load.audio("laser", AudioFiles.laser);
  scene.load.audio("bulletsound", AudioFiles.bullet);
  scene.load.audio("shotgunsound", AudioFiles.shotgun);
  scene.load.audio("plasmasound", AudioFiles.plasma);
  scene.load.audio("antiAirsound", AudioFiles.antiAir);

  scene.load.audio("dead", AudioFiles.dead);
  scene.load.audio("dead-boss", AudioFiles.deadboss);

  scene.load.audio("life-damage", AudioFiles.lifeDamage);
  scene.load.audio("synthwave", AudioFiles.synthWave);
}

async function saveUserHighScore(score) {
  if (!firebaseAuth.currentUser) return;
  try {
    const docRef = doc(firebaseDB, "users", firebaseAuth.currentUser.uid);
    const userSnap = await getDoc(docRef);

    if (userSnap.exists()) {
      const user = userSnap.data();

      if (user.highScore < score) {
        await updateDoc(docRef, {
          highScore: score,
        });
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error retrieving stories:", error);
    alert("Failed to retrieve stories. Please try again.");
  }
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
