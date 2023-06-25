export class Popup extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, turret) {
    super(scene, x, y);

    // turrent instance
    this.turret = turret;

    // Create the background rectangle for the popup
    const background = scene.add.rectangle(0, 0, width, height, 0x000000, 0.9);
    background.setOrigin(0.5);
    background.setStrokeStyle(2, 0xffffff);

    // Create the text for the popup
    const text = scene.add.text(0, -height / 2 + 30, "Sell", {
      fontSize: "24px",
      fontFamily: "Work Sans",
      color: "#ffffff",
    });
    text.setOrigin(0.5);

    // Create the red X button
    const xButton = scene.add.text(width / 2 - 20, height / 2 - 20, "X", {
      fontSize: "16px",
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
    xButton.setOrigin(0.5);
    xButton.setInteractive();
    xButton.on("pointerup", this.onXButtonClicked, this);

    // Create the green Y button
    const yButton = scene.add.text(-width / 2 + 20, height / 2 - 20, "Y", {
      fontSize: "16px",
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
    yButton.setOrigin(0.5);
    yButton.setInteractive({ useHandCursor: true });
    yButton.on("pointerup", this.onYButtonClicked, this);

    // Add the elements to the container
    this.add(background);
    this.add(text);
    this.add(xButton);
    this.add(yButton);

    // Set the hit area of the container to the background rectangle
    this.setSize(width, height);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains
    );

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

  onXButtonClicked() {
    this.hide();
  }

  onYButtonClicked() {
    this.hide();
    this.turret.sellTurret();
  }
}
