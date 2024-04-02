import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 20;
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
    this.segmentsRecordSize = 500;
    this.movementSwitch = true;
    //testing keyboard
    this.keys = new Set();
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

    this.spacebar = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update() {
    /* this.scene.input.keyboard.JustDown("keydown", () => {
      alert("keydown!");
    }); */
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      alert("key pressed!");
    }

    //test key event manager

    this.scene.input.keyboard.on("keydown", (event) => {
      if (!this.keys.has(event.code)) {
        this.keys.add(event.code);
        this.scene.input.keyboard.emit(`keypress_${event.code}`);
        // or / and
        this.scene.input.keyboard.emit(`keypress`, event.code);
      }
    });

    this.scene.input.keyboard.on("keyup", (event) => {
      this.keys.delete(event.code);
      this.scene.input.keyboard.emit(`keyrelease_${event.code}`);
      // or / and
      this.scene.input.keyboard.emit(`keyrelease`, event.code);
    });

    /* if (this.movementSwitch) {
      if (
        (this.head.angle > 85 && this.head.angle < 95) ||
        (this.head.angle > -85 && this.head.angle < -95) ||
        (this.head.angle > -175 && this.head.angle < 5) ||
        (this.head.angle > 175 && this.head.angle < 5)
      ) {
        //alert("90 degrees!!");
        //this.head.setAngularVelocity(0);
        this.movementSwitch = false;
      }
    } */
    this.scene.physics.velocityFromAngle(
      this.head.angle,
      100,
      this.head.body.velocity
    );

    console.log(this.head.angle);

    this.segmentsRecord.unshift({ x: this.head.x, y: this.head.y });
    this.segmentsRecord.pop();

    this.segments.children.entries.forEach((element) => {
      element.x = this.segmentsRecord[this.offset].x;
      element.y = this.segmentsRecord[this.offset].y;
      this.offset += this.initOffset;
    });
    this.offset = this.initOffset;
    this.movementSwitch = true;
  }

  checkCollision(x, y) {
    //console.log(this.scene.topLayer);
    if (this.snakeSize > 2) {
      this.segments.children.entries.forEach((element) => {
        if (element.x == x && element.y == y) {
          this.collision = true;
          //this.scene.gameOver();
        }
      });
    }

    return this.collision;
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
