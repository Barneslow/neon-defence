import AutoTurret from "../classes/turrets/AutoTurret";
import Turret from "../classes/turrets/Turret";

export function placeTurretOnMap(pointer, resources, map) {
  const tile = map.worldToTileXY(pointer.worldX, pointer.worldY);
  const tileId = map.getTileAt(tile.x, tile.y, true).index;
  if (tileId === 7 && resources >= 10) {
    const tileWidth = map.tileWidth;
    const tileHeight = map.tileHeight;
    const offsetX = tileWidth / 2;
    const offsetY = tileHeight / 2;
    const centerX = tile.x * tileWidth + offsetX;
    const centerY = tile.y * tileHeight + offsetY;
    const turret = new Turret(
      this,
      centerX,
      centerY,
      100,
      this.bullets,
      this.enemies
    );
    resources -= 10;
    this.resourceText.setText(`Resources: ${resources}`);
    this.turrets.add(turret);
  } else {
    this.resourceText.setText(`Resources: Not enough resources`);
  }
}
