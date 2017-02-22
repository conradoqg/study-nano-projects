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