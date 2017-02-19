/**
 * Mini snake game.
 * 
 * based on work of Daniel Shiffman: http://codingtra.in
 */
var Snake = require('./snake.js');
var Food = require('./food.js');

var sketch = function (p) {
  window.p = p;

  var snake = null;
  var food = null;
  var size = 20;
  var timer = 0;

  p.setup = function () {
    p.createCanvas(600, 600);
    p.frameRate(60);
    snake = new Snake(size);
    food = new Food(size);
  };

  p.draw = function () {
    p.background('#474749');

    var currMillis = p.millis();
    if (timer < currMillis - 300 || timer == 0) {
      if (snake.eat(food)) {
        food = new Food(size);
      }
      timer = currMillis;
      snake.move();
    }
    snake.dieOnColision();
    snake.draw();
    food.draw();

    debug('timer', timer);
    debug('snake', snake);
    debug('food', food)
  };

  p.mousePressed = function () {
    snake.total++;
  }

  p.keyPressed = function () {
    if (p.keyCode === p.UP_ARROW) {
      snake.changeDirection(0, -size);
    } else if (p.keyCode === p.DOWN_ARROW) {
      snake.changeDirection(0, size);
    } else if (p.keyCode === p.RIGHT_ARROW) {
      snake.changeDirection(size, 0);
    } else if (p.keyCode === p.LEFT_ARROW) {
      snake.changeDirection(-size, 0);
    }
  }
};

var myp5 = new p5(sketch, 'canvas');

var variablesToDebug = {};
var cache = [];
function debug(varName, variable) {
  if (varName != null) {
    variablesToDebug[varName] = variable;
  }
  var codeNode = document.getElementById('debug');
  var cache = [];
  codeNode.innerText = JSON.stringify(variablesToDebug, function (key, value) {
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