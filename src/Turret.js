import Phaser from "phaser";
import Bullet from "./Bullet";
import Enemy from "./Enemy";

export default class Turret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, range, collisionGroup, enemies) {
    super(scene, x, y, "turret");
    this.MapScene = scene;
    this.collisionGroup = collisionGroup;
    this.nextTic = 0;
    this.enemies = enemies;

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

  autoFire() {
    let enemy = getEnemy(this.x, this.y, 200, this.enemies);

    console.log(enemy);
    if (enemy) {
      let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;

      this.shootBullet();
    }
  }

  shootBullet() {
    const bullet = new Bullet(
      this.scene,
      this.x,
      this.y,
      null,
      this.collisionGroup
    );

    bullet.body.velocity.setToPolar(
      this.rotation - Math.PI / 2 - Math.PI,
      this.bulletSpeed
    );
    this.bullets.add(bullet);

    this.bulletSound.play({ volume: 0.2 });
  }

  update(time, delta) {
    if (time - this.lastShootTime >= this.shootInterval) {
      this.lastShootTime = time;
    }
    {
      if (time > this.nextTic) {
        this.autoFire();
        this.nextTic = time + 1000;
      }
    }
  }
  preload() {
    this.MapScene.load.image("turret", "assets/images/Turret2D.png");
  }
}

function getEnemy(x, y, distance, enemies) {
  var enemyUnits = enemies.getChildren();
  for (var i = 0; i < enemyUnits.length; i++) {
    if (
      enemyUnits[i].active &&
      Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <
        distance
    )
      return enemyUnits[i];
  }
  return false;
}
