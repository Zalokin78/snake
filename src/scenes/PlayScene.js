import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 8;
    this.xPos = 200;
    this.yPos = 200;
    this.segments = this.scene.physics.add.group();
    this.segmentsRecord = [];
    this.index = 0;
    this.stutteredIndex = null;
    this.modulus = 0;
    this.indexOffset = 0;
    this.maxOffset = 0;
    this.initOffset = 10; //should be a static property (same in all instances)
    this.offset = this.initOffset;
    this.segmentsRecordSize = 500;
    this.testCounter = 0;
    this.collision = false;
    this.lastOffset = null;
  }

  /*  preload() {
    this.image = this.load.image("segment", "assets/snake16Arrow.png");
    debugger;
    blah
  } */
  create() {
    for (let i = 0; i < this.segmentsRecordSize; i++) {
      this.segmentsRecord.push({
        x: this.xPos + this.initOffset,
        y: this.yPos,
        angle: 0,
      });
    }

    this.head = this.scene.physics.add
      .sprite(this.xPos, this.yPos, "segment")
      .setVelocity(100, 0);

    this.head.angle = 180;

    for (let i = 0; i < this.snakeSize; i++) {
      this.segments
        .create(this.xPos + this.offset, this.yPos, "segment")
        .setOrigin(0.5);

      this.offset += this.initOffset;
    }
    this.offset = this.initOffset;
    this.createColliders();

    this.keyboardMovement();

    /* this.scene.input.keyboard.on("keydown-UP", () => {});

    this.spacebar = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    ); */
    console.log(this.scene.config.width);
  }

  update() {
    // console.log(this.head.x);
    // console.log(this.head.y);
    // console.log(this.segments);
    // console.log(this.head);
    this.worldBoundaryBehaviour();
    this.snakeMovement();
    // this.segments.forEach((element) => {
    this.collision = this.checkCollision(this.head.x, this.head.y);
    //console.log(this.collision);

    if (this.collision) alert("COLLISION!!");
    // });
  }

  keyboardMovement() {
    this.scene.input.keyboard.on("keydown-LEFT", () => {
      this.head.setAngularVelocity(-200);
    });
    this.scene.input.keyboard.on("keyup-LEFT", () => {
      this.head.setAngularVelocity(0);
      //this.head.angle -= 5;
    });
    this.scene.input.keyboard.on("keydown-RIGHT", () => {
      this.head.setAngularVelocity(200);
    });

    this.scene.input.keyboard.on("keyup-RIGHT", () => {
      this.head.setAngularVelocity(0);
    });
  }
  snakeMovement() {
    this.scene.physics.velocityFromAngle(
      this.head.angle,
      100,
      this.head.body.velocity
    );

    this.segmentsRecord.unshift({
      x: this.head.x,
      y: this.head.y,
      angle: this.head.angle,
    });
    this.segmentsRecord.pop();

    this.segments.children.entries.forEach((element) => {
      //console.log(element.x);
      element.x = this.segmentsRecord[this.offset].x;
      element.y = this.segmentsRecord[this.offset].y;
      element.angle = this.segmentsRecord[this.offset].angle;
      this.offset += this.initOffset;
    });
    this.lastOffset = this.offset;
    this.offset = this.initOffset;
  }

  checkCollision(x, y) {
    //if (this.snakeSize > 2) {
    this.segments.children.entries.forEach((element) => {
      //console.log(x);
      //console.log(element.x);
      if (element.x == x && element.y == y) {
        this.collision = true;

        //this.scene.gameOver();
      }
    });
    //}

    return this.collision;
  }

  createColliders() {
    this.scene.physics.add.collider(this.head, this.segments, () => {
      //alert("COLLSIONNNNN!!");
    });
  }

  worldBoundaryBehaviour() {
    this.head.x = this.head.x % this.scene.config.width;
    this.head.y = this.head.y % this.scene.config.height;

    if (this.head.x <= 0) this.head.x = this.scene.config.width;
    if (this.head.y <= 0) this.head.y = this.scene.config.height;
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
    this.apple = {};
  }
  preload() {
    this.load.image("segment", "assets/ovalSegment.png");
    this.load.image("apple", "assets/fujiApple.png");
  }

  create() {
    console.log(Snake);
    this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //this.initialise();

    this.snakeA = new Snake(this);
    console.log(this.snakeA);
    this.generateApple();
    this.apple = this.physics.add
      .sprite(this.apple.x, this.apple.y, "apple")
      .setOrigin(0.5, 0.5)
      .setPushable(false);

    this.add.existing(this.snakeA);

    this.snakeA.create();

    console.log(this.snakeA.head);
    this.physics.add.collider(
      this.snakeA.head,
      this.apple,
      this.eat,
      null,
      this
    );
  }

  update(/* time, delta */) {
    // this.apple.x;
    // this.apple.y;
    // console.log("time " + time);
    // console.log("delta " + delta);

    this.snakeA.update();
    //console.log(this.game.loop.actualFps);
    //console.log(this.game.loop.time);
  }

  generateApple() {
    let rndWidth = Math.floor(Phaser.Math.Between(0, this.config.width));
    let rndHeight = Math.floor(Phaser.Math.Between(0, this.config.height));

    this.apple.x = rndWidth;
    this.apple.y = rndHeight;
  }

  eat() {
    this.generateApple();
    this.snakeA.segments
      .create(
        this.snakeA.segmentsRecord[
          this.snakeA.lastOffset + this.snakeA.initOffset
        ].x,
        this.snakeA.segmentsRecord[
          this.snakeA.lastOffset + this.snakeA.initOffset
        ].y,
        "segment"
      )
      .setOrigin(0.5);

    console.log(this.snakeA.snakeSize);
    this.snakeA.snakeSize++;

    //this.hasAte = true;
  }
}

export default PlayScene;
