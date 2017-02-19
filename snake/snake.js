function Snake(movimentSpeed, size) {
  this.x = 0;
  this.y = 0;
  this.xspeed = movimentSpeed;
  this.yspeed = 0;
  this.size = size;
  this.total = 0;
  this.tail = [];
  this.directionChanged = true;

  this.eat = function (food) {
    var d = p.dist(this.x, this.y, food.x, food.y);    
    debug('distanceToEat', d);    
    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  this.changeDirection = function (x, y) {
    if (this.directionChanged) {
      this.xspeed = x;
      this.yspeed = y;      
      this.directionChanged = false;
    }    
  }

  this.dieOnColision = function () {
    var distanceToDeath = [];
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = p.dist(this.x, this.y, pos.x, pos.y);            
      distanceToDeath.push(d);      
      if (d < 1) {        
        this.total = 0;
        this.tail = [];
      }
    }    
    debug('distanceToDeath', distanceToDeath);
  }

  this.move = function () {
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = { x: this.x, y: this.y };

    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
    this.directionChanged = true;

    this.x = p.constrain(this.x, 0, p.width - size);
    this.y = p.constrain(this.y, 0, p.height - size);
  }

  this.draw = function () {    
    p.fill(255);
    for (var i = 0; i < this.tail.length; i++) {
      p.rect(this.tail[i].x, this.tail[i].y, size, size);
    }        
    p.rect(this.x, this.y, size, size);

  }
}

module.exports = Snake;