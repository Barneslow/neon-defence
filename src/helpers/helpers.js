import DroneEnemy from "../classes/enemies/DroneClass";
import BaseTurret from "../classes/turrets/BaseTurret";
import HumanTurret from "../classes/turrets/HumanTurret";

import { turretsClassTypes } from "../config/turrets-config";

export function placeTurretOnMap(pointer, resources, map, turretType) {
  const tile = map.worldToTileXY(pointer.worldX, pointer.worldY);
  const tileId = map.getTileAt(tile.x, tile.y, true).index;

  const turretCosts = {
    auto: turretsClassTypes.auto.cost,
    laser: turretsClassTypes.laser.cost,
    shotgun: turretsClassTypes.shotgun.cost,
    human: turretsClassTypes.human.cost,
  };

  if (tileId === 7 && resources >= turretCosts[turretType]) {
    const tileWidth = map.tileWidth;
    const tileHeight = map.tileHeight;
    const offsetX = tileWidth / 2;
    const offsetY = tileHeight / 2;
    const centerX = tile.x * tileWidth + offsetX;
    const centerY = tile.y * tileHeight + offsetY;

    let turret;
    if (turretType === "human") {
      turret = new HumanTurret(
        this,
        centerX,
        centerY,
        turretsClassTypes[turretType]
      );
    } else {
      turret = new BaseTurret(
        this,
        centerX,
        centerY,
        turretsClassTypes[turretType]
      );
    }

    resources -= turretCosts[turretType];
    this.resourceText.setText(`Resources: ${resources}`);
    this.turrets.add(turret);
    return resources;
  } else {
    this.resourceText.setText(`Resources: Not enough resources`);
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
