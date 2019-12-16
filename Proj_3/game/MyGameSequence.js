class MyGameSequence {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;

        this.moves = [];
    }
    push(move) {
        this.moves.push(move);
    }
    undo() {
        return this.moves.pop();
    }
}