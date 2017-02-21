const State = require('./state.js');

class StateStack {
    constructor() {
        this.states = [];
        this.states.push(new State('none'));
    }
        
    update() {
        let state = this.states[this.states.length - 1];
        if (state){
            state.update();
        }
    }

    render() {
        let state = this.states[this.states.length - 1];
        if (state){
            state.render();
        }
    }

    push(state) {
        this.states.push(state);
        state.onEnter();
    }

    pop() {
        let state = this.states[this.states.length - 1];
        state.onExit();
        return this.states.pop();
    }

    pause() {
        let state = this.states[this.states.length - 1];
        if (state.onPause){
            state.onPause();
        }
    }

    resume() {
        let state = this.states[this.states.length - 1];
        if (state.onResume){
            state.onResume();
        }
    };
};

module.exports = StateStack;