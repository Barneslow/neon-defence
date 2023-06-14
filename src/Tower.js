import Phaser from "phaser";

export default class Tower extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "tower");
    this.MapScene = scene;
  }

  preload() {
    this.MapScene.load.image("tower", "assets/images/Tower.png");
  }
}
