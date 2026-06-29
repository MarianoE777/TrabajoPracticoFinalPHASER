export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.score = 0;
    this.tienePersona = false;
    this.tiempoRestante = 40; // segundos
    this.gameOver = false;
    this.vidas = 6;
  }

  preload() {
    this.load.image("jugador", "public/assets/secuestrador3.png");
    this.load.image("persona", "public/assets/Sin Título1.png");
    this.load.image("casa", "public/assets/Sin Título1.png");
    this.load.image("fondo", "public/assets/fondo.png");
    this.load.image("corazon", "public/assets/corazon.png");
    this.load.image("casa1", "public/assets/casahorrible1.png");
    this.load.image("pared", "public/assets/muro1.png");
  }

  create() {
    this.physics.world.setBounds(0, 0, 3006, 3018);

  // fondo grande
    this.fondo = this.add.image(1503, 1509, "fondo");
    this.fondo.setDisplaySize(3006, 3018);
    this.fondo.setDepth(-1);
    this.fondo.setTint(0x879ff2)
    // jugador
    this.jugador = this.physics.add.sprite(100, 100, "jugador");
    this.jugador.setCollideWorldBounds(true);
    this.jugador.body.setAllowGravity(false);
    //this.jugador.setTint(0x000fff)
    this.jugador.setScale(0.2);

    // persona a buscar
    this.personas = this.physics.add.group();

    for (let i = 0; i < 5; i++) {
      let x = Phaser.Math.Between(100, 2900);
      let y = Phaser.Math.Between(100, 2900);

      let persona = this.personas.create(x, y, "persona");

      persona.setScale(0.25);
      persona.body.setAllowGravity(false);
      persona.setCollideWorldBounds(true);
      persona.setBounce(1);


      this.cambiarDireccion(persona);
    }

    this.personas.getChildren().forEach((persona) => {
      persona.setScale(0.25);
      persona.body.setAllowGravity(false);
    });

    // lugar destino
    this.casa = this.physics.add.sprite(500, 300, "casa");
    this.casa.body.setAllowGravity(false);
    this.casa.setTint(0xf00ff0)
    this.casa.setScale(0.4);

    // teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    // texto
    this.scoreText = this.add.text(16, 16, "Personas Encerradas: 0 de 3", {
      fontSize: "24px",
      fill: "#ffffff"
    });
    //this.scoreText.setScale(1,2)
    this.scoreText.style.backgroundColor = "#000"
    this.scoreText.setScrollFactor(0);

    // colisiones
    this.physics.add.overlap(
      this.jugador,
      this.personas,
      this.collectPersona,
      null,
      this
    );

    this.physics.add.overlap(
      this.jugador,
      this.casa,
      this.reachGoal,
      null,
      this
    );
    this.cameras.main.setBounds(0, 0, 3006, 3018);

    this.cameras.main.startFollow(this.jugador, true);

    this.cameras.main.setZoom(1);

    this.timerText = this.add.text(500, 16, "Tiempo: 40", {
      fontSize: "28px",
      fill: "#ffffff"
    }).setScrollFactor(0);
    
    this.time.addEvent({
      delay: 1000, // 1 segundo
      callback: this.actualizarTiempo,
      callbackScope: this,
      loop: true
    });
    this.corazones = [];

      for (let i = 0; i < this.vidas; i++) {
        let corazon = this.add.image(485 + i * 40, 80, "corazon")
          .setScale(0.1)
          .setScrollFactor(0);
          
        this.corazones.push(corazon);
      }
    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => {

        this.personas.getChildren().forEach(persona => {

        if (persona.active) {
          this.cambiarDireccion(persona);
        }

      });
        let x = Phaser.Math.Between(100, 2900);
        let y = Phaser.Math.Between(100, 2900);
        }
    });
    this.paredes = this.physics.add.staticGroup();
    this.paredes.create(900, 600, "pared").setScale(0.5).refreshBody();
    this.paredes.create(1200, 1050, "pared").setScale(0.5).refreshBody();
    this.paredes.create(1300, 2500, "pared").setScale(0.5).refreshBody();
    this.casitas = this.physics.add.staticGroup();
    this.casitas.create(400, 1900, "casa1").setScale(0.8).refreshBody();
    this.casitas.create(1900, 2500, "casa1").setScale(0.8).refreshBody();
    this.casitas.create(2500, 1200, "casa1").setScale(0.8).refreshBody();

    // jugador con obstáculos
    this.physics.add.collider(this.jugador, this.paredes);
    this.physics.add.collider(this.jugador, this.casitas);

    // personas con obstáculos (opcional pero MUY recomendado)
    this.physics.add.collider(this.personas, this.paredes);
    this.physics.add.collider(this.personas, this.casitas);
  }

  update() {
    const speed = 270;
    if (this.gameOver) return;
    this.jugador.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.jugador.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.jugador.setVelocityY(speed);
    }
  }

  collectPersona(jugador, persona) {
    // Si ya tiene una persona, no hace nada
    if (this.tienePersona) return;

    // Toma la persona
    persona.disableBody(true, true);

    this.tienePersona = true;
  }

  reachGoal(jugador, casa) {
    if (this.tienePersona) {
      this.score += 1;
      this.tienePersona = false;

      this.scoreText.setText("Personas Encerradas: " + this.score + " de 3");
      if (this.score >= 3) {
        this.ganar();
      }
    }
  }

  actualizarTiempo() {
    if (this.gameOver) return;

      this.tiempoRestante--;

      this.timerText.setText("Tiempo: " + this.tiempoRestante);

      if (this.tiempoRestante <= 0) {
        this.eventoTiempo();
      }
  }
  perder() {
    this.gameOver = true;

    // frenar jugador
    this.jugador.setVelocity(0);

    // mostrar mensaje
    this.add.text(400, 300, "PERDISTE", {
      fontSize: "48px",
      fill: "#ff0000"
    }).setScrollFactor(0);
  }

  eventoTiempo() {
  // 1. eliminar persona aleatoria
  let personasActivas = this.personas.getChildren().filter(p => p.active);

  if (personasActivas.length > 0) {
    let random = Phaser.Math.Between(0, personasActivas.length - 1);
    let persona = personasActivas[random];

    persona.disableBody(true, true);
  }

    // 2. perder vida
    this.vidas--;

    let corazon = this.corazones.pop();
    if (corazon) corazon.destroy();

    // 3. reiniciar tiempo
    this.tiempoRestante = 20;

    // 4. verificar derrota
    if (this.vidas <= 0) {
      this.perder();
    }
  }
  ganar() {
    this.gameOver = true;

    this.jugador.setVelocity(0);

    this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "NIVEL COMPLETADO",
        {
            fontSize: "48px",
            fill: "#00ff00"
        }
    )
    .setOrigin(0.5)
    .setScrollFactor(0);

    this.time.delayedCall(2000, () => {
        this.scene.start("game2", {
        vidas: this.vidas});
    });
  }
  cambiarDireccion(persona) {
    const velocidad = 150;

    const angulo = Phaser.Math.FloatBetween(0, Math.PI * 2);

    persona.setVelocity(
      Math.cos(angulo) * velocidad,
      Math.sin(angulo) * velocidad
    );
  }
}
