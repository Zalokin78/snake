import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 5;
    this.xPos = 100;
    this.yPos = 400;
    this.segments = this.scene.physics.add.group();
  }
  /*  preload() {
    this.image = this.load.image("segment", "assets/snake16Arrow.png");
    debugger;
    blah
  } */
  create() {
    /* for (let i = 0; i < this.snakeSize; i++) {
      this.segments.create(this.xPos, this.yPos, "segment").setOrigin(0.5);
      this.xPos -= 16;
      this.movements.push([]);
    } */
    this.head = this.scene.physics.add
      .sprite(200, 200, "segment")
      .setVelocity(100, 0);

    //this.cursors = this.scene.input.keyboard.createCursorKeys();

    /*this.input.keyboard
    .on('keydown-LEFT', () => { this.plane.setAngularVelocity(-60); })
    .on('keydown-UP', () => { this.plane.setAngularVelocity(0); });
  }*/

    this.scene.input.keyboard.on("keydown-LEFT", () => {
      this.head.setAngularVelocity(-100);
    });
    this.scene.input.keyboard.on("keydown-RIGHT", () => {
      this.head.setAngularVelocity(100);
    });
  }

  update() {
    this.scene.physics.velocityFromAngle(
      this.head.angle,
      150,
      this.head.body.velocity
    );

    // console.log(this.head.distance.length);
    //this.head.setVelocityX(10);
    //this.head.rotation = this.head.angle;
    //velocityFromAngle(45, 200, null);

    /* if (this.cursors.down.isDown == true) {
    }
    if (this.cursors.left.isDown == true) {
      this.head.setAngularVelocity(-50);
    }
    if (this.cursors.right.isDown == true) {
      this.head.setAngularVelocity(50);
    } */
  }
}

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.config = config;
    this.segments = null;

    this.WKey = null;
    this.SKey = null;
    this.AKey = null;
    this.DKey = null;

    //this.snakeSize = 2;

    //this.inputReady = true;
  }
  preload() {
    this.load.image("segment", "assets/snake16Arrow.png");
  }

  create() {
    this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //this.initialise();

    this.snakeA = new Snake(this);
    console.log(this.snakeA);
    this.add.existing(this.snakeA);

    this.snakeA.create();
  }

  update(time, delta) {
    this.snakeA.update();
  }
}
export default PlayScene;
