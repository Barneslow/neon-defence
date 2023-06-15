import Phaser from "phaser";
import Bullet from "./Bullet";
export default class Turret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, range) {
    super(scene, x, y, "turret");
    this.MapScene = scene;

    scene.add.existing(this);

    this.setOrigin(0.5, 0.3);

    this.scene.input.on("pointermove", this.rotateTurret, this);
    this.range = range;

    const initialAngle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.input.mousePointer.worldX,
      this.scene.input.mousePointer.worldY
    );

    this.bullets = this.scene.add.group(); // Group to hold the bullets
    this.bulletSpeed = 500; // Speed of the bullets

    this.shootInterval = 2000; // Time interval between shots in milliseconds
    this.lastShootTime = 0; // Time when the last shot was fired
    this.bulletSound = this.scene.sound.add("bulletsound");
    this.scene.input.on("pointerdown", this.shootBullet, this);
  }
  rotateTurret(pointer) {
    // Calculate the angle between the turret and the clicked position
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY
    );

    // Set the rotation of the turret
    this.rotation = angle + (270 * Math.PI) / 180;
  }
  shootBullet() {
    const bullet = new Bullet(this.scene, this.x, this.y);
    bullet.body.velocity.setToPolar(
      this.rotation - Math.PI / 2 - Math.PI,
      this.bulletSpeed
    );
    this.bullets.add(bullet);

    this.bulletSound.play({ volume: 0.2 });
  }

  update(time, delta) {
    if (time - this.lastShootTime >= this.shootInterval) {
      this.shootBullet();
      this.lastShootTime = time;
    }
  }
  preload() {
    this.MapScene.load.image("turret", "assets/images/Turret2D.png");
  }
}
