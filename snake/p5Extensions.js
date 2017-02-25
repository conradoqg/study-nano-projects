const p5Extensions = function () {
    let timer = 0;
    function tick(fn, interval) {
        const currMillis = this.millis();
        if (timer < currMillis - interval || timer == 0) {
            fn();
            timer = currMillis;
        }
    }

    let colorCache = [];
    function colorFromSelector(selector) {
        if (colorCache[selector] != null) return colorCache[selector];
        let rules = document.styleSheets[0].cssRules;
        for (let i in rules) {
            if (rules[i].selectorText == selector) {
                let color = rules[i].style.color;
                colorCache[selector] = color;
                return color; // Get color property specifically
            }
        }
        return '#FFFFFF';
    }

    p5.prototype.tick = tick;
    p5.prototype.colorFromSelector = colorFromSelector;
    p5.prototype.SPACEBAR = 32;
};

module.exports = p5Extensions;