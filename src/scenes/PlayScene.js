import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 5;
    this.xPos = 100;
    this.yPos = 400;
    this.segments = this.scene.physics.add.group();
    this.segmentsRecord = [];
    this.index = 0;
    this.stutteredIndex = null;
    this.modulus = 0;
    this.indexOffset = 0;
    this.maxOffset = 0;
  }

  /*  preload() {
    this.image = this.load.image("segment", "assets/snake16Arrow.png");
    debugger;
    blah
  } */
  create() {
    for (let i = 0; i < 100; i++) {
      this.segmentsRecord.push({});
    }
    /* for (let i = 0; i < this.snakeSize; i++) {
      this.segments.create(this.xPos, this.yPos, "segment").setOrigin(0.5);
      this.xPos -= 16;
      this.movements.push([]);
    } */
    this.head = this.scene.physics.add
      .sprite(200, 200, "segment")
      .setVelocity(100, 0);

    this.segment = this.scene.physics.add
      .sprite(200, 200, "segment")
      .setVelocity(0, 0);

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
    this.segmentsRecord[this.modulus] = { x: this.head.x, y: this.head.y };
    this.modulus = this.index++ % 100; //revert to the normal if statement i think...
    //if (this.index == this.segmentsRecord.length) this.index = 0;
    console.log(this.segmentsRecord);

    //console.log("hello");
    //make the head move
    this.scene.physics.velocityFromAngle(
      this.head.angle,
      150,
      this.head.body.velocity
    );

    this.segment.x =
      this.segmentsRecord[
        (this.index - this.maxOffset) % this.segmentsRecord.length
      ].x;
    this.segment.y =
      this.segmentsRecord[
        (this.index - this.maxOffset) % this.segmentsRecord.length
      ].y;

    this.maxOffset++;

    if (this.maxOffset > 10) this.maxOffset = 10;
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

  update(/* time, delta */) {
    // console.log("time " + time);
    // console.log("delta " + delta);

    this.snakeA.update();
    //console.log(this.game.loop.actualFps);
    //console.log(this.game.loop.time);
  }
}

/*var game = new Phaser.Game(800, 600, Phaser.AUTO, { preload: preload, create: create, update: update });function preload() {game.load.bitmapFont('desyrel', '/assets/fonts/desyrel.png', '/assets/fonts/desyrel.xml');}var textStyle = { font: '64px Desyrel', align: 'center'};var timer;var milliseconds = 0;var seconds = 0;var minutes = 0;function create() {timer = game.add.bitmapText(250, 250, '00:00:00', textStyle);}function update() {//Calling a different function to update the timer just cleans up the update loop if you have other code.updateTimer();}function updateTimer() {minutes = Math.floor(game.time.time / 60000) % 60;seconds = Math.floor(game.time.time / 1000) % 60;milliseconds = Math.floor(game.time.time) % 100;//If any of the digits becomes a single digit number, pad it with a zeroif (milliseconds < 10)milliseconds = '0' + milliseconds;if (seconds < 10)seconds = '0' + seconds;if (minutes < 10)minutes = '0' + minutes;timer.setText(minutes + ':'+ seconds + ':' + milliseconds);}*/
export default PlayScene;
