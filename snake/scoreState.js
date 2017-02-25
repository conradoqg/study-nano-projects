const State = require('./state.js');

class ScoreState extends State {
    constructor(game, score) {
        super();
        this.game = game;
        this.score = score;
    }

    onEnter() {
        this.previousMousePressed = p5.mousePressed;
        this.previousKeyPressed = p5.keyPressed;

        p5.mousePressed = () => {
            this.return();
        };

        p5.keyPressed = () => {
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
        p5.mousePressed = this.previousMousePressed;
        p5.keyPressed = this.previousKeyPressed;
    }

    update() {

    }

    render() {
        p5.push();

        // Background
        p5.background(p5.colorFromSelector('.color-background'));

        // Texts
        p5.textSize(60);
        p5.fill(p5.colorFromSelector('.color-text'));
        p5.textAlign(p5.CENTER, p5.BOTTOM);
        p5.text('Score: ' + this.score, 0, 0, p5.width, p5.height / 2);

        p5.textSize(20);
        p5.fill(p5.colorFromSelector('.color-sub-text'));
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.textStyle(p5.ITALIC);
        p5.text('Press any key to return to menu...', 0, p5.height / 2, p5.width, p5.height / 2);

        if (store.enabled) {
            p5.textSize(14);
            p5.fill(p5.colorFromSelector('.color-text'));
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.textStyle(p5.BOLD);
            let hightscoresText = '';
            this.hightscores.forEach(function (hightscore, index) {
                if (hightscore != null) hightscoresText += hightscore.name + ': ' + hightscore.score + ((this.hightscores.length - 1) == index ? '' : '\n');
            }, this);
            p5.text(hightscoresText, 0, (p5.height / 4), p5.width, p5.height);
        }

        p5.pop();
    }

}

module.exports = ScoreState;