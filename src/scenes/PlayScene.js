import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 10;
    this.xPos = 200;
    this.yPos = 200;
    this.segments = this.scene.physics.add.group();
    this.segmentsRecord = [];
    this.index = 0;
    this.stutteredIndex = null;
    this.modulus = 0;
    this.indexOffset = 0;
    this.maxOffset = 0;
    this.initOffset = 15;
    this.offset = this.initOffset;
    this.segmentsRecordSize = 200;
  }

  /*  preload() {
    this.image = this.load.image("segment", "assets/snake16Arrow.png");
    debugger;
    blah
  } */
  create() {
    for (let i = 0; i < this.segmentsRecordSize; i++) {
      this.segmentsRecord.push({ x: this.xPos + i, y: this.yPos });
    }

    this.head = this.scene.physics.add
      .sprite(this.xPos, this.yPos, "segment")
      .setVelocity(100, 0);

    for (let i = 0; i < this.snakeSize; i++) {
      this.segments
        .create(this.xPos + this.offset, this.yPos, "segment")
        .setOrigin(0.5);

      //this.xPos -= 16;
      //this.movements.push([]);
      this.offset += this.initOffset;
    }
    this.offset = this.initOffset;
    //console.log(this.segments);
    //debugger;

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
      100,
      this.head.body.velocity
    );

    this.segmentsRecord.unshift({ x: this.head.x, y: this.head.y });
    this.segmentsRecord.pop();

    this.segments.children.entries.forEach((element) => {
      element.x = this.segmentsRecord[this.offset].x;
      element.y = this.segmentsRecord[this.offset].y;
      this.offset += this.initOffset;
    });
    this.offset = this.initOffset;
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
