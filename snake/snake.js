class Snake {
  constructor(size) {
    this.xspeed = size;
    this.yspeed = 0;
    this.head = { x: 0, y: 0 };
    this.tail = [];
    this.size = size;
    this.total = 0;
    this.tailsToAdd = 0;
    this.directionsToChange = [];
  }

  eat(food) {
    let distanceToFood = p.dist(this.head.x, this.head.y, food.x, food.y);
    debug('distanceToFood', distanceToFood);
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

  dieOnCollision() {
    let distancesToDeath = [];
    let itsDeath = false;

    // Check boundaries collision    
    if ((this.head.x < 0 || this.head.x >= p.width) ||
      (this.head.y < 0 || this.head.y >= p.height)) {
      itsDeath = true;
    }

    // Check tail collision 
    for (let i = 0; i < this.tail.length - 1; i++) {
      let tail = this.tail[i];
      const distanceToDeath = p.dist(this.head.x, this.head.y, tail.x, tail.y);
      distancesToDeath.push(distanceToDeath);
      if (distanceToDeath < 1) {
        itsDeath = true;
        break;
      }
    }    

    // If it's death reset snake position, size, and direction
    if (itsDeath) {
      this.total = 0;
      this.tail = [];      
      this.head = { x: 0, y: 0 };
      this.xspeed = this.size;
      this.yspeed = 0;
      console.log('it\'s dead');
    }

    debug('distancesToDeath', distancesToDeath);
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
      this.tail[this.total - 1] = headBefore;
    }
  }

  draw() {
    const from = p.color('#B701C4');
    const to = p.color('#472D49');

    // Draw head
    p.fill(from);
    p.rect(this.head.x, this.head.y, this.size, this.size);

    // Draw tail
    for (let i = 0; i < this.tail.length; i++) {
      p.fill(p.lerpColor(to, from, (1 * i) / this.tail.length))
      p.rect(this.tail[i].x, this.tail[i].y, this.size, this.size);
    }
  }
}

module.exports = Snake;