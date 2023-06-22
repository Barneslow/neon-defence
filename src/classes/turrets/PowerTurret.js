import Phaser from "phaser";
import { getEnemyNearTurret } from "../../helpers/helpers";
import { Popup } from "../../Popup";
import BaseBullet from "../bullet/BaseBullet";
import { bulletClassTypes } from "../../config/bullet-config";

export default class PowerTurret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, turretObject) {
    super(scene, x, y, turretObject.name);

    this.MapScene = scene;
    scene.add.existing(this);

    // Creating Turret Config Properties
    this.turretName = turretObject.name;
    this.turretSprite = turretObject.sprite;
    this.cost = turretObject.cost;

    // Adding CollisionGroups
    this.bulletCollisionGroup = scene.physics.scene.bullets;
    this.enemies = scene.physics.scene.enemies;

    // Adding tower level
    this.level = 1;
    this.damageOutput = turretObject.damageOutput.level1;
    this.damageObject = turretObject.damageOutput;

    // Adding interactive properties
    this.setInteractive({ useHandCursor: true })
      .on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this)
      .on("pointerdown", this.onPointerDown, this);

    this.timer = null; // Timer object
    this.timerCountInMilli = turretObject.timer;
    this.fireBtn = document.getElementById(turretObject.name);
    this.fireBtn.addEventListener("click", this.fireTower.bind(this));
  }

  preload() {}

  startTimer() {
    this.timer = this.scene.time.addEvent({
      delay: this.timerCountInMilli,
      callback: this.endTimer,
      callbackScope: this,
    });
    // @ts-ignore
    this.fireBtn.disabled = true;
  }

  endTimer() {
    // @ts-ignore
    this.fireBtn.disabled = false;
  }

  fireTower() {
    this.startTimer();

    const totalEnemies = Array.from(this.enemies.children.entries);

    totalEnemies.forEach((enemy) => {
      enemy.damageTaken(this.damageOutput);
    });
  }

  onPointerDown(pointer) {
    const popup = new Popup(
      this.MapScene,
      pointer.worldX,
      pointer.worldY,
      100,
      100,
      this
    );

    popup.show();
  }

  sellTurret() {
    this.MapScene.resources += this.cost / 2;
    this.MapScene.updateResources();
    this.destroy();
  }

  onPointerOver() {
    const gameCanvas = this.scene.sys.game.canvas;
    gameCanvas.style.cursor = "pointer";
    this.setTint(0xffff00);

    const sellElement = document.getElementById("sell-turret");
    sellElement.textContent = `$${this.cost}`;
  }

  onPointerOut() {
    const gameCanvas = this.scene.sys.game.canvas;
    gameCanvas.style.cursor = "auto";
    const sellElement = document.getElementById("sell-turret");
    sellElement.textContent = "";

    this.clearTint();
  }

  upgradeExperience() {
    if (this.level === 2) {
      this.setTexture(this.turretSprite.level2.name);
      this.damageOutput = this.damageObject.level2;
    }

    if (this.level === 3) {
      this.setTexture(this.turretSprite.level3.name);
      this.damageOutput = this.damageObject.level3;
    }
  }

  updateTower() {
    this.level++;
  }

  update() {
    if (this.timer && this.timer.getProgress() < 1) {
      const remainingTime = Math.ceil(this.timer.getRemaining() / 1000);
    }
  }
}
