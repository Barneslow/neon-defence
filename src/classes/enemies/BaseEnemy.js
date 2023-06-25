import Phaser from "phaser";

export default class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, enemyObject) {
    super(scene, x, y, enemyObject.name);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.MapScene = scene;
    this.map = scene.map;
    this.health = enemyObject.health * scene.difficulty;
    this.currentHealth = enemyObject.health * scene.difficulty;
    this.initialMove = true;
    this.resources = enemyObject.resources;
    this.speed = enemyObject.speed * scene.speedMultiplyer;

    this.sound = enemyObject.sound;
    this.deadSound = this.scene.sound.add(enemyObject.sound.name);

    this.enemyName = enemyObject.name;
    this.sprite = enemyObject.sprite;

    this.setPosition(145, 767);
    this.overlaySprite = scene.add.sprite(x, y, "flame");
    this.overlaySprite.setDepth(1); // Set the depth to ensure it appears above the base sprite
  }

  preload() {
    this.MapScene.load.image(
      this.enemyName,
      `assets/images/${this.sprite}.png`
    );
    this.MapScene.load.image("flame");
    this.scene.load.audio("bulletsound", "assets/sounds/BulletSound.mp3");

    this.scene.load.audio(
      this.sound.name,
      `assets/sounds/${this.sound.audio}.mp3`
    );
  }

  moveOnPath() {
    // DETECTS IF THE PATH IS A MOVEABLE TILEID
    const currentTile = this.map.getTilesWithinWorldXY(
      this.x,
      this.y,
      this.width,
      this.height
    );

    const singleCurrentTile = currentTile[0];

    if (singleCurrentTile.index === 27) {
      this.setVelocityY(-this.speed);
      this.setVelocityX(0);
    } else if (singleCurrentTile.index === 28) {
      // MOVE RIGHT
      this.setVelocityY(0);
      this.setVelocityX(this.speed);
    } else if (singleCurrentTile.index === 17) {
      // MOVE LEFT
      this.setVelocityY(0);
      this.setVelocityX(-this.speed);
    } else if (singleCurrentTile.index === 5) {
      // MOVE BACK
      this.setVelocityY(this.speed);
      this.setVelocityX(0);
    }
  }

  damageTaken(damage) {
    this.currentHealth -= damage;
    const healthPercentage = this.currentHealth / this.health;

    if (healthPercentage < 0.75 && healthPercentage > 0.5) {
      this.setTint(0xff9999);
    } else if (healthPercentage < 0.5) {
      console.log(this.currentHealth);

      this.setTint(0xff0000);
    }
    if (this.currentHealth <= 0) {
      this.destroy();
      this.deadSound.play({ volume: 0.2 });
      this.MapScene.resources += this.resources;
      this.MapScene.score += this.resources * this.MapScene.difficulty;
      this.MapScene.updateResources();
    }
  }

  update(time, delta) {
    if (this.initialMove) {
      this.setVelocityY(-this.speed);
      this.initialMove = false;
    }
    this.moveOnPath();
    if (this.y < 100) {
      this.MapScene.takeHeart();
      this.destroy();
    }
  }
}
