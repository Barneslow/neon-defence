import Phaser from "phaser";

export default class BaseBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, bulletObject, damage = 10) {
    super(scene, x, y, bulletObject.sprite);
    this.Mapscene = scene;
    this.scene.physics.world.enable(this);
    scene.physics.add.existing(this);
    this.scene.add.existing(this);

    // BULLET Config Properties
    this.damage = damage;
    this.speed = bulletObject.speed * scene.speedMultiplyer;

    this.lifespan = bulletObject.lifespan;

    // ADDING INSTANCE OF THE BULLET TO THE COLLISION GROUP IN SCENE
    scene.physics.scene.bullets.add(this);

    this.setScale(bulletObject.scale.level1);
    this.setSize(bulletObject.size, bulletObject.size);

    // this.scene.physics.velocityFromRotation(
    //   null,
    //   this.speed,
    //   this.body.velocity
    // );

    this.startLifespanTimer();
  }

  update() {}

  startLifespanTimer() {
    this.timerEvent = this.scene.time.addEvent({
      delay: this.lifespan,
      callback: this.destroyBullet,
      callbackScope: this,
    });
  }

  // Destroy the bullet when the lifespan timer expires
  destroyBullet() {
    this.destroy();
  }

  preload() {}
}
