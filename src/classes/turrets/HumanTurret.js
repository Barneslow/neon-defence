import Phaser from "phaser";
import Bullet from "../bullet/Bullet";
import { bulletClassTypes } from "../../config/bullet-config";
import BaseBullet from "../bullet/BaseBullet";

export default class HumanTurret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, turretObject) {
    super(scene, x, y, turretObject.name);
    this.MapScene = scene;
    scene.add.existing(this);
    this.range = 200;

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

    // // Adding radius circle
    // this.circleGraphics = scene.add.graphics();
    // this.circleOpacity = 0.5;
    // this.circleFillColor = 0xffffff; // White col

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

    this.depth = 2;

    // zone.body.setCircle(100);
  }

  // preUpdate(time, delta) {
  //   super.preUpdate(time, delta);

  //   // Clear the previous graphics

  //   // Draw the circle with the specified properties
  //   const circleRadius = this.range / 2;
  //   this.circleGraphics.fillStyle(this.circleFillColor, this.circleOpacity);
  //   this.circleGraphics.fillCircle(this.x, this.y, circleRadius);

  //   // Add the graphics object to the scene
  //   this.scene.add.existing(this.circleGraphics);

  //   // Set the circle to follow the sprite's position
  //   this.circleGraphics.setPosition(this.x, this.y);
  // }

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

    // Smoothly rotate the turret towards the pointer
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
