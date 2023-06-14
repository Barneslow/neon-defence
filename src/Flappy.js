import Phaser from "phaser";

let bird;

export default class FlappyScene extends Phaser.Scene {
  constructor() {
    super("flappy");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
    bird = this.physics.add.sprite(800 / 2, 600 / 2, "bird").setOrigin(0);
    bird.body.gravity.y = 200;
  }

  update(time, delta) {}
}
