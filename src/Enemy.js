import Phaser from "phaser";

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bird");
    this.MapScene = scene;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
  }

  preload() {
    this.MapScene.load.image("bird", "assets/images/bird.png");
  }
}
