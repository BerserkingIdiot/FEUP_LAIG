class MyGameState {
    constructor(board, turns) {
        this.board = board;
        this.turns = turns;
    }
    boardToString() {
        return JSON.stringify(this.board);
    }
    turnsToString() {
        return JSON.stringify(this.turns);
    }
    getBoard() {
        return JSON.parse(this.board);
    }
    getTurns() {
        return JSON.parse(this.turns);
    }
}