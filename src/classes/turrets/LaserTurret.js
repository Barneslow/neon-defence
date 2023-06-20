import Phaser from "phaser";
import Bullet from "../../Bullet";

export default class LaserTurret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, collisionGroup, enemies) {
    super(scene, x, y, "laser");
    this.MapScene = scene;
    this.collisionGroup = collisionGroup;
    this.nextTic = 0;
    this.enemies = enemies;
    scene.add.existing(this);
    this.range = 100;
    this.rotationSpeed = 0.04;
    this.cost = 50;
    this.bullets = this.scene.add.group();
    this.bulletSpeed = 500;
    this.experiencePoints = 0;
    this.level = 1;
    this.damageOutput = 10;

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

  upgradeExperience() {
    // LEVEL UP TOWER - REFACTOR LATER
    this.experiencePoints += 10;

    // Alternate exp
    if (this.experiencePoints === 30) {
      this.level++;
    }
    if (this.experiencePoints === 50) {
      this.level++;
    }

    if (this.level === 2) {
      this.setTint(0x0000ff);
      this.damageOutput = 20;
    }

    if (this.level === 3) {
      this.setTint(0x00ff00);
      this.damageOutput = 30;
    }
  }

  shootBullet() {
    this.upgradeExperience();
    const bullet = new Bullet(
      this.scene,
      this.x,
      this.y,
      null,
      this.collisionGroup,
      this.damageOutput
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
    this.MapScene.load.image("laser", "assets/images/laser2D.png");
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
