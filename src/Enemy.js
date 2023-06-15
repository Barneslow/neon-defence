import Phaser from "phaser";

export default class Turret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bird");
    this.MapScene = scene;

    scene.add.existing(this);
  }

  preload() {
    this.MapScene.load.image("bird", "assets/images/Turret2D.png");
  }
}
