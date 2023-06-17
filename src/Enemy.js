import Phaser from "phaser";

const ENEMY_SPEED = 1 / 50000;
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, name, path) {
    super(scene, x, y, name, path);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.MapScene = scene;
    this.path = path;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.health = 20;
  }

  preload() {
    this.MapScene.load.image("bird", "assets/images/bird.png");
  }

  damageTaken(damage) {
    this.health -= damage;

    if (this.health > 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  update(time, delta) {
    this.follower.t += ENEMY_SPEED * delta;
    this.path.getPoint(this.follower.t, this.follower.vec);

    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  }
}
