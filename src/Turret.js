import Phaser from "phaser";

export default class Turret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "turret");
    this.MapScene = scene;

    scene.add.existing(this);
  }

  preload() {
    this.MapScene.load.image("turret", "assets/images/Turret2D.png");
  }
}
