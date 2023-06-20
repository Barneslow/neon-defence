import Phaser from "phaser";

const ENEMY_SPEED = 1 / 50000;
export default class CustomMoveEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, name, path) {
    super(scene, x, y, name, path);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.MapScene = scene;
    this.map = scene.map;
    this.nextTic = 0;
    this.path = path;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.health = 50;
    this.currentHealth = 50;
    this.setTint(0xffffff);
    this.setPosition(145, 768);
  }

  preload() {
    this.MapScene.load.image("bird", "assets/images/bird.png");
  }

  moveOnPath() {
    // DETECTS IF THE PATH IS A MOVEABLE TILEID
    const pathTiles = this.map.getTilesWithinWorldXY(
      this.x,
      this.y - this.height,
      this.width / 2,
      this.height / 2
    );

    let canMoveForward = true;
    let canMoveLeft = true;
    let canMoveRight = true;

    pathTiles.forEach((tile) => {
      if (tile.index === 3 || tile.index === 5) {
        this.setVelocityY(-50);
      } else {
        this.setVelocityY(0);
        console.log("velocity 0");
      }
    });

    if (canMoveForward) {
      console.log("foward");
    } else if (canMoveLeft) {
      console.log("left");
    } else if (canMoveRight) {
      console.log("right");
    }
  }

  damageTaken(damage) {
    this.currentHealth -= damage;
    const healthPercentage = this.currentHealth / this.health;

    if (healthPercentage < 0.75 && healthPercentage > 0.5) {
      this.setTint(0xff9999);
    } else if (healthPercentage < 0.5) {
      this.setTint(0xff0000);
    }
    if (this.currentHealth <= 0) {
      this.destroy();
    }
  }

  update(time, delta) {
    if (time > this.nextTic) {
      this.moveOnPath();
      // Increase the shoot time
      this.nextTic = time + 2000;
    }
  }
}
