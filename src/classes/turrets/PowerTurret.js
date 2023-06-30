import Phaser from "phaser";
import { HumanTurretPopup } from "../../HumanTurretPopup";

export default class PowerTurret extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, turretObject) {
    super(scene, x, y, turretObject.name);

    this.name = turretObject.name;
    this.MapScene = scene;
    scene.add.existing(this);

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
    this.cost = turretObject.cost;

    this.timer = null; // Timer object
    this.timerCountInMilli = turretObject.timer;
    this.fireBtn = document.getElementById(turretObject.name);
    this.fireBtn.addEventListener("click", this.fireTower.bind(this));

    this.sound = this.scene.sound.add(turretObject.sound);
    this.powerUpSound = this.scene.sound.add("power-up");

    this.setInteractive().on("pointerdown", this.onPointerDown, this);
  }

  preload() {}

  onPointerDown(pointer) {
    const popup = new HumanTurretPopup(
      this.MapScene,
      pointer.worldX,
      pointer.worldY,
      175,
      150,
      this
    );

    popup.show();
  }

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
        enemy.setTint(0x99ccff);

        this.MapScene.time.delayedCall(this.damageOutput, () => {
          if (!enemy.body) return;
          enemy.setVelocity(currentVelocity.x, currentVelocity.y);
          enemy.clearTint();
        });
      });
    }
    if (this.turretName === "fire") {
      totalEnemies.forEach((enemy) => {
        changeTintPeriodically(enemy, this.MapScene.speedMultiplyer);
        let counter = 0;
        const burnTimer = enemy.scene.time.addEvent({
          delay: 1000 / this.MapScene.speedMultiplyer,
          repeat: 10,
          callback: () => {
            if (!enemy) {
              return;
            }
            this.sound.play();
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

  upgradeLevel() {
    this.level++;

    if (this.level === 2) {
      this.damageOutput = this.damageObject.level2;
    }

    if (this.level === 3) {
      this.damageOutput = this.damageObject.level3;
      const button = document.getElementById(`${this.name}-upgrade`);
      // @ts-ignore
      button.disabled = true;
      button.textContent = "Fully Upgraded!";
    }

    this.MapScene.resources -= this.level * this.cost;

    this.MapScene.updateResources();
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
function changeTintPeriodically(sprite, speedMultiplyer) {
  let currentTint = 0; // 0: Red, 1: Yellow, 2: Orange
  let timerId;
  let intervalId;

  function clearTint() {
    sprite.clearTint(); // Clear the tint from the sprite
    clearInterval(intervalId); // Stop the interval
  }

  function setTint() {
    if (currentTint === 0) {
      sprite.setTint(0xff0000); // Set red tint
      currentTint = 1;
    } else if (currentTint === 1) {
      sprite.setTint(0xffff00); // Set yellow tint
      currentTint = 2;
    } else {
      sprite.setTint(0xffa500); // Set orange tint
      currentTint = 0;
    }

    timerId = setTimeout(clearTint, 10000 / speedMultiplyer); // Clear the tint and stop after 10 seconds (10000 milliseconds)
  }

  setTint(); // Initial tint
  intervalId = setInterval(setTint, 300 / speedMultiplyer); // Change tint every 300 milliseconds (0.3 seconds)
}
