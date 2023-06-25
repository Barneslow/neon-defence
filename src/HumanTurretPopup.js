export class HumanTurretPopup extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, turret) {
    super(scene, x, y);

    // turrent instance
    this.turret = turret;

    // Create the background rectangle for the popup
    const background = scene.add.rectangle(0, 0, width, height, 0x000000, 0.9);
    background.setOrigin(0.5);
    background.setStrokeStyle(2, 0xffffff);
    background.setInteractive();

    // Create the red UpgradeButton button
    const upgradeButton = scene.add.text(0, 0, "Upgrade", {
      fontSize: "20px",
      fontFamily: "Work Sans",
      color: "#000000",
      backgroundColor: "#0096FF",
      padding: {
        left: 8,
        right: 8,
        top: 4,
        bottom: 4,
      },
    });
    upgradeButton.setOrigin(0.5);
    upgradeButton.setInteractive();
    upgradeButton.on("pointerdown", this.upgradeButtonClicked, this);

    // Create the green Y button
    const sellButton = scene.add.text(0, -50, "Sell", {
      fontSize: "20px",
      fontFamily: "Work Sans",
      color: "#000000",
      backgroundColor: "#90EE90",
      padding: {
        left: 8,
        right: 8,
        top: 4,
        bottom: 4,
      },
    });
    sellButton.setOrigin(0.5);
    sellButton.setInteractive();
    sellButton.on("pointerdown", this.sellButtonClicked, this);

    const closeButton = scene.add.text(0, 50, "Close", {
      fontSize: "20px",
      fontFamily: "Work Sans",
      color: "#000000",
      backgroundColor: "#FF0000",
      padding: {
        left: 8,
        right: 8,
        top: 4,
        bottom: 4,
      },
    });
    closeButton.setOrigin(0.5);
    closeButton.setInteractive();
    closeButton.on("pointerdown", this.closeButtonClicked, this);

    // Add the elements to the container
    this.add(background);
    this.add(upgradeButton);
    this.add(sellButton);
    this.add(closeButton);

    // Add the container to the scene
    scene.add.existing(this);

    this.setDepth(3);
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  closeButtonClicked() {
    this.hide();
  }
  upgradeButtonClicked() {
    this.hide();
    this.turret.upgradeLevel();
  }

  sellButtonClicked() {
    this.hide();
    this.turret.sellTurret();
  }
}
