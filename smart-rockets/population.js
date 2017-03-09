const Rocket = require('./rocket.js');

class Population {
    constructor(target, obstacle) {
        this.rockets = [];
        this.popsize = 100;
        this.matingpool = [];
        this.target = target;
        this.obstacle = obstacle;

        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i] = new Rocket();
        }
    }

    evaluate() {
        var maxfit = 0;
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].calcFitness(this.target);
            if (this.rockets[i].fitness > maxfit) {
                maxfit = this.rockets[i].fitness;
            }
        }

        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].fitness /= maxfit;
        }

        this.matingpool = [];
        for (var i = 0; i < this.popsize; i++) {
            var n = this.rockets[i].fitness * 100;
            for (var j = 0; j < n; j++) {
                this.matingpool.push(this.rockets[i]);
            }
        }
    }

    selection() {
        var newRockets = [];
        for (var i = 0; i < this.rockets.length; i++) {
            const parentA = p5i.random(this.matingpool);
            const parentB = p5i.random(this.matingpool);
            const child = parentA.mate(parentB);
            newRockets[i] = child;
        }
        this.rockets = newRockets;
    }

    update(count) {
        for (var i = 0; i < this.popsize; i++) {
            let rocket = this.rockets[i];

            // Check collisions            

            // Target
            if (rocket.collidesCircle(this.target)) {
                rocket.completed = true;                
            }

            // Off-screen
            if (!rocket.collidesRect({ x: 0, y: 0, width: p5i.width, height: p5i.height})) {
                rocket.crashed = true;
            }

            // Obstacle
            if (rocket.collidesRect(this.obstacle)) {
                rocket.crashed = true;
            }

            rocket.update(count);
        }
    }

    render() {
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].render();
        }
    }
}

module.exports = Population;