import BaseTurret from "../classes/turrets/BaseTurret";
import HumanTurret from "../classes/turrets/HumanTurret";
import PowerTurret from "../classes/turrets/PowerTurret";
import Turret from "../classes/turrets/Turret";
import { turretsClassTypes } from "../config/turrets-config";

export function placeTurretOnMap(pointer, resources, map, turretType) {
  const tile = map.worldToTileXY(pointer.worldX, pointer.worldY);
  const tileId = map.getTileAt(tile.x, tile.y, true).index;

  const turretCosts = {
    auto: turretsClassTypes.auto.cost,
    laser: turretsClassTypes.laser.cost,
    electric: turretsClassTypes.electric.cost,
  };

  if (tileId === 7 && resources >= turretCosts[turretType]) {
    const tileWidth = map.tileWidth;
    const tileHeight = map.tileHeight;
    const offsetX = tileWidth / 2;
    const offsetY = tileHeight / 2;
    const centerX = tile.x * tileWidth + offsetX;
    const centerY = tile.y * tileHeight + offsetY;

    let turret;
    if (turretType === "auto") {
      // turret = new Turret(
      //   this,
      //   centerX,
      //   centerY,
      //   turretsClassTypes["auto"]
      // );
      // turret = new HumanTurret(
      //   this,
      //   centerX,
      //   centerY,
      //   turretsClassTypes["human"]
      // );
      turret = new PowerTurret(
        this,
        centerX,
        centerY,
        turretsClassTypes["electric"]
      );
    } else if (turretType === "laser") {
      turret = new BaseTurret(
        this,
        centerX,
        centerY,
        turretsClassTypes["laser"]
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
  var enemyUnits = enemies.getChildren();
  for (var i = 0; i < enemyUnits.length; i++) {
    if (
      enemyUnits[i].active &&
      Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <
        distance
    )
      return enemyUnits[i];
  }
  return false;
}
