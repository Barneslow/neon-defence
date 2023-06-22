export const turretsClassTypes = {
  laser: {
    name: "laser",
    sprite: {
      level1: {
        name: "laser",
        sprite1: "LaserTurretlvl2",
      },
      level2: {
        name: "laser2",
        sprite2: "LaserTurretlvl2",
      },
      level3: {
        name: "laser3",
        sprite3: "LaserTurretlvl3",
      },
    },
    damageOutput: {
      level1: 10,
      level2: 30,
      level3: 100,
    },
    cost: 300,
    experience: {
      level1: 0,
      level2: 10,
      level3: 20,
    },
    tickTimer: 5000,
  },
  auto: {
    name: "turret",
    sprite: {
      level1: {
        name: "turret",
        sprite1: "Turret2D",
      },
      level2: {
        name: "turret2",
        sprite1: "Turret2Dlvl2",
      },
      level3: {
        name: "turret3",
        sprite1: "Turret2Dlvl3",
      },
    },
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

  human: {
    name: "turret",
    sprite: {
      level1: {
        name: "turret",
        sprite1: "Turret2D",
      },
      level2: {
        name: "turret2",
        sprite1: "Turret2Dlvl2",
      },
      level3: {
        name: "turret3",
        sprite1: "Turret2Dlvl3",
      },
    },
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
    tickTimer: null,
  },
};
