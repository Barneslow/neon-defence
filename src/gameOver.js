import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    this.add.text(400, 300, "Game Over", { fontSize: "32px", fill: "#fff" });

    var restartButton = this.add.text(450, 400, "Restart", {
      fontSize: "24px",
      fill: "#fff",
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
