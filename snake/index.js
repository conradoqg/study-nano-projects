/**
 * Mini snake game.
 * 
 * based on work of Daniel Shiffman: http://codingtra.in
 * 
 * color pallete: http://paletton.com/#uid=65w0C0kjXkL4t7gc6dZs6s9IvFK
 */
const Snake = require('./snake.js');
const Food = require('./food.js');

let sketch = (p) => {
  window.p = p;
  const SIZE = 20;

  let snake = null;
  let food = null;

  p.setup = () => {
    p.createCanvas(600, 600);
    p.frameRate(30);
    snake = new Snake(SIZE);
    food = new Food(SIZE);
  };

  p.draw = () => {
    p.background('#474749');

    tick(() => {
      if (snake.eat(food)) {
        do {
          food = new Food(SIZE);
        } while (snake.collides(food.x, food.y))
      }
      snake.update();
      snake.dieOnCollision();
    }, 300)
    food.draw();
    snake.draw();
  };

  p.mousePressed = () => {
    snake.addTail();
  }

  p.keyPressed = () => {
    if (p.keyCode === p.UP_ARROW) {
      snake.addDirectionChange(0, -SIZE);
    } else if (p.keyCode === p.DOWN_ARROW) {
      snake.addDirectionChange(0, SIZE);
    } else if (p.keyCode === p.RIGHT_ARROW) {
      snake.addDirectionChange(SIZE, 0);
    } else if (p.keyCode === p.LEFT_ARROW) {
      snake.addDirectionChange(-SIZE, 0);
    }
  }
};

p5.disableFriendlyErrors = true;
let myp5 = new p5(sketch, 'canvas');

let timer = 0;
function tick(fn, interval) {
  const currMillis = p.millis();
  if (timer < currMillis - interval || timer == 0) {
    fn();
    timer = currMillis;
  }
}