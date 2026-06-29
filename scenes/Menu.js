export default class Menu extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create() {
    // fondo (opcional)
    this.add.text(400, 200, "Simulador De Secuestro", {
      fontSize: "48px",
      fill: "#ffffff"
    }).setOrigin(0.5);

    this.add.text(400, 300, "Presiona cualquier tecla para empezar", {
      fontSize: "24px",
      fill: "#ffffff"
    }).setOrigin(0.5);

    // detectar input
    this.input.keyboard.once("keydown", () => {
      this.scene.start("game");
    });
  }
}