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
    this.bulletSound = this.scene.sound.add("bulletsound");
    this.laserSound = this.scene.sound.add("laser");
    this.shotgunSound = this.scene.sound.add("shotgunsound");
    this.plasmaSound = this.scene.sound.add("plasmasound");

    this.range = turretObject.range;

    // Adding tower level
    this.experiencePoints = 0;
    this.level = 1;
    this.damageOutput = turretObject.damageOutput.level1;
    this.damageObject = turretObject.damageOutput;

    // adding tower shoottimer
    this.nextTic = 0;
    this.tickTimer = turretObject.tickTimer;

    // Adding interactive properties
    this.setInteractive()
      .on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this)
      .on("pointerdown", this.onPointerDown, this);

    this.depth = 2;
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
    this.setTint(0xffff00);
    const colorValue = Phaser.Display.Color.GetColor(255, 255, 255);

    this.circle = this.scene.add.circle(
      this.x,
      this.y,
      this.range / 2,
      colorValue
    );

    this.circle.setAlpha(0.4);
    this.circle.depth = 1;
    this.circle.setStrokeStyle(4, 0xffffff);
  }

  onPointerOut() {
    this.clearTint();
    this.circle.destroy();
  }

  autoFire() {
    let enemy = getEnemyNearTurret(this.x, this.y, this.range, this.enemies);

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

    this.laserSound.play({ volume: 0.2 });
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

    if (this.turretName === "turret") {
      this.bulletSound.play({ volume: 0.2 });
      console.log("fire");
    }
    if (this.turretName === "shotgun") {
      this.shotgunSound.play({ volume: 0.2 });
    }
    if (this.turretName === "human") {
      this.plasmaSound.play({ volume: 0.2 });
    }

    this.bullets.add(bullet);
  }

  update(time, delta) {
    if (time > this.nextTic) {
      this.autoFire();
      // Increase the shoot time
      this.nextTic = time + this.tickTimer;
    }
  }
}
