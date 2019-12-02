class Server {
    constructor() {
        this.reply;
    }
    getPrologRequest(requestString, callback) {
        var requestPort = 8082;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = callback;
        request.onerror = function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
    makeRequest(requestString) {
        // Make Request
        getPrologRequest(requestString, handleReply);
    }
    //Handle the Reply
    handleReply(data) {
        this.reply = data.target.response;
    }

    /**
     * Plays a piece on the server side
     * 
     * @param {Input board state} board 
     * @param {Current player} player 
     * @param {X coordinate} x 
     * @param {Y coordinate} y
     * 
     * @returns An array in the format: [NewBoard, Cut] 
     */
    play(board, player, x, y) {
        this.getPrologRequest(`play(${board}, ${player}, ${x}, ${y})`, this.handleReply);

        //Wait for server to reply
        
        return JSON.parse(this.reply);
    }

    /**
     * Updates the turns state.
     * If cut is true, then the next player will have 2 plays on the next turn.
     * Otherwise, it will only have 1.
     * 
     * @param {Boolean indicating if there was a cut on diagonal link} cut 
     * @param {Current turn state} turns 
     */
    updateTurns(cut, turns) {
        this.getPrologRequest(`update_turns(${turns}, ${cut})`);

        return JSON.parse(this.reply)
    }
}