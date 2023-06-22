import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    this.add.text(400, 300, "Game Over", {
      fontSize: "48px",
      fill: "#fff",
      fontFamily: "Work Sans",
    });

    var restartButton = this.add.text(480, 400, "Restart", {
      fontSize: "24px",
      fontFamily: "Work Sans",
      fill: "#fff",
      backgroundColor: "#44165d",
      padding: {
        left: 8,
        right: 8,
        top: 4,
        bottom: 4,
      },
    });
    restartButton.setInteractive();

    restartButton.on(
      "pointerdown",
      function () {
        this.scene.start("mapScene");
      },
      this
    );
  }
}
