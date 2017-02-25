/**
 * Mini snake game.
 * 
 * based on the work of Daniel Shiffman: http://codingtra.in
 *  
 */
const Game = require('./game.js');
const p5Extensions = require('./p5Extensions.js');
p5Extensions();

window.getParameterByName = (name, url) => {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

let game = new Game('canvas');
game.init();