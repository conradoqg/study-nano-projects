class Snake {
  constructor(size) {
    this.x = 0;
    this.y = 0;
    this.xspeed = size;
    this.yspeed = 0;
    this.size = size;
    this.total = 0;
    this.tail = [];
    this.directionChanged = true;
  }

  eat(food) {
    let distanceToFood = p.dist(this.x, this.y, food.x, food.y);
    debug('distanceToFood', distanceToFood);
    if (distanceToFood < 1) {
      this.total++;
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
    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];
      const distanceToDeath = p.dist(this.x, this.y, pos.x, pos.y);
      distancesToDeath.push(distanceToDeath);
      if (distanceToDeath < 1) {
        this.total = 0;
        this.tail = [];
      }
    }
    debug('distancesToDeath', distancesToDeath);
  }

  move() {
    if (this.total === this.tail.length) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = { x: this.x, y: this.y };

    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
    this.directionChanged = true;

    this.x = p.constrain(this.x, 0, p.width - this.size);
    this.y = p.constrain(this.y, 0, p.height - this.size);
  }

  draw() {
    const from = p.color('#B701C4');
    const to = p.color('#472D49');
    p.fill(from);
    p.rect(this.x, this.y, this.size, this.size);
    for (let i = 0; i < this.tail.length; i++) {
      p.fill(p.lerpColor(to, from, (1 * i) / this.tail.length))
      p.rect(this.tail[i].x, this.tail[i].y, this.size, this.size);
    }
  }
}

module.exports = Snake;