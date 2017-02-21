(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Food {
    constructor(size) {
        this.x = p.offsetX;
        this.y = p.offsetY;
        this.size = size;
        this.setRandomLocation();
    }

    setRandomLocation() {
        let cols = Math.floor((p.width - p.offsetX) / this.size);
        let rows = Math.floor((p.height - p.offsetY) / this.size);
        this.x = (Math.floor(p.random(cols)) * this.size) + p.offsetX;
        this.y = (Math.floor(p.random(rows)) * this.size) + p.offsetY;
    }

    render() {
        p.push();
        p.stroke('#F4002B')
        p.fill('#D21A3B');
        p.ellipse(this.x + (this.size / 2), this.y + (this.size / 2), this.size / 1.5, this.size / 1.5);
        p.pop();
    }
}

module.exports = Food;
},{}],2:[function(require,module,exports){
const StateStack = require('./stateStack.js');
const MenuState = require('./menuState.js');

class Game {
    constructor(canvasElementID) {
        this.config = {
            width: 600,
            height: 620,
            cellSize: 20,
            FPS: 30,
            canvasElementID: canvasElementID
        }

        this.stateManager = new StateStack();        
    }

    setup() {
        this.p5.createCanvas(this.config.width, this.config.height + this.config.cellSize);
        this.p5.offsetX = 0;
        this.p5.offsetY = this.config.cellSize;
        this.p5.frameRate(30);        
        this.p5.draw = this.draw.bind(this);        
        this.stateManager.push(new MenuState(this));
    }

    draw() {
        this.update();
        this.render();
    }

    update() {
        this.stateManager.update();
    }

    render() {
        this.stateManager.render();
    }

    setupP5() {
        let self = this;
        p5.disableFriendlyErrors = true;
        new p5((p5instance) => {
            p5instance.setup = self.setup.bind(self),
                p5instance.tick = tick;
                window.p = p5instance;
                self.p5 = p5instance;                
        }, this.config.canvasElementID);
    }

    init() {
        this.setupP5();        
    }
}

let timer = 0;
function tick(fn, interval) {
    const currMillis = p.millis();
    if (timer < currMillis - interval || timer == 0) {
        fn();
        timer = currMillis;
    }
}

module.exports = Game;
},{"./menuState.js":4,"./stateStack.js":9}],3:[function(require,module,exports){
/**
 * Mini snake game.
 * 
 * based on work of Daniel Shiffman: http://codingtra.in
 * 
 * color pallete: http://paletton.com/#uid=65w0C0kjXkL4t7gc6dZs6s9IvFK
 */
const Game = require('./game.js');
let game = new Game('canvas');
game.init();
},{"./game.js":2}],4:[function(require,module,exports){
const State = require('./state.js');
const PlayState = require('./playState.js');

class MenuState extends State {
    constructor(game) {
        super();
        this.name = 'menustate';
        this.game = game;
    }

    onEnter() {
        p.mousePressed = () => {
            this.play();
        }

        p.keyPressed = () => {
            this.play();            
        }
    }

    onExit() {
        p.mousePressed = null;
        p.keyPressed = null;
    }

    update() {}

    play() {
        this.game.stateManager.push(new PlayState(this.game));
    }

    render() {
        p.push();

        // Background
        p.background('#474749');

        p.textSize(60);
        p.fill('#45E700');
        p.textAlign(p.CENTER,p.BOTTOM);
        p.text('Snake Game', 0, 0, this.game.config.width, this.game.config.height / 2);

        p.textSize(20);
        p.fill('#4AC117');
        p.textAlign(p.CENTER,p.TOP);
        p.textStyle(p.ITALIC);
        p.text('Press any key to start...', 0, this.game.config.height / 2, this.game.config.width, this.game.config.height / 2 );        

        p.pop();
    }
}

module.exports = MenuState;
},{"./playState.js":5,"./state.js":8}],5:[function(require,module,exports){
const State = require('./state.js');
const Snake = require('./snake.js');
const Food = require('./food.js');
const ScoreState = require('./scoreState.js');

class PlayState extends State {
    constructor(game) {
        super();
        this.name = 'playstate';
        this.game = game;
        this.snake = new Snake(this.game.config.cellSize);
        this.food = new Food(this.game.config.cellSize);
        this.tickSpeed = 50;
        this.totalCells = Math.floor(this.game.config.width / this.game.config.cellSize) * Math.floor(this.game.config.height / this.game.config.cellSize);
    }

    onEnter() {
        this.previousMousePressed = p.mousePressed;
        this.previousKeyPressed = p.keyPressed;
        p.mousePressed = () => {
            this.snake.addTail();
        }

        p.keyPressed = () => {
            if (p.keyCode === p.UP_ARROW) {
                this.snake.addDirectionChange(0, -this.game.config.cellSize);
            } else if (p.keyCode === p.DOWN_ARROW) {
                this.snake.addDirectionChange(0, this.game.config.cellSize);
            } else if (p.keyCode === p.RIGHT_ARROW) {
                this.snake.addDirectionChange(this.game.config.cellSize, 0);
            } else if (p.keyCode === p.LEFT_ARROW) {
                this.snake.addDirectionChange(-this.game.config.cellSize, 0);
            }
        }
    }

    onExit() {
        p.mousePressed = this.previousMousePressed;
        p.keyPressed = this.previousKeyPressed;
    }

    update() {
        this.tickSpeed = 300 - Math.floor(((250 * this.snake.total) / this.totalCells))
        p.tick(() => {
            if (this.snake.eat(this.food)) {
                do {
                    this.food = new Food(this.game.config.cellSize);
                } while (this.snake.collides(this.food.x, this.food.y))
            }
            this.snake.update();
            const score = this.snake.total;
            if (this.snake.dieOnCollision()) {
                this.game.stateManager.pop();
                this.game.stateManager.push(new ScoreState(this.game, score));
            }
        }, this.tickSpeed)
    }

    render() {
        p.push();

        // Background
        p.background('#474749');

        // Top bar
        p.fill('#FF7600');
        p.rect(0, 0, this.game.config.width, this.game.config.cellSize);

        // Top bar text    
        p.textSize(14)
        p.fill('#6F5945');
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('Score: ' + (this.snake.total - 1), 4, 2, p.width - 4, this.game.config.cellSize - 2);
        p.textAlign(p.LEFT, p.CENTER);
        p.text('Mini snake game', 4, 2, p.width - 4, this.game.config.cellSize - 2);

        this.food.render();
        this.snake.render();

        p.pop();
    }
}

module.exports = PlayState;
},{"./food.js":1,"./scoreState.js":6,"./snake.js":7,"./state.js":8}],6:[function(require,module,exports){
const State = require('./state.js');

class ScoreState extends State {
    constructor(game, score) {
        super();
        this.game = game;
        this.score = score;
    }

    onEnter() {
        this.previousMousePressed = p.mousePressed;
        this.previousKeyPressed = p.keyPressed;

        p.mousePressed = () => {
            this.return();
        }

        p.keyPressed = () => {
            this.return();            
        }
    }

    return() {
        this.game.stateManager.pop();
    }

    onExit() {
        p.mousePressed = this.previousMousePressed;
        p.keyPressed = this.previousKeyPressed;
    }

    render() {
        p.push();

        // Background
        p.background('#474749');

        p.textSize(60);
        p.fill('#45E700');
        p.textAlign(p.CENTER,p.BOTTOM);
        p.text('Score: ' + (this.score - 1), 0, 0, this.game.config.width, this.game.config.height / 2);

        p.textSize(20);
        p.fill('#4AC117');
        p.textAlign(p.CENTER,p.TOP);
        p.textStyle(p.ITALIC);
        p.text('Press any key to return to menu...', 0, this.game.config.height / 2, this.game.config.width, this.game.config.height / 2 );         

        p.pop();
    }

}

module.exports = ScoreState;
},{"./state.js":8}],7:[function(require,module,exports){
class Snake {
  constructor(size) {
    this.xspeed = size;
    this.yspeed = 0;
    this.head = { x: p.offsetX, y: p.offsetY };
    this.tail = [];
    this.size = size;
    this.total = 1;
    this.tailsToAdd = 0;
    this.directionsToChange = [];
  }

  eat(food) {
    let distanceToFood = p.dist(this.head.x, this.head.y, food.x, food.y);
    if (distanceToFood < 1) {
      this.increaseTailSize();
      return true;
    } else {
      return false;
    }
  }

  addDirectionChange(x, y) {
    var predicate = (this.directionsToChange.length > 0 ? this.directionsToChange[this.directionsToChange.length - 1] : { x: this.xspeed, y: this.yspeed });
    if (x != predicate.x * -1 || y != predicate.y * -1) {
      this.directionsToChange.unshift({ x, y });
    }
  }

  changeDirection() {
    let direction = this.directionsToChange.pop();
    this.xspeed = direction.x;
    this.yspeed = direction.y;
  }

  collides(x, y, ignoreHead = false) {
    let collides = false;

    // Check head collision 
    if (!ignoreHead) {
      const distanceToDeath = p.dist(x, y, this.head.x, this.head.y);
      if (distanceToDeath < 1) {
        collides = true;
      }
    }

    if (!collides) {
      // Check tail collision 
      for (let i = 0; i < this.tail.length - 1; i++) {
        let tail = this.tail[i];
        const distanceToDeath = p.dist(x, y, tail.x, tail.y);
        if (distanceToDeath < 1) {
          collides = true;
          break;
        }
      }
    }

    return collides;
  }

  dieOnCollision() {
    let collides = false;
    // Check boundaries collision    
    if ((this.head.x < p.offsetX || this.head.x >= p.width + p.offsetX) ||
      (this.head.y < p.offsetY || this.head.y >= p.height + p.offsetY)) {
      collides = true;
    }

    // If the snake head collides with his body (ignoring head) or boundaries reset snake position, size, and direction
    if (!collides) {
      collides = this.collides(this.head.x, this.head.y, true);
    }

    if (collides) {
      this.total = 1;
      this.tail = [];
      this.head = { x: p.offsetX, y: p.offsetY };
      this.xspeed = this.size;
      this.yspeed = 0;
      console.log('it\'s dead');
    }

    return collides;
  }

  addTail() {
    this.tailsToAdd++;
  }

  increaseTailSize() {
    let newTail = { x: this.head.x, y: this.head.y };
    this.total++;
    this.tail.unshift(newTail);
    this.tailsToAdd--;
  }

  update() {
    if (this.tailsToAdd > 0) this.increaseTailSize();
    if (this.directionsToChange.length > 0) this.changeDirection();
    this.move();
  }

  move() {
    let headBefore = { x: this.head.x, y: this.head.y };

    // Move snake head by the current direction
    this.head.x = this.head.x + this.xspeed;
    this.head.y = this.head.y + this.yspeed;

    // Move every tail piece to the next tail position and set the last to the previous head position
    if (this.tail.length > 0) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
      this.tail[this.tail.length - 1] = headBefore;
    }
  }

  render() {
    const from = p.color('#B701C4');
    const to = p.color('#472D49');

    // Draw head
    p.noStroke();
    p.fill(from);
    p.rect(this.head.x, this.head.y, this.size, this.size);

    // Draw tail
    for (let i = 0; i < this.tail.length; i++) {
      p.fill(p.lerpColor(to, from, (1 * i) / this.tail.length));
      p.rect(this.tail[i].x, this.tail[i].y, this.size, this.size);
    }
  }
}

module.exports = Snake;
},{}],8:[function(require,module,exports){
class State {
    constructor() {
        this.name = 'none';
    }

    update() {}
    render() {}
    onEnter() {}
    onExit() {}
    onPause() {}
    onResume() {}
}

module.exports = State;
},{}],9:[function(require,module,exports){
const State = require('./state.js');

class StateStack {
    constructor() {
        this.states = [];
        this.states.push(new State('none'));
    }
        
    update() {
        let state = this.states[this.states.length - 1];
        if (state){
            state.update();
        }
    }

    render() {
        let state = this.states[this.states.length - 1];
        if (state){
            state.render();
        }
    }

    push(state) {
        this.states.push(state);
        state.onEnter();
    }

    pop() {
        let state = this.states[this.states.length - 1];
        state.onExit();
        return this.states.pop();
    }

    pause() {
        let state = this.states[this.states.length - 1];
        if (state.onPause){
            state.onPause();
        }
    }

    resume() {
        let state = this.states[this.states.length - 1];
        if (state.onResume){
            state.onResume();
        }
    };
};

module.exports = StateStack;
},{"./state.js":8}]},{},[3]);
