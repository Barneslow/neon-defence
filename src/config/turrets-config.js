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
      level1: 30,
      level2: 60,
      level3: 100,
    },
    cost: 400,
    experience: {
      level1: 0,
      level2: 100,
      level3: 300,
    },
    tickTimer: 3000,
    range: 250,
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
      level1: 10,
      level2: 20,
      level3: 40,
    },
    cost: 100,
    experience: {
      level1: 0,
      level2: 100,
      level3: 300,
    },
    tickTimer: 1000,
    range: 175,
  },
  shotgun: {
    name: "shotgun",
    sprite: {
      level1: {
        name: "shotgun",
        sprite1: "ShotGunTurret",
      },
      level2: {
        name: "shotgun2",
        sprite1: "ShotGunTurretlvl2",
      },
      level3: {
        name: "shotgun3",
        sprite1: "ShotGunTurretlvl3",
      },
    },
    damageOutput: {
      level1: 50,
      level2: 75,
      level3: 200,
    },
    cost: 300,
    experience: {
      level1: 0,
      level2: 100,
      level3: 300,
    },
    tickTimer: 1500,
    range: 125,
  },

  human: {
    name: "human",
    sprite: {
      level1: {
        name: "human1",
        sprite1: "HumanTurret",
      },
      level2: {
        name: "human2",
        sprite1: "HumanTurretlvl2",
      },
      level3: {
        name: "human3",
        sprite1: "HumanTurretlvl3",
      },
    },
    damageOutput: {
      level1: 5,
      level2: 10,
      level3: 30,
    },
    cost: 750,
    experience: {
      level1: 0,
      level2: 35,
      level3: 100,
    },
    tickTimer: null,
    range: 200,
  },

  // POWER TOWERS

  electric: {
    name: "electric",
    sprite: {
      name: "electric",
      sprite1: "Turret2D",
    },
    damageOutput: {
      level1: 25,
      level2: 35,
      level3: 50,
    },
    cost: 1500,
    timer: 10000,
    sound: "electric-audio",
  },
  freeze: {
    name: "freeze",
    sprite: {
      name: "freeze",
      sprite1: "Turret2D",
    },
    damageOutput: {
      level1: 1000,
      level2: 2000,
      level3: 4000,
    },
    cost: 1000,
    timer: 10000,
    sound: "freeze-audio",
  },
  fire: {
    name: "fire",
    sprite: {
      name: "fire",
      sprite1: "Turret2D",
    },
    damageOutput: {
      level1: 2,
      level2: 4,
      level3: 6,
    },
    cost: 1250,
    timer: 10000,
    sound: "fire-audio",
  },
};
