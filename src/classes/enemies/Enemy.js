import Phaser from "phaser";

const ENEMY_SPEED = 1 / 50000;
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, name, path, map) {
    super(scene, x, y, name, path);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.MapScene = scene;
    this.map = map;
    this.path = path;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.health = 50;
    this.currentHealth = 50;
    this.setTint(0xffffff);
    this.setPosition(145, 430);
  }

  preload() {
    this.MapScene.load.image("bird", "assets/images/bird.png");
  }

  moveOnPath() {
    const pathTiles = this.map.getTilesWithinWorldXY(
      this.x,
      this.y,
      this.width,
      this.height,
      { isColliding: true }
    );

    let canMoveForward = true;
    let canMoveLeft = true;
    let canMoveRight = true;

    pathTiles.forEach((tile) => {
      if (tile.index === 3 || tile.index === 5) {
        canMoveForward = false;

        const leftTile = this.map.getTileAt(tile.x - 1, tile.y);
        const rightTile = this.map.getTileAt(tile.x + 1, tile.y);

        if (leftTile && (leftTile.index === 3 || leftTile.index === 5)) {
          canMoveLeft = true;
          canMoveRight = false;
        } else if (
          rightTile &&
          (rightTile.index === 3 || rightTile.index === 5)
        ) {
          canMoveLeft = false;
          canMoveRight = true;
        }
      }
    });
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
    this.moveOnPath();
    // this.follower.t += ENEMY_SPEED * delta;
    // this.path.getPoint(this.follower.t, this.follower.vec);
    // this.setPosition(this.follower.vec.x, this.follower.vec.y);
  }
}
