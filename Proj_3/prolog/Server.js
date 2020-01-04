class Server {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }
    getPrologRequest(requestString, callback, requestCode) {
        var requestPort = 8082;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = (data) => callback(this.orchestrator, data, requestCode);
        request.onerror = function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    /**
     * Handles the reply from the server by calling @class MyGameOrchestrator @method handleReply.
     * 
     * @param {MyGameOrchestrator object} orchestrator
     * @param {data with the reply} data 
     * @param {request code identifiyng the kind of reply} code
     */
    handleReply(orchestrator, data, code) {
        let reply = data.target.response;
        
        orchestrator.handlePrologReply(code, reply);
    }

    /**
     * Plays a piece on the server side
     * 
     * @param {Current board state} board 
     * @param {Current player} player 
     * @param {X coordinate} x 
     * @param {Y coordinate} y
     * 
     * @returns An array in the format: [NewBoard, Cut] 
     */
    play(board, player, x, y) {
        this.reply = null;
        this.getPrologRequest(`play(${board},${player},${x},${y})`, this.handleReply, 1);
    }

    /**
     * Updates the turns state.
     * If cut is true, then the next player will have 2 plays on the next turn.
     * Otherwise, it will only have 1.
     * 
     * @param {Boolean indicating if there was a cut on diagonal link} cut 
     * @param {Current turn state} turns 
     * 
     * @returns An array in the format: [Player1 Plays, Player2 Plays]
     */
    updateTurns(cut, turns) {
        this.reply = null;
        this.getPrologRequest(`update_turns(${turns},${cut})`, this.handleReply, 3);
    }

    /**
     * Checks if the game has ended.
     * 
     * @param {Current board state} board 
     * @param {Current player} player 
     * 
     * @returns true if the game has ended, false otherwise.
     */
    checkGameEnd(board, player){
        this.reply = null;
        this.requestCode = 2;
        this.getPrologRequest(`game_end(${board},${player})`, this.handleReply, 2);
    }

    /**
     * Determines the current player.
     * 
     * @param {current turn state} turns
     * 
     * @returns A value, either 1 or 2, representing the current player.
     */
    get_player(turns) {
        this.reply = null;
        this.getPrologRequest(`get_player(${turns})`, this.handleReply, 5);
    }

    /**
     * Gets the coordinates for the next play executed by the computer.
     * 
     * @param {difficulty level of the AI} depth 
     * @param {current turn state} turns 
     * @param {current board state} board
     * 
     * @returns a pair of coordinates in the form [X, Y]. 
     */
    getAIinput(depth, turns, board) {
        this.reply = null;
        this.getPrologRequest(`getAIinput(${depth},${turns},${board})`, this.handleReply, 4);
    }
}