export const turretsClassTypes = {
  laser: {
    name: "laser",
    sprite: "laser2D",
    damageOutput: {
      level1: 10,
      level2: 30,
      level3: 100,
    },
    cost: 300,
    experience: {
      level1: 0,
      level2: 10,
      level3: 500,
    },
    tickTimer: 5000,
  },
  auto: {
    name: "turret",
    sprite: "Turret2D",
    damageOutput: {
      level1: 5,
      level2: 15,
      level3: 50,
    },
    cost: 100,
    experience: {
      level1: 0,
      level2: 100,
      level3: 300,
    },
    tickTimer: 2000,
  },
};
