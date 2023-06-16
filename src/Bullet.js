import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, angle) {
    super(scene, x, y, "bullet");
    this.scene = scene;

    this.scene.physics.world.enable(this);
    scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.setScale(0.5);
    this.setSize(16, 16);
    // @ts-ignore
    this.body.setAllowGravity(false);

    const speed = 500; // Adjust the bullet speed as needed
    this.scene.physics.velocityFromRotation(angle, speed, this.body.velocity);
    // @ts-ignore
    this.body.setCollideWorldBounds(false); // Enable collision with the world bounds
    // @ts-ignore
    this.body.onWorldBounds = true;
    this.body.bounce.set(1); // Set the bounce value to 1 for full bouncing effect
    this.body.bounce.setTo(1, 1); //

    this.lifespan = 2000; // Lifespan of the bullet in milliseconds
    this.timerEvent = null; // Reference to the timer event

    // Start the lifespan timer when the bullet is created
    this.startLifespanTimer();
  }

  // Override the update method to add any additional logic for the bullet
  update() {
    // Add bullet-specific behavior here
    this.scene.physics.world.collide(
      this,
      this.scene.enemiesGroup,
      this.onCollision,
      null,
      this
    );
  }
  onCollision(bullet, enemy) {
    // Handle bullet collision with enemy here
    // For example, you can damage the enemy or destroy both bullet and enemy
    bullet.destroy();
    enemy.destroy();
  }
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

  activateBounce() {
    this.hasBounce = true;
  }

  // Deactivate the bounce effect
  deactivateBounce() {
    this.hasBounce = false;
  }
  preload() {
    this.scene.load.image("bullet", "assets/images/Bullet.png");
    this.scene.load.audio("bulletsound", "assets/sounds/BulletSound.mp3");
  }
}
