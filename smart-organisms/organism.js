const DNA = require('./dna.js');
const PluginManager = require('./pluginManager.js');

class Organism {
    constructor(dnaOrGeneAmount, bornAt) {
        bornAt = (bornAt == null ? p5i.createVector(p5i.width / 2, p5i.height - 10) : bornAt);

        this.object = {};
        this.object.type = 'rect';
        this.object.size = { width: 25, height: 5 };
        this.object.pos = bornAt.sub(this.object.size.width / 2, this.object.size.height / 2);
        this.object.mode = p5i.CENTER;
        this.object.moviment = {};
        this.object.moviment.vel = p5i.createVector();
        this.object.moviment.acc = p5i.createVector();
        this.object.moviment.heading = this.object.moviment.vel.heading();
        this.object.coors = p5i.getCoorsFromRect(this.object.pos.x, this.object.pos.y, this.object.size.width, this.object.size.height, this.object.mode);

        this.initialPos = this.object.pos.copy();
        this.completed = false;
        this.crashed = false;
        this.dna = (typeof (dnaOrGeneAmount) == 'number' ? new DNA(dnaOrGeneAmount) : dnaOrGeneAmount);
        this.fitness = 0;
        this.lifeSpan = 0;
        this.fitnessCalculatorFn = this.distance;
        this.emitter = new mitt();
        PluginManager.registerEmitter('organism', this.emitter);
    }

    distance(organism, target) {
        let invertedDistance = Math.abs(p5i.width - organism.distanceTo(target));

        if (organism.completed) {
            return invertedDistance *= 10;
        }
        if (organism.crashed) {
            return invertedDistance /= 10;
        }
    }

    calcFitness(target) {
        this.emitter.emit('beforeCalcFitness', this);
        this.fitness = this.fitnessCalculatorFn(this, target);
    }

    mate(partner) {
        const childDNA = this.dna.crossover(partner.dna);
        return new Organism(childDNA);
    }

    update(lifeSpanTimer) {
        if (!this.completed && !this.crashed) {
            this.lifeSpan = lifeSpanTimer;

            this.object.moviment.acc.add(this.dna.genes[lifeSpanTimer]);
            this.object.moviment.vel.add(this.object.moviment.acc);
            this.object.pos.add(this.object.moviment.vel);
            this.object.moviment.acc.mult(0);
            this.object.moviment.vel.limit(4);
            this.object.moviment.heading = this.object.moviment.vel.heading();
            this.object.coors = p5i.getCoorsFromRect(this.object.pos.x, this.object.pos.y, this.object.size.width, this.object.size.height, this.object.mode, this.object.moviment.heading);
        }
    }

    collidesCircle(target) {
        return p5i.collideCirclePoly(target.x, target.y, target.diameter, this.object.coors);
    }

    collidesRect(target, inside = false) {
        let targetCoors = p5i.getCoorsFromRect(target.x, target.y, target.width, target.height, p5i.CORNER);
        return p5i.collidePolyPoly(targetCoors, this.object.coors, inside);
    }

    distanceTo(target) {
        return p5i.dist(this.object.pos.x, this.object.pos.y, target.x, target.y);
    }

    render() {
        p5i.push();
        p5i.noStroke();
        p5i.fill(255, 150);
        p5i.quad(this.object.coors[0].x, this.object.coors[0].y, this.object.coors[1].x, this.object.coors[1].y, this.object.coors[2].x, this.object.coors[2].y, this.object.coors[3].x, this.object.coors[3].y);
        p5i.pop();
    }
}

module.exports = Organism;