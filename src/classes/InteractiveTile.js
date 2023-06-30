import { placeTurret } from "../helpers/helpers";
import * as Sprites from "../parcelSpriteImports";

export class InteractiveTile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, textureKey) {
    super(scene, x, y, "interactive-tile");
    this.Mapscene = scene;
    scene.add.existing(this);
    this.setInteractive();
    this.on("pointerover", this.onHoverIn, this);
    this.on("pointerout", this.onHoverOut, this);
    this.on("pointerdown", this.onTileClicked, this);
  }

  onHoverIn() {
    console.log(this.Mapscene.turretType);
    if (this.Mapscene.turretType === "laser") {
      document.body.style.cursor = `url("${Sprites.laserTurretCursor}")16 16, auto`;
    } else if (this.Mapscene.turretType === "auto") {
      document.body.style.cursor = `url("${Sprites.autoTurretCursor}")16 16, auto`;
    } else if (this.Mapscene.turretType === "human") {
      document.body.style.cursor = `url("${Sprites.humanTurretCursor}")16 16, auto`;
    } else if (this.Mapscene.turretType === "shotgun") {
      document.body.style.cursor = `url("${Sprites.shotgunTurretCursor}")16 16, auto`;
    } else document.body.style.cursor = "pointer";

    this.setTint(0xffff00); // Set a yellow tint
  }

  onTileClicked(pointer) {
    // PLACE TURRET ON THE MAP
    const boundPlaceTurretOnMapFunc = placeTurret.bind(this.Mapscene); // Bind the function to transfer this keyword
    const newRes = boundPlaceTurretOnMapFunc(this);
    this.Mapscene.resources = newRes;

    if (
      this.Mapscene.turretType === "human" &&
      this.Mapscene.resources >= 500
    ) {
      this.Mapscene.humanTurret = true;
      // @ts-ignore
      this.Mapscene.humanTurretBtn.disabled = true;
      this.Mapscene.turretType = null;
    }
  }

  onHoverOut() {
    document.body.style.cursor = `url("${Sprites.cursor}")0 0, pointer`;
    this.clearTint(); // Clear the tint
  }

  update() {}
}
