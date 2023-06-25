export const enemyClassTypes = {
  robot: {
    name: "robot",
    sprite: "robot",
    health: 100,
    sound: {
      name: "dead",
      audio: "dead-enemy",
    },
    speed: 50,
    resources: 25,
  },
  heavybot: {
    name: "heavybot",
    sprite: "heavybot",
    health: 200,
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
    health: 150,
    sound: {
      name: "dead",
      audio: "dead",
    },
    speed: 100,
    resources: 75,
  },
  drone: {
    name: "drone",
    sprite: "drone",
    health: 100,
    sound: {
      name: "dead",
      audio: "dead",
    },
    speed: 75,
    resources: 100,
  },
  golem: {
    name: "golem",
    sprite: "golem",
    health: 300,
    sound: {
      name: "dead",
      audio: "dead",
    },
    speed: 30,
    resources: 150,
  },
  boss: {
    name: "boss",
    sprite: "boss",
    health: 600,
    sound: {
      name: "dead-boss",
      audio: "dead-boss",
    },
    speed: 25,
    resources: 250,
  },
};
