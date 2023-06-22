import BaseEnemy from "./BaseEnemy";

export default class DroneEnemy extends BaseEnemy {
  constructor(scene, x, y, enemyObject) {
    super(scene, x, y, enemyObject);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.MapScene = scene;
    this.map = scene.map;
    this.sprite = enemyObject.sprite;
  }
  preload() {
    this.MapScene.load.image(
      this.enemyName,
      `assets/images/${this.sprite}.png`
    );

    this.scene.load.audio(
      this.sound.name,
      `assets/sounds/${this.sound.audio}.mp3`
    );
  }
}
