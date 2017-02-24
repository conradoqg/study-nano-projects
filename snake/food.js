class Food {
    constructor(xOffset, yOffset, size) {
        this.x = xOffset;
        this.y = yOffset;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.size = size;
        this.setRandomLocation();
    }

    setRandomLocation() {
        let cols = Math.floor((p5.width - this.xOffset) / this.size);
        let rows = Math.floor((p5.height - this.yOffset) / this.size);
        this.x = (Math.floor(p5.random(cols)) * this.size) + this.xOffset;
        this.y = (Math.floor(p5.random(rows)) * this.size) + this.yOffset;
    }

    render() {
        p5.push();                     
        p5.noStroke();
        p5.fill(p5.colorFromSelector('.color-food'));
        p5.ellipse(this.x + (this.size / 2), this.y + (this.size / 2), this.size / 1.5, this.size / 1.5);
        p5.pop();
    }
}

module.exports = Food;