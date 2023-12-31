import { InteractiveTile } from "../classes/InteractiveTile";

export function createGameMap(scene) {
  const map = scene.make.tilemap({ key: "map" });

  const tileset = map.addTilesetImage("2Dsprites", "tiles", 32, 32);

  const layer1 = map.createLayer(0, tileset);

  layer1.setInteractive();

  layer1.forEachTile(function (tile) {
    if (tile.index === 7) {
      const sprite = new InteractiveTile(scene);
      sprite.setOrigin(0, 0);
      sprite.x = tile.pixelX;
      sprite.y = tile.pixelY;
    }
  });

  const resourceText = createContainerText(
    scene,
    `Resources: ${scene.resources}`,
    { x: 0, y: 0 }
  );
  const scoreText = createContainerText(scene, `Score: ${scene.score}`, {
    x: 800,
    y: 0,
  });

  const waveTimeRemainingText = createContainerText(
    scene,
    `Time Until Next Wave: ${scene.timeUntilNextWave}`,
    {
      x: 350,
      y: 0,
    }
  );

  return { map, layer1, waveTimeRemainingText, scoreText, resourceText };
}

function createContainerText(scene, text, dimensions) {
  text = scene.add.text(dimensions.x, dimensions.y, text, {
    fontSize: "26px",
    backgroundColor: "#180727",
    fontFamily: "Work Sans",
    // @ts-ignore
    padding: 10,
  });

  return text;
}
