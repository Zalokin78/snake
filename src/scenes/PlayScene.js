import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 10;
    this.segments = this.scene.physics.add.group();
    this.collisionBody = this.scene.physics.add.group();
    this.segmentsRecord = [];
    this.index = 0;
    this.modulus = 0;
    this.indexOffset = 0;
    this.segmentGap = 1200;
    this.maxOffset = 0;
    this.velocity = 200; //130
    this.initOffset = Math.round((1 / this.velocity) * this.segmentGap);
    this.offset = this.initOffset;
    this.segmentsRecordSize = 500;
    this.collision = false;
    this.lastOffset = null;
    this.angularVelocity = 300;
    this.velMultiplyer = 3;
    this.snakeCreated = false;
    this.keys = {
      plyr1: ["LEFT", "RIGHT"],
      plyr2: ["A", "D"],
    };
  }

  create() {
    console.log(this.initState);
    //this.createSnake();
    this.head = this.segments.children.entries[0];

    this.segments.children.entries[0].body.angle = this.angle;

    this.head.angle = this.segments.children.entries[0].body.angle;

    this.segments.children.entries.forEach((segment) => {
      segment.body.angle = this.head.angle;
      segment.body.setImmovable(true);
    });
    if (this.scene.generateSnake) {
      this.createColliders();
      this.keyboardMovement();
    }
    //debugger;

    /* this.scene.input.keyboard.on("keydown-UP", () => {});

    this.spacebar = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    ); */
    this.snakeCreated = true;
  }

  initSnakeInstance() {
    this.segmentsRecord = [];
    this.xPos = this.initState.xPos;
    this.yPos = this.initState.yPos;
    this.angle = this.initState.angle;
    this.player = this.initState.player;

    //this.scene.collision = true;
    //debugger;

    for (let i = 0; i < this.segmentsRecordSize; i++) {
      this.xPos -= Math.cos(Math.PI * (this.angle / 180)) * this.velMultiplyer;
      this.yPos -= Math.sin(Math.PI * (this.angle / 180)) * this.velMultiplyer;
      //debugger;

      this.segmentsRecord.push({
        x: this.xPos,
        y: this.yPos,
        angle: this.angle,
        isHead: i == 0 ? true : false,
      });
    }

    //note that 1st one of the array is head, so the offset is applied to all but the head hence the following ternary operator.
    for (let i = 0; i < this.snakeSize; i++) {
      if (!this.snakeCreated) {
        this.segments
          .create(
            this.segmentsRecord[i == 0 ? 0 : this.offset].x,
            this.segmentsRecord[i == 0 ? 0 : this.offset].y,
            "segment"
          )
          .setOrigin(0.5);
      } else {
        this.segments.children.entries[i].x =
          this.segmentsRecord[i == 0 ? 0 : this.offset].x;
        this.segments.children.entries[i].y =
          this.segmentsRecord[i == 0 ? 0 : this.offset].y;
      }
      //console.log(this.segments.children.entries.length);
      //debugger;

      /* if (this.scene.collision) {
        debugger;
      } */

      if (i > 0) {
        this.offset += this.initOffset;
      }
    }
    this.offset = this.initOffset;
    if (this.scene.collision) {
      //debugger;
    }
    debugger;
  }

  update() {
    this.worldBoundaryBehaviour();
    this.snakeMovement();
  }

  keyboardMovement() {
    console.log(Object.values(this.keys));

    let playerKeys = this.keys[Object.keys(this.keys)[this.player]];
    this.scene.input.keyboard.on(`keydown-${playerKeys[0]}`, () => {
      this.head.setAngularVelocity(-this.angularVelocity);
    });
    this.scene.input.keyboard.on(`keyup-${playerKeys[0]}`, () => {
      this.head.setAngularVelocity(0);
    });
    this.scene.input.keyboard.on(`keydown-${playerKeys[1]}`, () => {
      this.head.setAngularVelocity(this.angularVelocity);
    });
    this.scene.input.keyboard.on(`keyup-${playerKeys[1]}`, () => {
      this.head.setAngularVelocity(0);
    });
  }

  createSnake() {
    //this.angle = 90;
    //this.head.setTint(0xff0000);
    /* for (let i = 0; i < this.segmentsRecordSize; i++) {
      this.xPos -= Math.cos(Math.PI * (this.angle / 180)) * this.velMultiplyer;
      this.yPos -= Math.sin(Math.PI * (this.angle / 180)) * this.velMultiplyer;

      this.segmentsRecord.push({
        x: this.xPos,
        y: this.yPos,
        angle: this.angle,
        isHead: i == 0 ? true : false,
      });
    }

    //note that 1st one of the array is head, so the offset is applied to all but the head hence the following ternary operator.
    for (let i = 0; i < this.snakeSize; i++) {
      this.segments
        .create(
          this.segmentsRecord[i == 0 ? 0 : this.offset].x,
          this.segmentsRecord[i == 0 ? 0 : this.offset].y,
          "segment"
        )
        .setOrigin(0.5);

      this.offset += this.initOffset;
    } */
  }

  snakeMovement() {
    this.scene.physics.velocityFromAngle(
      this.head.angle,
      this.velocity,
      this.head.body.velocity
    );
    if (this.collision) debugger;

    this.segmentsRecord.splice(1, 0, {
      x: this.head.x,
      y: this.head.y,
      angle: this.head.angle,
    });
    if (this.scene.collision) {
      //debugger;
    }
    this.segmentsRecord.pop();
    if (!this.scene.physicsPause) {
      this.segments.children.entries.forEach((segment) => {
        if (segment !== this.head) {
          segment.x = this.segmentsRecord[this.offset].x;
          segment.y = this.segmentsRecord[this.offset].y;
          segment.angle = this.segmentsRecord[this.offset].angle;
          this.offset += this.initOffset;
        }
      });
      this.lastOffset = this.offset;
      this.offset = this.initOffset;
    }
    if (this.scene.collision) {
      //debugger;
    }
  }

  createColliders() {
    this.scene.colliders.push(
      this.scene.physics.add.collider(
        this.head,
        this.segments.children.entries.slice(2),
        () => {
          this.scene.testFunc2("self", this.player);
        },
        null,
        this
      )
    );

    this.scene.colliders.push(
      this.scene.physics.add.collider(
        this.head,
        this.scene.snakes[this.player == 0 ? 1 : 0].segments.children.entries,
        //this.scene.snakes[this.player == 0 ? 1 : 0].collisionObjs,
        () => {
          this.scene.testFunc2("other", this.player), null, this;
        }
      )
    );

    this.scene.colliders.push(
      this.scene.physics.add.collider(
        this.head,
        this.scene.topLayer,
        () => {
          this.scene.testFunc2("tile", this.player);
        },
        null,
        this
      )
    );

    this.scene.colliders.push(
      this.scene.physics.add.collider(
        this.head,
        this.scene.apple,
        () => {
          this.eat(this);
        },
        null,
        this
      )
    );
    console.log(this.scene.apple);
  }

  eat() {
    //for (let player = 0; player < this.noOfPlayers; player++) {
    //this.initSnakeInstance();
    //debugger;
    //}
    //debugger;
    this.scene.generateApple();
    let segmentRef = this.lastOffset + this.initOffset;
    let segment = this.segments
      .create(
        this.segmentsRecord[segmentRef].x,
        this.segmentsRecord[segmentRef].y,
        "segment"
      )
      .setOrigin(0.5);
    this.scene.physics.add.collider(segment, this.head, () => {
      this.scene.testFunc2("self", this.player);
    });
    segment.body.setImmovable(true);
    console.log(this.player);
    if (this.player == 0) segment.setTint(0xff0000);
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
    this.noOfPlayers = 2;
    this.apple = {};
    this.snakes = [];
    this.physicsPause = false;
    this.initState = [
      { xPos: 100, yPos: 400, angle: 90, player: 0 },
      { xPos: 300, yPos: 500, angle: 90, player: 1 },
    ];
    this.collision = false;
    this.colliders = [];
    this.generateSnake = true;
    //this.snake = {};
  }
  preload() {
    this.load.image("terrain", "assets/Tiled/terrain_atlas.png");
    this.load.image("segment", "assets/ovalSegment.png");
    this.load.image("apple", "assets/fujiApple.png");

    this.load.tilemapTiledJSON("mappy", "assets/Tiled/snakeTiles.json");
  }

  create() {
    this.tileSet();

    this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.generateApple();
    this.apple = this.physics.add
      .sprite(this.apple.x, this.apple.y, "apple")
      .setOrigin(0.5, 0.5)
      .setPushable(false)
      .setImmovable(true);

    this.createSnake();
  }

  update(/* time, delta */) {
    this.snakes.forEach((snake) => {
      snake.update();
    });

    //console.log(this.game.loop.actualFps);
    //console.log(this.game.loop.time);
  }

  createSnake() {
    /* if (this.generateSnake) {
      for (let i = 0; i < this.noOfPlayers; i++) {
        console.log(i);
        this.snake = new Snake(this);
        debugger;
        this.snakes.push(this.snake);
        this.snakes[i].player = i;
        //console.log(this.snakes[i]);
      }
    } */

    //this.generateSnake = false;
    if (this.generateSnake) {
      for (let player = 0; player < this.noOfPlayers; player++) {
        this.snake = new Snake(this);
        this.snakes.push(this.snake);
        this.snake.initState = this.initState[player];
        //debugger;
        /* this.snakes[i].xPos = this.initState[i].xPos;
        this.snakes[i].yPos = this.initState[i].yPos;
        this.snakes[i].angle = this.initState[i].angle;
        this.snakes[i].player = i; */
        //this.initSnake(player);
        //debugger;
      }
    }

    this.snakes.forEach((snake) => {
      snake.initSnakeInstance();
      snake.create();
    });

    this.snakes[0].segments.children.entries.forEach((segment) => {
      segment.setTint(0xff0000);
    });
  }

  /* initSnake(player) {
    this.snakes[player].xPos = this.initState[player].xPos;
    this.snakes[player].yPos = this.initState[player].yPos;
    this.snakes[player].angle = this.initState[player].angle;
    this.snakes[player].player = player;
    debugger;
  } */

  generateApple() {
    this.collision = true;

    do {
      let rndWidth = Math.floor(Phaser.Math.Between(0, this.config.width));
      let rndHeight = Math.floor(Phaser.Math.Between(0, this.config.height));

      this.apple.x = rndWidth;
      this.apple.y = rndHeight;
    } while (
      this.topLayer.tilemap.hasTileAtWorldXY(this.apple.x, this.apple.y)
    );
  }

  tileSet() {
    let mappy = this.add.tilemap("mappy");

    let terrain = mappy.addTilesetImage("terrain_atlas", "terrain");

    let botLayer = mappy.createLayer("bot", terrain, 0, 0);
    let grassLayer = mappy.createLayer("grass", terrain, 0, 0);
    this.topLayer = mappy.createLayer("wall", terrain, 0, 0);

    //this.physics.add.collider(this.snakeA, this.topLayer);

    this.topLayer.setCollisionByProperty({ collides: true });
  }

  testFunc2(collType, player) {
    //this.collision = true;
    if (this.collision) {
      console.log(collType);
      // this.physicsPause = true;
      // this.physics.pause();

      if (collType == "self") {
        alert(`Player ${player} collided with itself`);
      } else if (collType == "tile") {
        alert(`Player ${player} collided with a tile`);
      } else if (collType == "other") {
        alert(
          `Player ${player + 1} collided with player ${
            (player == 0 ? 1 : 0) + 1
          }`
        );
      }
      //debugger;
      this.collision = false;
      this.snakes.forEach((snake) => {
        /* snake.segments.children.entries.forEach((segment) => {
            segment.disableBody(false, false);
          }); */
        snake.initSnakeInstance();
        snake.head.angle = 90;

        /* this.snakes.forEach((snake) => {
          snake.update();
        }); */
        console.log(snake.head.angle);
        console.log(this.collision);
        debugger;

        //this.input.keyboard.resetKeys();
      });
      this.collision = true;
      debugger;
    }

    /* for (let player = 0; player < this.noOfPlayers; player++) {
      console.log(this.snakes);
      debugger;
      this.snakes[player].initSnake();
    } */
    //this.initSnakeInstance();
    //this.makeSnakes();
    //return false;
  }
}

export default PlayScene;
