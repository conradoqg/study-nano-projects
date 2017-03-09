const State = require('./state.js');

class ScoreState extends State {
    constructor(game, score) {
        super();
        this.game = game;
        this.score = score;
    }

    onEnter() {
        this.previousMousePressed = p5i.mousePressed;
        this.previousKeyPressed = p5i.keyPressed;

        p5i.mousePressed = () => {
            this.return();
        };

        p5i.keyPressed = () => {
            this.return();
        };

        if (store.enabled) {
            this.hightscores = store.get('hightscores') || new Array(5).fill(null);
            const scoreData = { name: 'test', score: this.score };

            for (var index = 0; index < this.hightscores.length; index++) {
                var hightscore = this.hightscores[index];

                if (this.score != 0 && (hightscore == null || this.score >= hightscore.score)) {
                    scoreData.name = window.prompt('Hightscore! Please enter your name:');
                    if (scoreData.name != null) {
                        this.hightscores.splice(index, 0, scoreData);
                        this.hightscores.pop();
                    }
                    break;
                }
            }
            store.set('hightscores', this.hightscores);
        }
    }

    return() {
        this.game.stateManager.pop();
    }

    onExit() {
        p5i.mousePressed = this.previousMousePressed;
        p5i.keyPressed = this.previousKeyPressed;
    }

    update() {

    }

    render() {
        p5i.push();

        // Background
        p5i.background(p5i.colorFromSelector('.color-background'));

        // Texts
        p5i.textSize(60);
        p5i.fill(p5i.colorFromSelector('.color-text'));
        p5i.textAlign(p5i.CENTER, p5i.BOTTOM);
        p5i.text('Score: ' + this.score, 0, 0, p5i.width, p5i.height / 2);

        p5i.textSize(20);
        p5i.fill(p5i.colorFromSelector('.color-sub-text'));
        p5i.textAlign(p5i.CENTER, p5i.TOP);
        p5i.textStyle(p5i.ITALIC);
        p5i.text('Press any key to return to menu...', 0, p5i.height / 2, p5i.width, p5i.height / 2);

        if (store.enabled) {
            p5i.textSize(14);
            p5i.fill(p5i.colorFromSelector('.color-text'));
            p5i.textAlign(p5i.CENTER, p5i.CENTER);
            p5i.textStyle(p5i.BOLD);
            let hightscoresText = '';
            this.hightscores.forEach(function (hightscore, index) {
                if (hightscore != null) hightscoresText += hightscore.name + ': ' + hightscore.score + ((this.hightscores.length - 1) == index ? '' : '\n');
            }, this);
            p5i.text(hightscoresText, 0, (p5i.height / 4), p5i.width, p5i.height);
        }

        p5i.pop();
    }

}

module.exports = ScoreState;