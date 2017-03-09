const Rocket = require('./rocket.js');

function Population(target, obstacle) {
    this.rockets = [];
    this.popsize = 25;
    this.matingpool = [];
    this.target = target;
    this.obstacle = obstacle;

    for (var i = 0; i < this.popsize; i++) {
        this.rockets[i] = new Rocket(this.target, this.obstacle);
    }

    this.evaluate = function () {

        var maxfit = 0;
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].calcFitness();
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
    };

    this.selection = function () {
        var newRockets = [];
        for (var i = 0; i < this.rockets.length; i++) {
            var parentA = p5i.random(this.matingpool).dna;
            var parentB = p5i.random(this.matingpool).dna;
            var child = parentA.crossover(parentB);
            child.mutation();
            newRockets[i] = new Rocket(this.target, this.obstacle, child);
        }
        this.rockets = newRockets;
    };

    this.run = function (count) {
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].update(count);
            this.rockets[i].show();
        }
    };
}

module.exports = Population;