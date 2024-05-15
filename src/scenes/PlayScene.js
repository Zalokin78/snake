import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 10;
    //this.xPos = 100;
    //this.yPos = 100;
    this.segments = this.scene.physics.add.group();
    this.segmentsRecord = [];
    this.index = 0;
    //this.stutteredIndex = null;
    this.modulus = 0;
    this.indexOffset = 0;
    this.segmentGap = 1100;
    this.maxOffset = 0;
    this.velocity = 200; //130
    this.initOffset = Math.round((1 / this.velocity) * this.segmentGap);
    this.offset = this.initOffset;
    this.segmentsRecordSize = 500;
    this.collision = false;
    this.lastOffset = null;
    this.angularVelocity = 300;
    this.velMultiplyer = 3;
    //this.playerTint = "ff0000";
  }

  create() {
    //console.log(this.scene.topLayer);
    this.createSnake();
    this.createColliders();
    this.keyboardMovement(2);

    /* this.scene.input.keyboard.on("keydown-UP", () => {});

    this.spacebar = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    ); */
  }

  update() {
    this.worldBoundaryBehaviour();
    this.snakeMovement();

    //this.collision = this.checkCollision(this.head.x, this.head.y);
  }

  keyboardMovement(player) {
    if (this.player == 0) {
      this.scene.input.keyboard.on("keydown-LEFT", () => {
        this.head.setAngularVelocity(-this.angularVelocity);
      });
      this.scene.input.keyboard.on("keyup-LEFT", () => {
        this.head.setAngularVelocity(0);
        //this.head.angle -= 5;git branch
      });
      this.scene.input.keyboard.on("keydown-RIGHT", () => {
        this.head.setAngularVelocity(this.angularVelocity);
      });

      this.scene.input.keyboard.on("keyup-RIGHT", () => {
        this.head.setAngularVelocity(0);
      });
    }

    if (this.player == 1) {
      this.scene.input.keyboard.on("keydown-A", () => {
        this.head.setAngularVelocity(-this.angularVelocity);
      });
      this.scene.input.keyboard.on("keyup-A", () => {
        this.head.setAngularVelocity(0);
      });
      this.scene.input.keyboard.on("keydown-D", () => {
        this.head.setAngularVelocity(this.angularVelocity);
      });

      this.scene.input.keyboard.on("keyup-D", () => {
        this.head.setAngularVelocity(0);
      });
    }
  }

  createSnake() {
    this.head = this.scene.physics.add.sprite(this.xPos, this.yPos, "segment");

    this.head.angle = 90;
    this.head.setTint(0xff0000);

    for (let i = 0; i < this.segmentsRecordSize; i++) {
      this.xPos -=
        Math.cos(Math.PI * (this.head.angle / 180)) * this.velMultiplyer; //* 2.635;
      this.yPos -=
        Math.sin(Math.PI * (this.head.angle / 180)) * this.velMultiplyer; //* 2.635;

      this.segmentsRecord.push({
        x: this.xPos,
        y: this.yPos,
        angle: this.head.angle,
      });
    }

    for (let i = 0; i < this.snakeSize; i++) {
      this.segments
        .create(
          this.segmentsRecord[this.offset].x,
          this.segmentsRecord[this.offset].y,
          "segment"
        )
        .setOrigin(0.5);

      this.offset += this.initOffset;
    }

    this.segments.children.entries.forEach((element) => {
      element.body.angle = this.head.angle;
      element.body.setImmovable(true);
    });

    this.offset = this.initOffset;
  }
  snakeMovement() {
    this.scene.physics.velocityFromAngle(
      this.head.angle,
      this.velocity,
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
    // debugger;
  }

  /* checkCollision(x, y) {
    this.segments.children.entries.forEach((element) => {
      if (element.x == x && element.y == y) {
        this.collision = true;

        //this.scene.gameOver();
      }
    });

    return this.collision;
  }
 */
  createColliders() {
    console.log(this.head);
    /* this.scene.physics.add.collider(
      this.head,
      this.segments.children.entries.slice(1),

      this.scene.testFunc2
    );

    this.scene.physics.add.collider(
      this.head,
      this.scene.topLayer,
      this.scene.testFunc2,
      null,
      this
    ); */

    this.scene.physics.add.collider(
      this.head,
      this.segments.children.entries.slice(1),
      () => {
        this.scene.testFunc2("self", this.player);
      },
      null,
      this
    );

    this.scene.physics.add.collider(
      this.head,
      this.scene.topLayer,
      () => {
        // this.scene.testFunc2("tile");
        this.scene.testFunc2("tile", this.player);
      },
      null,
      this
    );

    this.scene.physics.add.collider(
      this.head,
      this.scene.apple,
      () => {
        // this.scene.eat(this);
        this.eat(this);
      },
      null,
      this
    );
  }

  eat() {
    this.scene.generateApple();
    let segmentRef = this.lastOffset + this.initOffset;
    let segment = this.segments
      .create(
        this.segmentsRecord[segmentRef].x,
        this.segmentsRecord[segmentRef].y,
        "segment"
      )
      .setOrigin(0.5);
    this.scene.physics.add.collider(
      segment,
      this.head,
      () => {
        this.scene.testFunc2("self", this.player);
      }

      // this.scene.testFunc2
    );
    segment.body.setImmovable(true);
    console.log(this.head);
    console.log(segment);

    //snake.snakeSize++;

    //this.hasAte = true;
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

    //this.initialise();
    // this.snakes.push()
    for (let i = 0; i < this.noOfPlayers; i++) {
      console.log(i);
      this.snake = new Snake(this);
      this.snakes.push(this.snake);
      this.snakes[i].player = i;
      //console.log(this.snakes[i]);
    }

    this.snakes[0].xPos = 200;
    this.snakes[0].yPos = 200;
    //this.snakes[0].player = 1;
    if (this.noOfPlayers > 1) {
      this.snakes[1].xPos = 400;
      this.snakes[1].yPos = 400;
      //this.snakes[1].player = 2;
    }

    this.generateApple();
    this.apple = this.physics.add
      .sprite(this.apple.x, this.apple.y, "apple")
      .setOrigin(0.5, 0.5)
      .setPushable(false);

    //this.add.existing(this.snakeA);

    this.snakes.forEach((snake) => {
      snake.create();
    });

    console.log(this.snakes[0].segments.children.entries);
    this.snakes[0].segments.children.entries.forEach((segment) => {
      segment.setTint(0xff0000);
      //console.log(segment);
    });

    //apple collision
    /* this.snakes.forEach((snake) => {
      this.physics.add.collider(
        snake.head,
        this.apple,
        () => {
          this.eat(snake);
        },
        null,
        this
      );
    }); */

    /* this.testSprite = this.physics.add.sprite(200, 200, "segment");
    console.log(this.topLayer);
    this.physics.add.collider(
      this.testSprite,
      this.topLayer,
      this.testFunc2,
      null,
      this
    ); */
    // console.log(this.topLayer.tilemap.tileToWorldXY(2, 1));
    // console.log(this.topLayer.tilemap.hasTileAtWorldXY(65, 65));
    /* this.topLayer.tilemap.forEachTile((element) => {
      if (element.index > -1)
        console.log(this.topLayer.tilemap.tileToWorldXY(element.x, element.y));
    }); */
    //console.log(this.snakes[0].body.set);
    //this.snakes[0].snake
  }

  update(/* time, delta */) {
    //testSprite movement testing area
    /* this.testSprite.setVelocityX(0);
    this.testSprite.setVelocityY(0);

    if (this.WKey.isDown == true) {
      this.testSprite.setVelocityY(-100);
    }
    if (this.SKey.isDown == true) {
      this.testSprite.setVelocityY(100);
    }
    if (this.AKey.isDown == true) {
      this.testSprite.setVelocityX(-100);
    }
    if (this.DKey.isDown == true) {
      this.testSprite.setVelocityX(100);
    } */
    // console.log("time " + time);
    // console.log("delta " + delta);
    /* this.snakes.forEach((snake)=>{

    }) */

    this.snakes.forEach((snake) => {
      snake.update();
    });

    //console.log(this.game.loop.actualFps);
    //console.log(this.game.loop.time);
  }

  generateApple() {
    do {
      let rndWidth = Math.floor(Phaser.Math.Between(0, this.config.width));
      let rndHeight = Math.floor(Phaser.Math.Between(0, this.config.height));

      this.apple.x = rndWidth;
      this.apple.y = rndHeight;
    } while (
      this.topLayer.tilemap.hasTileAtWorldXY(this.apple.x, this.apple.y)
    );
  }

  /* eat(snake) {
    this.generateApple();
    snake.segments
      .create(
        snake.segmentsRecord[snake.lastOffset + snake.initOffset].x,
        snake.segmentsRecord[snake.lastOffset + snake.initOffset].y,
        "segment"
      )
      .setOrigin(0.5);
    this.physics.add.collider(
      snake.head,
      snake.segments.children.entries.slice(1),

      this.scene.testFunc2
    );

    //snake.snakeSize++;

    //this.hasAte = true;
  } */
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
    console.log(collType);
    //debugger;
    if (collType == "self") {
      alert(`Player ${player} collided with itself`);
    } else if (collType == "tile") {
      alert(`Player ${player} collided with a tile`);
    }

    //console.log("RESTART II!!!!!");
    //alert("Tile collision!!");
  }
}

export default PlayScene;
