function Food(size) {
    this.x = 0
    this.y = 0;
    this.size = size;

    this.setRandomLocation = function () {
        var cols = p.floor(p.width / size);
        var rows = p.floor(p.height / size);
        this.x = p.floor(p.random(cols)) * size;
        this.y = p.floor(p.random(rows)) * size;
    }

    this.draw = function () {
        p.fill(255, 0, 100);
        p.rect(this.x, this.y, size, size);
    }

    this.setRandomLocation();
}

module.exports = Food;