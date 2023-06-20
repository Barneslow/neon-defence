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
    const currentTile = this.map.getTilesWithinWorldXY(
      this.x,
      this.y - this.height,
      this.width / 2,
      this.height / 2
    );

    const singleCurrentTile = currentTile[0];

    const leftTile = this.map.getTileAt(
      singleCurrentTile.x - 1,
      singleCurrentTile.y
    );
    const rightTile = this.map.getTileAt(
      singleCurrentTile.x + 1,
      singleCurrentTile.y
    );

    console.log(rightTile.index);

    if (singleCurrentTile.index === 3 || singleCurrentTile.index === 5) {
      this.setVelocityY(-50);
      this.setVelocityX(0);
    } else if (leftTile.index === 3 || leftTile.index === 5) {
      this.setVelocityY(0);
      this.setVelocityX(50);

      // console.log("left");
    } else if (rightTile.index === 3 || rightTile.index === 5) {
      this.setVelocityY(0);
      this.setVelocityX(-50);
      // console.log("right");
    } else {
      this.setVelocityY(50);
      this.setVelocityX(0);
      // console.log("back");
    }

    // currentTile.forEach((tile) => {
    //   const leftTile = this.map.getTileAt(tile.x - 1, tile.y);
    //   const rightTile = this.map.getTileAt(tile.x + 1, tile.y);

    //   //   console.log(rightTile.index);
    //   if (tile.index === 3 || tile.index === 5) {
    //     this.setVelocityY(-50);
    //     this.setVelocityX(0);
    //   } else if (leftTile.index === 3 || tile.index === 5) {
    //     this.setVelocityY(0);
    //     this.setVelocityX(50);

    //     // console.log("left");
    //   } else if (rightTile.index === 3 || tile.index === 5) {
    //     this.setVelocityY(0);
    //     this.setVelocityX(-50);
    //     // console.log("right");
    //   } else {
    //     this.setVelocityY(50);
    //     this.setVelocityX(0);
    //     // console.log("back");
    //   }
    // });
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
    // if (time > this.nextTic) {
    this.moveOnPath();
    this.nextTic = time + 1000;
    // }
  }
}
