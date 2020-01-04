class Server {
    constructor() {
        this.reply;
    }
    getPrologRequest(requestString, callback) {
        //console.log(requestString);
        let theDamnedServer = this;
        var requestPort = 8082;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = function(data) {theDamnedServer.handleReply(data);};
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
        //console.log(this);
        //console.log(data.target.response);
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
        this.getPrologRequest(`play(${board},${player},${x},${y})`, this.handleReply);

        //TODO: Wait for server to reply
        
        //return JSON.parse(this.reply);
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
        this.getPrologRequest(`update_turns(${turns},${cut})`, this.handleReply);

        //return JSON.parse(this.reply)
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
        this.getPrologRequest(`game_end(${board},${player})`, this.handleReply);

        //return this.reply === '1';
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
        this.getPrologRequest(`get_player(${turns})`, this.handleReply);

        //return JSON.parse(this.reply);
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
        this.getPrologRequest(`getAIinput(${depth},${turns},${board})`, this.handleReply);

        //return JSON.parse(this.reply);
    }

    getReply(){
        //console.log(this.reply);
        if(this.reply != null){
            //console.log("flip");
            return JSON.parse(this.reply);
        }
        else{
            return null;
        }
    }
}