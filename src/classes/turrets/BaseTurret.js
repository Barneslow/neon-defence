import Phaser from "phaser";
import { getEnemyNearTurret, timerDelay } from "../../helpers/helpers";
import { Popup } from "../../Popup";
import BaseBullet from "../bullet/BaseBullet";
import { bulletClassTypes } from "../../config/bullet-config";

export default class BaseTurret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, turretObject) {
    super(scene, x, y, turretObject.name);

    this.MapScene = scene;
    scene.add.existing(this);

    // Creating Turret Config Properties
    this.turretName = turretObject.name;
    this.turretSprite = turretObject.sprite;
    this.cost = turretObject.cost;
    this.experience = turretObject.experience;

    // Adding CollisionGroups
    this.bulletCollisionGroup = scene.physics.scene.bullets;
    this.enemies = scene.physics.scene.enemies;

    //Adding bullet physics
    this.bullets = this.scene.add.group();
    // this.bulletSound = this.scene.sound.add("bulletsound");
    this.laserSound = this.scene.sound.add("laser");

    // Adding tower level
    this.experiencePoints = 0;
    this.level = 1;
    this.damageOutput = turretObject.damageOutput.level1;
    this.damageObject = turretObject.damageOutput;

    // adding tower shoottimer
    this.nextTic = 0;
    this.tickTimer = turretObject.tickTimer;

    // Adding interactive properties
    this.setInteractive({ useHandCursor: true })
      .on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this)
      .on("pointerdown", this.onPointerDown, this);
  }

  preload() {}

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

  autoFire() {
    let enemy = getEnemyNearTurret(this.x, this.y, 200, this.enemies);

    if (enemy) {
      // TURRET ROTATION
      let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);

      let enemyPosition = { x: enemy.x, y: enemy.y };
      this.angle = (angle + Math.PI + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      this.shootBullet(enemyPosition);
    }
  }

  upgradeExperience() {
    // LEVEL UP TOWER - REFACTOR LATER
    this.experiencePoints += 10;

    // Alternate exp
    if (this.experiencePoints === this.experience.level2) {
      this.level++;
    }
    if (this.experiencePoints === this.experience.level3) {
      this.level++;
    }

    if (this.level === 2) {
      this.setTexture(this.turretSprite.level2.name);
      this.damageOutput = this.damageObject.level2;
    }

    if (this.level === 3) {
      this.setTexture(this.turretSprite.level3.name);
      this.damageOutput = this.damageObject.level3;
    }
  }

  async startDrawing(enemyPosition) {
    this.line.x1 = this.x;
    this.line.y1 = this.y;

    this.line.x2 = enemyPosition.x;
    this.line.y2 = enemyPosition.y;

    this.graphics.strokeLineShape(this.line);

    console.log(this.graphics);
    this.laserSound.play();
    await timerDelay(200);

    this.graphics.clear();
  }

  shootBullet(enemyPosition) {
    this.upgradeExperience();
    if (this.turretName === "laser") {
      this.graphics = this.MapScene.add.graphics();
      this.line = new Phaser.Geom.Line();

      this.graphics.lineStyle(3, 0x00ff00);
      this.startDrawing(enemyPosition);
      console.log("laser fire");
      return;
    }
    const bullet = new BaseBullet(
      this.scene,
      this.x,
      this.y,
      bulletClassTypes[this.turretName],
      this.damageOutput
    );

    bullet.body.velocity.setToPolar(
      this.rotation - Math.PI / 2 - Math.PI,
      bulletClassTypes[this.turretName].speed
    );

    this.bullets.add(bullet);

    // this.bulletSound.play({ volume: 0.2 });
  }

  update(time, delta) {
    if (time > this.nextTic) {
      this.autoFire();
      // Increase the shoot time
      this.nextTic = time + this.tickTimer;
    }
  }
}
