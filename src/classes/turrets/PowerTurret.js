import Phaser from "phaser";
import { Popup } from "../../Popup";

export default class PowerTurret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, turretObject) {
    super(scene, x, y, turretObject.name);

    this.MapScene = scene;
    scene.add.existing(this);
    this.purchased = false;

    // Creating Turret Config Properties
    this.turretName = turretObject.name;
    this.turretSprite = turretObject.sprite;
    this.cost = turretObject.cost;

    // Adding CollisionGroups
    this.bulletCollisionGroup = scene.physics.scene.bullets;
    this.enemies = scene.physics.scene.enemies;

    // Adding tower level
    this.level = 1;
    this.damageOutput = turretObject.damageOutput.level1;
    this.damageObject = turretObject.damageOutput;

    // Adding interactive properties
    // this.setInteractive({ useHandCursor: true })
    //   .on("pointerover", this.onPointerOver, this)
    //   .on("pointerout", this.onPointerOut, this)
    //   .on("pointerdown", this.onPointerDown, this);

    console.log(turretObject);

    this.timer = null; // Timer object
    this.timerCountInMilli = turretObject.timer;
    this.fireBtn = document.getElementById(turretObject.name);
    this.fireBtn.addEventListener("click", this.fireTower.bind(this));

    this.sound = this.scene.sound.add(turretObject.sound);
    this.powerUpSound = this.scene.sound.add("power-up");
  }

  preload() {}

  startTimer() {
    this.timer = this.scene.time.addEvent({
      delay: this.timerCountInMilli / this.MapScene.speedMultiplyer,
      callback: this.endTimer,
      callbackScope: this,
    });
    // @ts-ignore
    this.fireBtn.disabled = true;
    this.setTexture(`${this.turretSprite.name}-inactive`);

    this.fireBtn.innerHTML = `<div id="timer" class="circle">
    <div class="up">
      <div class="innera"></div>
    </div>
    <div class="down">
      <div class="innerb"></div>
    </div>
</div>`;
  }

  endTimer() {
    // @ts-ignore
    this.fireBtn.disabled = false;
    this.setTexture(this.turretSprite.name);
    this.powerUpSound.play();

    if (this.turretName === "fire") {
      this.fireBtn.innerHTML =
        '<i style="color: red" class="fa-solid fa-fire"></i>';
    }
    if (this.turretName === "freeze") {
      this.fireBtn.innerHTML =
        '<i style="color: aquamarine" class="fa-solid fa-icicles"></i>';
    }
    if (this.turretName === "electric") {
      this.fireBtn.innerHTML =
        '<i style="color: yellow" class="fa-solid fa-bolt-lightning"></i>';
    }
  }

  fireTower() {
    this.startTimer();
    this.sound.play();

    const totalEnemies = Array.from(this.enemies.children.entries);

    if (this.turretName === "electric") {
      totalEnemies.forEach((enemy) => {
        enemy.damageTaken(this.damageOutput);
      });
    }
    if (this.turretName === "freeze") {
      totalEnemies.forEach((enemy) => {
        const currentVelocityX = enemy.body.velocity.x;
        const currentVelocityY = enemy.body.velocity.y;
        let currentVelocity = { x: currentVelocityX, y: currentVelocityY };

        enemy.setVelocity(0, 0);

        this.MapScene.time.delayedCall(this.damageOutput, () => {
          if (!enemy.body) return;
          enemy.setVelocity(currentVelocity.x, currentVelocity.y);
        });
      });
    }
    if (this.turretName === "fire") {
      totalEnemies.forEach((enemy) => {
        let counter = 0;
        const burnTimer = enemy.scene.time.addEvent({
          delay: 1000 / this.MapScene.speedMultiplyer,
          repeat: 10,
          callback: () => {
            if (!enemy) {
              return;
            }
            enemy.damageTaken(this.damageOutput);
            counter++;

            if (counter >= 10) {
              burnTimer.remove();
            }
          },
          callbackScope: enemy,
        });
      });
    }
  }

  onPointerDown(pointer) {
    const popup = new Popup(
      this.MapScene,
      pointer.worldX,
      pointer.worldY,
      100,
      100,
      this
    );

    popup.show();
  }

  updateTower() {
    this.level++;
  }

  update() {
    if (this.timer && this.timer.getProgress() < 1) {
      const remainingTime = Math.ceil(this.timer.getRemaining() / 1000);
    }
  }
}
