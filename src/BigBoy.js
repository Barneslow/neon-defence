import Phaser from "phaser";

const ENEMY_SPEED = 1 / 100000;
export default class BigBoy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, name, path) {
    super(scene, x, y, name, path);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.MapScene = scene;
    this.path = path;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.health = 500;
    this.currentHealth = 500;
    this.setTint(0x0000ff);
  }

  preload() {
    this.MapScene.load.image("bird", "assets/images/bird.png");
  }

  damageTaken(damage) {
    this.currentHealth -= damage;
    const healthPercentage = this.currentHealth / this.health;

    if (healthPercentage < 0.75 && healthPercentage > 0.5) {
      this.setTint(0xff9999);
      console.log("light");
    } else if (healthPercentage < 0.5) {
      this.setTint(0xff0000);
      console.log("dark");
    }
    if (this.currentHealth <= 0) {
      this.destroy();
    }
  }

  update(time, delta) {
    this.follower.t += ENEMY_SPEED * delta;
    this.path.getPoint(this.follower.t, this.follower.vec);

    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  }
}
