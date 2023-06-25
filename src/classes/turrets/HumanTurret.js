import Phaser from "phaser";
import { bulletClassTypes } from "../../config/bullet-config";
import BaseBullet from "../bullet/BaseBullet";
import { HumanTurretPopup } from "../../HumanTurretPopup";

export default class HumanTurret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, turretObject) {
    super(scene, x, y, turretObject.name);
    this.MapScene = scene;
    scene.add.existing(this);
    this.range = 200;
    this.cost = turretObject.cost;

    // config options
    this.turretName = turretObject.name;
    this.turretSprite = turretObject.sprite;

    // Adding CollisionGroups
    this.bulletCollisionGroup = scene.physics.scene.bullets;
    this.enemies = scene.physics.scene.enemies;

    //Adding bullet physics
    this.bullets = this.scene.add.group();

    this.level = 1;
    this.damageOutput = turretObject.damageOutput.level1;
    this.damageObject = turretObject.damageOutput;

    // this.scene.input.on("pointermove", this.rotateTurret, this);
    this.rotationSpeed = 0.04;
    const initialAngle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.input.mousePointer.worldX,
      this.scene.input.mousePointer.worldY
    );

    this.bullets = this.scene.add.group();
    this.bulletSpeed = 500;

    this.shootInterval = 50;
    this.lastShootTime = 0;
    this.bulletSound = this.scene.sound.add("plasmasound");

    this.playerInRange = false;

    this.scene.input.on("pointermove", this.setPlayerInRange, this);
    this.scene.input.on("pointerdown", this.shootBullet, this);

    this.setInteractive().on("pointerdown", this.onPointerDown, this);

    const colorValue = Phaser.Display.Color.GetColor(255, 255, 255);

    this.circle = this.scene.add.circle(this.x, this.y, this.range, colorValue);

    this.circle.setAlpha(0.4);
    this.circle.depth = 1;
    this.circle.setStrokeStyle(4, 0xffffff);

    this.depth = 2;
  }

  onPointerDown(pointer) {
    const popup = new HumanTurretPopup(
      this.MapScene,
      pointer.worldX,
      pointer.worldY,
      175,
      150,
      this
    );

    popup.show();
  }

  setPlayerInRange(pointer) {
    const distanceToPointer = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY
    );

    this.playerInRange = distanceToPointer <= this.range;
    if (this.playerInRange) {
      this.followPointer();
    }
  }
  followPointer() {
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.input.mousePointer.worldX,
      this.scene.input.mousePointer.worldY
    );

    const targetRotation = angle + (270 * Math.PI) / 180;

    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      targetRotation,
      this.rotationSpeed
    );
  }

  shootBullet() {
    if (this.playerInRange) {
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

      this.bulletSound.play({ volume: 1 });
    }
  }

  sellTurret() {
    this.MapScene.input.off("pointermove", this.setPlayerInRange, this);
    this.MapScene.input.off("pointerdown", this.shootBullet, this);
    this.MapScene.resources += this.cost / 2;
    this.MapScene.humanTurret = false;
    this.MapScene.humanTurretBtn.disabled = false;

    this.MapScene.updateResources();
    this.circle.destroy();
    this.destroy();
  }

  upgradeLevel() {
    this.level++;
    if (this.level === 2) {
      this.setTexture(this.turretSprite.level2.name);
      this.damageOutput = this.damageObject.level2;
    }

    if (this.level === 3) {
      this.setTexture(this.turretSprite.level3.name);
      this.damageOutput = this.damageObject.level3;
    }

    this.MapScene.resources -= this.level * this.cost;

    this.MapScene.updateResources();
  }

  update(time, delta) {
    if (time - this.lastShootTime >= this.shootInterval) {
      this.lastShootTime = time;
    }
  }
  preload() {
    this.MapScene.load.image(
      "HumanTurret",
      "assets/images/turrets/HumanTurret.png"
    );
  }
}
