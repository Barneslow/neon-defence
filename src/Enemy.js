import Phaser from "phaser";

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name, path) {
    super(scene, x, y, name, path);
    scene.add.existing(this);
    this.MapScene = scene;
    this.path = path;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
  }

  preload() {
    this.MapScene.load.image("bird", "assets/images/bird.png");
  }

  startOnPath() {
    this.follower.t = 0;
    this.path.getPoint(this.follower.t, this.follower.vec);
    this.setPosition(this.follower.vec.x, this.follower.vec.y);

    console.log(this.x, this.y);
    console.log(this.path.getPoint(this.follower.t, this.follower.vec));
  }

  update(time, delta) {
    this.follower.t += (1 / 10000) * delta;
    this.path.getPoint(this.follower.t, this.follower.vec);

    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  }
}
