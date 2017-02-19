/**
 * Mini snake game.
 * 
 * based on work of Daniel Shiffman: http://codingtra.in
 */
const Snake = require('./snake.js');
const Food = require('./food.js');

let sketch = (p) => {
  window.p = p;
  const SIZE = 20;  

  let snake = null;
  let food = null;  
  let timer = 0;

  p.setup = () => {
    p.createCanvas(600, 600);
    p.frameRate(60);
    snake = new Snake(SIZE);
    food = new Food(SIZE);
  };

  p.draw = () => {
    p.background('#474749');

    const currMillis = p.millis();
    if (timer < currMillis - 300 || timer == 0) {
      if (snake.eat(food)) {
        food = new Food(SIZE);
      }
      timer = currMillis;
      snake.move();
    }
    snake.dieOnColision();
    food.draw();
    snake.draw();
    

    debug('timer', timer);
    debug('snake', snake);
    debug('food', food)
  };

  p.mousePressed = () => {
    snake.total++;
  }

  p.keyPressed = () => {
    if (p.keyCode === p.UP_ARROW) {
      snake.changeDirection(0, -SIZE);
    } else if (p.keyCode === p.DOWN_ARROW) {
      snake.changeDirection(0, SIZE);
    } else if (p.keyCode === p.RIGHT_ARROW) {
      snake.changeDirection(SIZE, 0);
    } else if (p.keyCode === p.LEFT_ARROW) {
      snake.changeDirection(-SIZE, 0);
    }
  }
};

let myp5 = new p5(sketch, 'canvas');

let variablesToDebug = {};
let cache = [];
function debug(varName, variable) {
  if (varName != null) {
    variablesToDebug[varName] = variable;
  }
  const codeNode = document.getElementById('debug');
  let cache = [];
  codeNode.innerText = JSON.stringify(variablesToDebug, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return;
      }
      cache.push(value);
    }
    return value;
  }, '\t');
  cache = null;
  hljs.highlightBlock(codeNode);
}

window.debug = debug;