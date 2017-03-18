/**
 * Mini snake game.
 * 
 * based on the work of Daniel Shiffman: http://codingtra.in
 *  
 */
const Game = require('./game.js');
const p5Extensions = require('./p5Extensions.js');
p5Extensions();

let game = new Game('canvas');
game.init();