import Phaser from "phaser";

export default class Turret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, range) {
    super(scene, x, y, "turret");
    this.MapScene = scene;

    scene.add.existing(this);

    this.setOrigin(0.5, 0.3);

    this.scene.input.on("pointermove", this.rotateTurret, this);
    this.range = range;
    this.setRotation(1.5708);

    const initialAngle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.input.mousePointer.worldX,
      this.scene.input.mousePointer.worldY
    );
    this.rotation = initialAngle + Phaser.Math.DegToRad(90);
  }
  rotateTurret(pointer) {
    // Calculate the angle between the turret and the clicked position
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY
    );

    // Set the rotation of the turret
    this.rotation = angle + (270 * Math.PI) / 180;
  }
  preload() {
    this.MapScene.load.image("turret", "assets/images/Turret2D.png");
  }
}
