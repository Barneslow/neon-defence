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
    this.initialMove = true;
  }

  preload() {
    this.MapScene.load.image("bird", "assets/images/bird.png");
  }

  moveOnPath() {
    // DETECTS IF THE PATH IS A MOVEABLE TILEID
    const currentTile = this.map.getTilesWithinWorldXY(
      this.x,
      this.y - this.height,
      this.width,
      this.height
    );

    const singleCurrentTile = currentTile[0];

    console.log(singleCurrentTile.index);

    // const leftTile = this.map.getTileAt(
    //   singleCurrentTile.x - 1,
    //   singleCurrentTile.y
    // );
    // const rightTile = this.map.getTileAt(
    //   singleCurrentTile.x + 1,
    //   singleCurrentTile.y
    // );
    // MOVE FORWARD

    if (singleCurrentTile.index === 27) {
      this.setVelocityY(-50);
      this.setVelocityX(0);
      console.log("forward");
    } else if (singleCurrentTile.index === 28) {
      // MOVE RIGHT
      console.log("right");
      this.setVelocityY(0);
      this.setVelocityX(50);
    } else if (singleCurrentTile.index === 17) {
      // MOVE LEFT
      console.log("left");
      this.setVelocityY(0);
      this.setVelocityX(-50);
    } else if (singleCurrentTile.index === 5) {
      // MOVE BACK
      console.log("back");
      this.setVelocityY(50);
      this.setVelocityX(0);
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
    if (this.initialMove) {
      this.setVelocityY(-200);
      this.initialMove = false;
    }
    // if (time > this.nextTic) {
    this.moveOnPath();
    this.nextTic = time + 1000;
    // }
  }
}
