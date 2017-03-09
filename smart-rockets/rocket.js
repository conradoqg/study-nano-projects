const DNA = require('./dna.js');

function Rocket(target, obstacle, dna) {
    this.pos = p5i.createVector(p5i.width / 2, p5i.height);
    this.vel = p5i.createVector();
    this.acc = p5i.createVector();
    this.completed = false;
    this.crashed = false;
    this.target = target;
    this.obstacle = obstacle;

    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA(p5i.width);
    }
    this.fitness = 0;

    this.applyForce = function (force) {
        this.acc.add(force);
    };

    this.calcFitness = function () {
        var d = p5i.dist(this.pos.x, this.pos.y, this.target.x, this.target.y);

        this.fitness = p5i.map(d, 0, p5i.width, p5i.width, 0);
        if (this.completed) {
            this.fitness *= 10;
        }
        if (this.crashed) {
            this.fitness /= 10;
        }

    };

    this.update = function (count) {

        var d = p5i.dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
        if (d < 10) {
            this.completed = true;
            this.pos = p5i.createVector(this.target.x, this.target.y);
        }

        if (this.pos.x > this.obstacle.x && this.pos.x < this.obstacle.x + this.obstacle.width && this.pos.y > this.obstacle.y && this.pos.y < this.obstacle.y + this.obstacle.height) {
            this.crashed = true;
        }

        if (this.pos.x > p5i.width || this.pos.x < 0) {
            this.crashed = true;
        }
        if (this.pos.y > p5i.height || this.pos.y < 0) {
            this.crashed = true;
        }



        this.applyForce(this.dna.genes[count]);
        if (!this.completed && !this.crashed) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
            this.vel.limit(4);
        }
    };

    this.show = function () {
        p5i.push();
        p5i.noStroke();
        p5i.fill(255, 150);
        p5i.translate(this.pos.x, this.pos.y);
        p5i.rotate(this.vel.heading());
        p5i.rectMode(p5i.CENTER);
        p5i.rect(0, 0, 25, 5);
        p5i.pop();
    };

}

module.exports = Rocket;