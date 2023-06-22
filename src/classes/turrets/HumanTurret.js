import Phaser from "phaser";
import Bullet from "../bullet/Bullet";
import { bulletClassTypes } from "../../config/bullet-config";
import BaseBullet from "../bullet/BaseBullet";

export default class HumanTurret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, turretObject) {
    super(scene, x, y, turretObject.name);
    this.MapScene = scene;
    scene.add.existing(this);

    // config options
    this.turretName = turretObject.name;

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

    this.bullets = this.scene.add.group(); // Group to hold the bullets
    this.bulletSpeed = 500; // Speed of the bullets

    this.shootInterval = 50; // Time interval between shots in milliseconds
    this.lastShootTime = 0; // Time when the last shot was fired
    this.bulletSound = this.scene.sound.add("bulletsound");

    this.playerInRange = false;

    this.scene.input.on("pointermove", this.setPlayerInRange, this);
    this.scene.input.on("pointerdown", this.shootBullet, this);
  }

  setPlayerInRange(pointer) {
    const distanceToPointer = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY
    );

    this.playerInRange = distanceToPointer <= 200;
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

    // Smoothly rotate the turret towards the pointer
    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      targetRotation,
      this.rotationSpeed
    );
  }

  shootBullet(pointer) {
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

      this.bulletSound.play({ volume: 0.2 });
    }
  }

  update(time, delta) {
    if (time - this.lastShootTime >= this.shootInterval) {
      this.lastShootTime = time;
    }
  }
  preload() {
    this.MapScene.load.image("turret", "assets/images/Turret2D.png");
  }
}
