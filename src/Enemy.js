import Phaser from "phaser";

export default class Turret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name, test) {
    super(scene, x, y, name, test);
    this.MapScene = scene;
    this.path = test;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    scene.add.existing(this);
  }

  preload() {
    this.MapScene.load.image("bird", "assets/images/bird.png");
  }

  startOnPath() {
    this.follower.t = 0;
    this.hp = 100;
    this.path.getPoint(this.follower.t, this.follower.vec);

    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  }

  update() {}
}
