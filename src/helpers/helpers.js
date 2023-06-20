import AutoTurret from "../classes/turrets/AutoTurret";
import LaserTurret from "../classes/turrets/LaserTurret";
import Turret from "../classes/turrets/Turret";

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
      turret = new AutoTurret(
        this,
        centerX,
        centerY,
        this.bullets,
        this.enemies
      );
    } else if (turretType === "laser") {
      turret = new LaserTurret(
        this,
        centerX,
        centerY,
        this.bullets,
        this.enemies
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
