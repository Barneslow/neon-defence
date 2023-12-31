import BaseEnemy from "../classes/enemies/BaseEnemy";
import DroneEnemy from "../classes/enemies/DroneClass";
import BaseTurret from "../classes/turrets/BaseTurret";
import HumanTurret from "../classes/turrets/HumanTurret";

import { turretsClassTypes } from "../config/turrets-config";

export function placeTurret(sprite) {
  const turretCosts = {
    auto: turretsClassTypes.auto.cost,
    laser: turretsClassTypes.laser.cost,
    shotgun: turretsClassTypes.shotgun.cost,
    human: turretsClassTypes.human.cost,
    antiAir: turretsClassTypes.antiAir.cost,
  };

  if (this.resources >= turretCosts[this.turretType]) {
    let turret;
    if (this.turretType === "human") {
      turret = new HumanTurret(
        this,
        sprite.x + 16,
        sprite.y + 16,
        turretsClassTypes[this.turretType]
      );
    } else {
      turret = new BaseTurret(
        this,
        sprite.x + 16,
        sprite.y + 16,
        turretsClassTypes[this.turretType]
      );
    }

    this.resources -= turretCosts[this.turretType];
    this.resourceText.setText(`Resources: ${this.resources}`);
    this.turrets.add(turret);

    return this.resources;
  } else {
    this.notEnoughRes();

    return this.resources;
  }
}

export function placeTurretOnMap(pointer) {
  const tile = this.map.worldToTileXY(pointer.worldX, pointer.worldY);
  const tileId = this.map.getTileAt(tile.x, tile.y, true).index;

  const turretCosts = {
    auto: turretsClassTypes.auto.cost,
    laser: turretsClassTypes.laser.cost,
    shotgun: turretsClassTypes.shotgun.cost,
    human: turretsClassTypes.human.cost,
  };

  if (tileId === 7 && this.resources >= turretCosts[this.turretType]) {
    const tileWidth = this.map.tileWidth;
    const tileHeight = this.map.tileHeight;
    const offsetX = tileWidth / 2;
    const offsetY = tileHeight / 2;
    const centerX = tile.x * tileWidth + offsetX;
    const centerY = tile.y * tileHeight + offsetY;

    let turret;
    if (this.turretType === "human") {
      turret = new HumanTurret(
        this,
        centerX,
        centerY,
        turretsClassTypes[this.turretType]
      );
    } else {
      turret = new BaseTurret(
        this,
        centerX,
        centerY,
        turretsClassTypes[this.turretType]
      );
    }

    this.resources -= turretCosts[this.turretType];
    this.resourceText.setText(`Resources: ${this.resources}`);
    this.turrets.add(turret);

    return this.resources;
  } else {
    this.notEnoughRes();

    return this.resources;
  }
}

// FIND NEARBY ENEMY
export function getEnemyNearTurret(x, y, distance, enemies) {
  const enemyUnits = enemies.getChildren();

  const noDroneFilter = enemyUnits.filter(
    (obj) => !(obj instanceof DroneEnemy)
  );

  for (let i = 0; i < noDroneFilter.length; i++) {
    if (
      noDroneFilter[i].active &&
      Phaser.Math.Distance.Between(
        x,
        y,
        noDroneFilter[i].x,
        noDroneFilter[i].y
      ) < distance
    )
      return noDroneFilter[i];
  }
  return false;
}

export function getFlyingEnemyNearTurret(x, y, distance, enemies) {
  const enemyUnits = enemies.getChildren();

  const noBaseFilter = enemyUnits.filter((obj) => obj instanceof DroneEnemy);

  for (let i = 0; i < noBaseFilter.length; i++) {
    if (
      noBaseFilter[i].active &&
      Phaser.Math.Distance.Between(x, y, noBaseFilter[i].x, noBaseFilter[i].y) <
        distance
    )
      return noBaseFilter[i];
  }
  return false;
}

export function timerDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDuration(duration) {
  const minutes = Math.floor(duration / 60000); // Get the whole minutes
  const seconds = Math.floor((duration % 60000) / 1000); // Get the remaining seconds

  // Format the minutes and seconds into a string
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function toggleCurrentEnemiesSpeed(
  speed,
  currentEnemies,
  currentTurrets
) {
  currentEnemies.forEach((enemy) => {
    const newXVelocity = enemy.body.velocity.x * speed;
    const newYVelocity = enemy.body.velocity.y * speed;

    enemy.body.setVelocity(newXVelocity, newYVelocity);
    enemy.speed = enemy.speed * speed;
  });

  currentTurrets.forEach((turret) => {
    turret.tickTimer = turret.tickTimer / speed;
  });
}
