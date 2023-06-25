import DroneEnemy from "../classes/enemies/DroneClass";
import BaseTurret from "../classes/turrets/BaseTurret";
import HumanTurret from "../classes/turrets/HumanTurret";

import { turretsClassTypes } from "../config/turrets-config";

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
