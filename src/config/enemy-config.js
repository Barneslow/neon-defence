export const enemyClassTypes = {
  robot: {
    name: "robot",
    sprite: "Robot2D",
    health: 30,
    sound: {
      name: "dead",
      audio: "dead-enemy",
    },
    speed: 50,
    resources: 10,
  },
  boss: {
    name: "boss",
    sprite: "Boss",
    health: 500,
    sound: {
      name: "dead-boss",
      audio: "dead-boss",
    },
    speed: 25,
    resources: 50,
  },
};
