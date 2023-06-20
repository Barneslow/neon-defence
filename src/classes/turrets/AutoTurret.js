import Phaser from "phaser";
import Bullet from "../../Bullet";

export default class AutoTurret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, range, collisionGroup, enemies) {
    super(scene, x, y, "turret");
    this.MapScene = scene;
    this.collisionGroup = collisionGroup;
    this.nextTic = 0;
    this.enemies = enemies;
    scene.add.existing(this);
    this.range = range;
    this.rotationSpeed = 0.04;

    this.bullets = this.scene.add.group();
    this.bulletSpeed = 500;

    // this.bulletSound = this.scene.sound.add("bulletsound");
  }

  autoFire() {
    let enemy = getEnemy(this.x, this.y, 200, this.enemies);

    if (enemy) {
      // TURRET ROTATION
      let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      this.angle = (angle + Math.PI + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
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
    bullet.setTint(0xff0000);

    bullet.body.velocity.setToPolar(
      this.rotation - Math.PI / 2 - Math.PI,
      this.bulletSpeed
    );
    this.bullets.add(bullet);

    // this.bulletSound.play({ volume: 0.2 });
  }

  update(time, delta) {
    if (time > this.nextTic) {
      this.autoFire();
      // Increase the shoot time
      this.nextTic = time + 2000;
    }
  }
  preload() {
    this.MapScene.load.image("turret", "assets/images/Turret2D.png");
  }
}

// FIND NEARBY ENEMY
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
