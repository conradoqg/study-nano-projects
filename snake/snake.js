class Snake {
  constructor(size) {
    this.xspeed = size;
    this.yspeed = 0;
    this.head = { x: 0, y: 0 };
    this.tail = [];
    this.size = size;
    this.total = 0;
    this.tailsToAdd = 0;

    this.directionChanged = true;
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

  changeDirection(x, y) {     
    if (x != this.xspeed * -1 && y != this.yspeed * -1) {
      if (this.directionChanged) {
        this.xspeed = x;
        this.yspeed = y;
        this.directionChanged = false;
      }
    }
  }

  dieOnColision() {
    let distancesToDeath = [];
    for (let i = 0; i < this.tail.length - 1; i++) {
      let tail = this.tail[i];
      const distanceToDeath = p.dist(this.head.x, this.head.y, tail.x, tail.y);
      distancesToDeath.push(distanceToDeath);
      if (distanceToDeath < 1) {
        console.log('dead');
        this.total = 0;
        this.tail = [];
      }
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
    this.move();
  }

  move() {
    let headBefore = { x: this.head.x, y: this.head.y };

    this.head.x = this.head.x + this.xspeed;
    this.head.y = this.head.y + this.yspeed;
    this.directionChanged = true;

    this.head.x = p.constrain(this.head.x, 0, p.width - this.size);
    this.head.y = p.constrain(this.head.y, 0, p.height - this.size);

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
    p.fill(from);
    p.rect(this.head.x, this.head.y, this.size, this.size);
    for (let i = 0; i < this.tail.length; i++) {
      p.fill(p.lerpColor(to, from, (1 * i) / this.tail.length))
      p.rect(this.tail[i].x, this.tail[i].y, this.size, this.size);
    }
  }
}

module.exports = Snake;