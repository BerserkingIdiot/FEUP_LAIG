class MyGameSequence {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.currentMove = -1;
        this.moves = [];
    }
    updateCurrentMove() {
        this.currentMove = this.moves.length - 1;
    }
    getCurrentMove() {
        return this.moves[this.currentMove];
    }
    push(move) {
        this.moves.push(move);
        this.updateCurrentMove();
    }
    undo() {
        let move = this.moves.pop();
        this.updateCurrentMove();
        return move;
    }
    replay() {
        this.currentMove = 0;
    }
}