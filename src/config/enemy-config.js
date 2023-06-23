export const enemyClassTypes = {
  robot: {
    name: "robot",
    sprite: "robot",
    health: 30,
    sound: {
      name: "dead",
      audio: "dead-enemy",
    },
    speed: 50,
    resources: 10,
  },
  heavybot: {
    name: "heavybot",
    sprite: "heavybot",
    health: 50,
    sound: {
      name: "dead",
      audio: "dead",
    },
    speed: 40,
    resources: 75,
  },
  spider: {
    name: "spider",
    sprite: "spider",
    health: 1,
    sound: {
      name: "dead",
      audio: "dead",
    },
    speed: 100,
    resources: 25,
  },
  drone: {
    name: "drone",
    sprite: "drone",
    health: 50,
    sound: {
      name: "dead",
      audio: "dead",
    },
    speed: 75,
    resources: 50,
  },
  golem: {
    name: "golem",
    sprite: "golem",
    health: 250,
    sound: {
      name: "dead",
      audio: "dead",
    },
    speed: 30,
    resources: 100,
  },
  boss: {
    name: "boss",
    sprite: "boss",
    health: 500,
    sound: {
      name: "dead-boss",
      audio: "dead-boss",
    },
    speed: 25,
    resources: 250,
  },
};
