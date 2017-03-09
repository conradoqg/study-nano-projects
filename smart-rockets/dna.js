function DNA(cromosomesAmount) {
    this.genes = [];
    this.maxforce = 0.2;
    for (var i = 0; i < cromosomesAmount; i++) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(this.maxforce);
    }

    this.crossover = function (partner) {
        var newgenes = [];
        var mid = p5i.floor(p5i.random(this.genes.length));
        for (var i = 0; i < this.genes.length; i++) {
            if (i > mid) {
                newgenes[i] = this.genes[i];
            } else {
                newgenes[i] = partner.genes[i];
            }
        }
        const newDNA = new DNA(cromosomesAmount);
        newDNA.genes = newgenes;
        return newDNA;
    };

    this.mutation = function () {
        for (var i = 0; i < this.genes.length; i++) {
            if (p5i.random(1) < 0.01) {
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(this.maxforce);
            }
        }
    };

}

module.exports = DNA;