export const bulletClassTypes = {
  turret: {
    damage: 20,
    sprite: "bullet",
    speed: 500,
    lifespan: 2000,
    scale: {
      level1: 0.5,
      level2: 0.75,
      level3: 1,
    },
    size: 60,
  },
  laser: {
    damage: 10,
    sprite: "bullet",
    speed: 1000,
    lifespan: 10000,
    scale: {
      level1: 0.5,
      level2: 0.75,
      level3: 1,
    },
    size: 60,
  },
  shotgun: {
    damage: 30,
    sprite: "ShotGunBullet",
    speed: 500,
    lifespan: 1000,
    scale: {
      level1: 0.5,
      level2: 0.75,
      level3: 1,
    },
    size: 60,
  },
  antiAir: {
    damage: 10,
    sprite: "AntiAerialBullet",
    speed: 500,
    lifespan: 2000,
    scale: {
      level1: 0.5,
      level2: 0.75,
      level3: 1,
    },
    size: 100,
  },
  human: {
    damage: 10,
    sprite: "HumanBullet",
    speed: 500,
    lifespan: 2000,
    scale: {
      level1: 0.5,
      level2: 0.75,
      level3: 1,
    },
    size: 60,
  },
};
