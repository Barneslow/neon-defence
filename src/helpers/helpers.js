import BaseTurret from "../classes/turrets/BaseTurret";
import { turretsClassTypes } from "../config/turrets-config";

export function placeTurretOnMap(pointer, resources, map, turretType) {
  const tile = map.worldToTileXY(pointer.worldX, pointer.worldY);
  const tileId = map.getTileAt(tile.x, tile.y, true).index;

  const turretCosts = { auto: 50, laser: 300 };

  if (tileId === 7 && resources >= turretCosts[turretType]) {
    const tileWidth = map.tileWidth;
    const tileHeight = map.tileHeight;
    const offsetX = tileWidth / 2;
    const offsetY = tileHeight / 2;
    const centerX = tile.x * tileWidth + offsetX;
    const centerY = tile.y * tileHeight + offsetY;

    let turret;
    if (turretType === "auto") {
      turret = new BaseTurret(
        this,
        centerX,
        centerY,
        turretsClassTypes["auto"]
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
