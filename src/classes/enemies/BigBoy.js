import Phaser from "phaser";

export default class BigBoy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, name, path) {
    super(scene, x, y, name, path);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.MapScene = scene;
    this.map = scene.map;
    this.nextTic = 0;
    this.path = path;
    this.health = 300;
    this.currentHealth = 20;
    this.setTint(0xffffff);
    this.setPosition(145, 767);
    this.initialMove = true;
    this.deadSound = this.scene.sound.add("dead-boss");
  }

  preload() {
    this.MapScene.load.image("boss", "assets/images/Boss.png");
    this.scene.load.audio("dead-boss", "assets/sounds/dead-boss.mp3");
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
      this.setVelocityY(-20);
      this.setVelocityX(0);
    } else if (singleCurrentTile.index === 28) {
      // MOVE RIGHT
      this.setVelocityY(0);
      this.setVelocityX(20);
    } else if (singleCurrentTile.index === 17) {
      // MOVE LEFT
      this.setVelocityY(0);
      this.setVelocityX(-20);
    } else if (singleCurrentTile.index === 5) {
      // MOVE BACK
      this.setVelocityY(20);
      this.setVelocityX(0);
    }
  }

  damageTaken(damage) {
    this.currentHealth -= damage;
    const healthPercentage = this.currentHealth / this.health;

    if (healthPercentage < 0.75 && healthPercentage > 0.5) {
      this.setTint(0xff9999);
    } else if (healthPercentage < 0.5) {
      this.setTint(0xff0000);
    }
    if (this.currentHealth <= 0) {
      this.destroy();
      this.deadSound.play({ volume: 0.2 });

      this.MapScene.resources += 10;
      this.MapScene.updateResources();
    }
  }

  update(time, delta) {
    if (this.initialMove) {
      this.setVelocityY(-50);
      this.initialMove = false;
    }
    this.moveOnPath();
  }
}
