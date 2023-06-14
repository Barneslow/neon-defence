import Phaser from "phaser";
import Tower from "./Tower";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "assets/json/Map.json");
    this.load.image("tiles", "assets/images/BaseSpritev2.png");
    this.load.image("tower", "assets/images/Tower.png");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    if (!map) {
      console.error("Failed to load tilemap");
      return;
    }
    const tileset = map.addTilesetImage("BaseTilesV2", "tiles");

    const layerNames = [];
    let i = 0;
    let layerName = i + "layer";

    while (map.getLayer(layerName)) {
      layerNames.push(layerName);
      i++;
      layerName = i + "layer";
    }

    const tileLayer = layerNames.map((layerName) => {
      return map.createLayer(layerName, tileset);
    });

    tileLayer.forEach((layer) => {
      layer.forEachTile((tile) => {
        const tileX = Math.floor(tile.pixelX + tile.width / 2) / 32;
        const tileY = Math.floor(tile.pixelY + tile.height / 2) / 32;
        tile.properties.coordinates = { x: tileX, y: tileY };
      });
    });

    const offsetX = 50; // Set the desired offset in the X-axis
    const offsetY = 50; // Set the desired offset in the Y-axis

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    // this.cameras.main.setBounds(
    //   -offsetX,
    //   -offsetY,
    //   mapWidth + offsetX * 2,
    //   mapHeight + offsetY * 2
    // );
    this.cameras.main.centerOn(mapWidth / 8.5, mapHeight / 1.5);

    tileLayer.forEach((layer) => {
      layer.setInteractive();
      layer.on("pointerdown", (pointer, x, y, event) => {
        const tile = layer.getTileAtWorldXY(x, y);
        if (tile) {
          const { x: tileX, y: tileY } = tile.properties.coordinates;
          console.log(`Tile Coordinates: x=${tileX}, y=${tileY}`);
        }
      });
    });

    const newTower = new Tower(this, 300, 500);
    this.add.existing(newTower);
  }
}
