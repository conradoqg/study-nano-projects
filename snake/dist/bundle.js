(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Food {
    constructor(xOffset, yOffset, size) {
        this.x = xOffset;
        this.y = yOffset;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.size = size;
        this.setRandomLocation();
    }

    setRandomLocation() {
        let cols = Math.floor((p5.width - this.xOffset) / this.size);
        let rows = Math.floor((p5.height - this.yOffset) / this.size);
        this.x = (Math.floor(p5.random(cols)) * this.size) + this.xOffset;
        this.y = (Math.floor(p5.random(rows)) * this.size) + this.yOffset;
    }

    render() {
        p5.push();                     
        p5.stroke(p5.colorFromSelector('.color-primary-1'))
        p5.fill(p5.colorFromSelector('.color-primary-2'));
        p5.ellipse(this.x + (this.size / 2), this.y + (this.size / 2), this.size / 1.5, this.size / 1.5);
        p5.pop();
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
        p5.createCanvas(this.config.width, this.config.height + this.config.cellSize);        
        p5.frameRate(this.config.FPS);
        p5.draw = this.draw.bind(this);
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
            p5instance.setup = self.setup.bind(self);            
            window.p5 = p5instance;            
        }, this.config.canvasElementID);
    }

    init() {
        this.setupP5();
    }
}



module.exports = Game;
},{"./menuState.js":4,"./stateStack.js":10}],3:[function(require,module,exports){
/**
 * Mini snake game.
 * 
 * based on the work of Daniel Shiffman: http://codingtra.in
 *  
 */
const Game = require('./game.js');
const p5Extensions = require('./p5Extensions.js');
p5Extensions();
let game = new Game('canvas');
game.init();
},{"./game.js":2,"./p5Extensions.js":5}],4:[function(require,module,exports){
const State = require('./state.js');
const PlayState = require('./playState.js');

class MenuState extends State {
    constructor(game) {
        super();
        this.name = 'menustate';
        this.game = game;
    }

    onEnter() {
        p5.mousePressed = () => {
            this.play();
        }

        p5.keyPressed = () => {
            this.play();            
        }
    }

    onExit() {
        p5.mousePressed = null;
        p5.keyPressed = null;
    }

    update() {}

    play() {
        this.game.stateManager.push(new PlayState(this.game));
    }

    render() {
        p5.push();

        // Background
        p5.background(p5.colorFromSelector('.color-primary-4'));

        // Texts
        p5.textSize(60);
        p5.fill(p5.colorFromSelector('.color-complement-2'));
        p5.textAlign(p5.CENTER,p5.BOTTOM);
        p5.text('Snake Game', 0, 0, p5.width, p5.height / 2);

        p5.textSize(20);
        p5.fill(p5.colorFromSelector('.color-complement-3'));
        p5.textAlign(p5.CENTER,p5.TOP);
        p5.textStyle(p5.ITALIC);
        p5.text('Press any key to start...', 0, p5.height / 2, p5.width, p5.height / 2 );        

        p5.pop();
    }
}

module.exports = MenuState;
},{"./playState.js":6,"./state.js":9}],5:[function(require,module,exports){
const p5Extensions = function () {
    let timer = 0;
    function tick(fn, interval) {
        const currMillis = this.millis();
        if (timer < currMillis - interval || timer == 0) {
            fn();
            timer = currMillis;
        }
    }

    let colorCache = [];
    function colorFromSelector(selector) {
        if (colorCache[selector] != null) return colorCache[selector];
        rules = document.styleSheets[0].cssRules;
        for (i in rules) {
            if (rules[i].selectorText == selector) {
                let color = rules[i].style.color;
                colorCache[selector] = color;
                return color; // Get color property specifically
            }
        }
        return "#FFFFFF";
    }

    p5.prototype.tick = tick;
    p5.prototype.colorFromSelector = colorFromSelector;
    p5.prototype.SPACEBAR = 32;
}

module.exports = p5Extensions;
},{}],6:[function(require,module,exports){
const State = require('./state.js');
const Snake = require('./snake.js');
const Food = require('./food.js');
const ScoreState = require('./scoreState.js');

class PlayState extends State {
    constructor(game) {
        super();
        this.name = 'playstate';
        this.game = game;
        this.xOffset = 0;
        this.yOffset = this.game.config.cellSize;
        this.snake = new Snake(this.xOffset, this.yOffset, this.game.config.cellSize);
        this.food = new Food(this.xOffset, this.yOffset, this.game.config.cellSize);
        this.tickSpeed = this.minTickSpeed = 50;
        this.maxTickSpeed = 300;
        this.totalCells = Math.floor(p5.width / this.game.config.cellSize) * Math.floor(p5.height / this.game.config.cellSize);
        this.paused = false;
    }

    onEnter() {
        this.previousMousePressed = p5.mousePressed;
        this.previousKeyPressed = p5.keyPressed;
        p5.mousePressed = () => {
            this.snake.addTail();
        }

        p5.keyPressed = () => {
            if (p5.keyCode === p5.SPACEBAR) {
                this.paused = !this.paused;
            }

            if (!this.paused) {
                if (p5.keyCode === p5.UP_ARROW) {
                    this.snake.addDirectionChange(0, -this.game.config.cellSize);
                } else if (p5.keyCode === p5.DOWN_ARROW) {
                    this.snake.addDirectionChange(0, this.game.config.cellSize);
                } else if (p5.keyCode === p5.RIGHT_ARROW) {
                    this.snake.addDirectionChange(this.game.config.cellSize, 0);
                } else if (p5.keyCode === p5.LEFT_ARROW) {
                    this.snake.addDirectionChange(-this.game.config.cellSize, 0);
                }
            }
        }
    }

    onExit() {
        p5.mousePressed = this.previousMousePressed;
        p5.keyPressed = this.previousKeyPressed;
    }

    update() {
        if (!this.paused) {
            // The tick speed ranges (ms between updates) from this.minTickSpeed to this.maxTickSpeed proportionally to snake size
            this.tickSpeed = this.maxTickSpeed - Math.floor((((this.maxTickSpeed - this.minTickSpeed) * this.snake.total) / this.totalCells));

            // Tick determines the moviment speed of the game and snake.
            p5.tick(() => {
                // Check if the snake has eaten the food
                if (this.snake.eat(this.food)) {
                    do {
                        this.food.setRandomLocation();
                    } while (this.snake.collides(this.food.x, this.food.y))
                }

                // Then update the snake position and size
                this.snake.update();

                // Check if snake is dead
                const score = this.snake.total;
                if (this.snake.dieOnCollision()) {
                    this.game.stateManager.pop();
                    this.game.stateManager.push(new ScoreState(this.game, score));
                }
            }, this.tickSpeed)
        }
    }

    render() {
        p5.push();

        // Background
        p5.background(p5.colorFromSelector('.color-primary-4'));

        // Top bar
        p5.fill(p5.colorFromSelector('.color-secondary-1-2'));
        p5.rect(0, 0, p5.width, this.game.config.cellSize);

        // Top bar text    
        p5.textSize(14)
        p5.fill(p5.colorFromSelector('.color-secondary-1-4'));
        p5.textAlign(p5.RIGHT, p5.CENTER);
        p5.text('Score: ' + (this.snake.total - 1), 4, 2, p5.width - 4, this.game.config.cellSize - 2);
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text('Mini snake game', 4, 2, p5.width - 4, this.game.config.cellSize - 2);

        // Render food and snake                
        this.food.render();
        this.snake.render();

        if (this.paused) {
            p5.fill(255, 255, 255, 50); // Transparent black
            p5.rect(0, 0, p5.width, p5.height);
            p5.textSize(60);
            p5.fill(p5.colorFromSelector('.color-complement-1'));
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text('Paused', 0, 0, p5.width, p5.height);
        }

        p5.pop();
    }
}

module.exports = PlayState;
},{"./food.js":1,"./scoreState.js":7,"./snake.js":8,"./state.js":9}],7:[function(require,module,exports){
const State = require('./state.js');

class ScoreState extends State {
    constructor(game, score) {
        super();
        this.game = game;
        this.score = score;
    }

    onEnter() {
        this.previousMousePressed = p5.mousePressed;
        this.previousKeyPressed = p5.keyPressed;

        p5.mousePressed = () => {
            this.return();
        }

        p5.keyPressed = () => {
            this.return();
        }
    }

    return() {
        this.game.stateManager.pop();
    }

    onExit() {
        p5.mousePressed = this.previousMousePressed;
        p5.keyPressed = this.previousKeyPressed;
    }

    render() {
        p5.push();

        // Background
        p5.background(p5.colorFromSelector('.color-primary-4'));

        // Texts
        p5.textSize(60);
        p5.fill(p5.colorFromSelector('.color-complement-2'));
        p5.textAlign(p5.CENTER, p5.BOTTOM);
        p5.text('Score: ' + (this.score - 1), 0, 0, p5.width, p5.height / 2);

        p5.textSize(20);
        p5.fill(p5.colorFromSelector('.color-complement-3'));
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.textStyle(p5.ITALIC);
        p5.text('Press any key to return to menu...', 0, p5.height / 2, p5.width, p5.height / 2);

        p5.pop();
    }

}

module.exports = ScoreState;
},{"./state.js":9}],8:[function(require,module,exports){
class Snake {
  constructor(xOffset, yOffset, size) {    
    this.xOffset = xOffset;
    this.yOffset = yOffset;        
    this.size = size;            
    this.setInitialState();
  }

  setInitialState() {
    this.total = 1; // 1 counting the head
    this.tail = [];
    this.head = { x: this.xOffset, y: this.yOffset };
    this.xSpeed = this.size;
    this.ySpeed = 0;
    this.directionsToChange = [];
    this.tailsToAdd = 0;
  }

  eat(food) {
    let distanceToFood = p5.dist(this.head.x, this.head.y, food.x, food.y);
    if (distanceToFood < 1) {
      this.increaseTailSize();
      return true;
    } else {
      return false;
    }
  }  

  collides(x, y, ignoreHead = false) {
    let collides = false;

    // Check head collision 
    if (!ignoreHead) {
      const distanceToDeath = p5.dist(x, y, this.head.x, this.head.y);
      if (distanceToDeath < 1) {
        collides = true;
      }
    }

    if (!collides) {
      // Check tail collision 
      for (let i = 0; i < this.tail.length - 1; i++) {
        let tail = this.tail[i];
        const distanceToDeath = p5.dist(x, y, tail.x, tail.y);
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

    // Check game boundaries collision    
    if ((this.head.x < this.xOffset || this.head.x >= p5.width + this.xOffset) ||
      (this.head.y < this.yOffset || this.head.y >= p5.height + this.yOffset)) {
      collides = true;
    }

    // If the snake head collides with his body (ignoring head) or the game boundaries, reset snake position, size, and direction
    if (!collides) {
      collides = this.collides(this.head.x, this.head.y, true);
    }

    if (collides) this.setInitialState();

    return collides;
  }

  addTail() {
    // Adds tail increase to buffer
    this.tailsToAdd++;
  }

  increaseTailSize() {    
    let newTail = { x: this.head.x, y: this.head.y };
    this.total++;
    this.tail.unshift(newTail);
    this.tailsToAdd--;
  }

  addDirectionChange(x, y) {
    // Adds direction change to buffer
    var predicate = (this.directionsToChange.length > 0 ? this.directionsToChange[this.directionsToChange.length - 1] : { x: this.xSpeed, y: this.ySpeed });
    if (x != predicate.x * -1 || y != predicate.y * -1) {
      this.directionsToChange.unshift({ x, y });
    }
  }

  changeDirection() {
    let direction = this.directionsToChange.pop();
    this.xSpeed = direction.x;
    this.ySpeed = direction.y;
  }

  update() {
    // Run buffered actions
    if (this.tailsToAdd > 0) this.increaseTailSize();
    if (this.directionsToChange.length > 0) this.changeDirection();
    this.move();
  }

  move() {
    let headBefore = { x: this.head.x, y: this.head.y };

    // Move snake head by the current direction
    this.head.x = this.head.x + this.xSpeed;
    this.head.y = this.head.y + this.ySpeed;

    // Move every tail piece to the next tail position and set the last to the previous head position
    if (this.tail.length > 0) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
      this.tail[this.tail.length - 1] = headBefore;
    }
  }

  render() {
    const from = p5.color(p5.colorFromSelector('.color-secondary-2-4'));
    const to = p5.color(p5.colorFromSelector('.color-secondary-2-1'));

    // Draw head
    p5.noStroke();
    p5.fill(to);
    p5.rect(this.head.x, this.head.y, this.size, this.size);

    // Draw tail
    for (let i = 0; i < this.tail.length; i++) {
      p5.fill(p5.lerpColor(from, to, (1 * i) / this.tail.length));
      p5.rect(this.tail[i].x, this.tail[i].y, this.size, this.size);
    }
  }
}

module.exports = Snake;
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{"./state.js":9}]},{},[3]);
