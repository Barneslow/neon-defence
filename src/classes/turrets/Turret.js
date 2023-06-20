import Phaser from "phaser";
import Bullet from "../../Bullet";

export default class Turret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, range, collisionGroup, enemies) {
    super(scene, x, y, "turret");
    this.MapScene = scene;
    this.collisionGroup = collisionGroup;
    this.nextTic = 0;
    this.enemies = enemies;

    scene.add.existing(this);

    this.setOrigin(0.5, 0.3);

    // this.scene.input.on("pointermove", this.rotateTurret, this);
    this.range = range;
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
    this.scene.input.on("pointerdown", this.setPlayerInRange, this);
  }
  // rotateTurret(pointer) {
  //   // Calculate the angle between the turret and the clicked position
  //   const angle = Phaser.Math.Angle.Between(
  //     this.x,
  //     this.y,
  //     pointer.worldX,
  //     pointer.worldY
  //   );

  //   // Set the rotation of the turret
  //   this.rotation = angle + (270 * Math.PI) / 180;
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
  autoFire() {
    if (!this.playerInRange) {
      let enemy = getEnemy(this.x, this.y, 200, this.enemies);

      if (enemy) {
        let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        this.angle = (angle + Math.PI + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;

        this.shootBullet();
      }
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
