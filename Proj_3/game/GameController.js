class GameController {
    constructor(player1Dif, player2Dif) {
        this.plays;
        this.currentState;
        this.player1Dif = player1Dif;
        this.player2Dif = player2Dif;
        this.server = Server();
    }
    gameLoop(){
        this.initGame();

        while(this.gameEnded){ //TODO: game end
            //Check player
            //Display
            //IF PLAYER -> handlePick : aiPlay_prolog
            //execute_play (animation, prolog, change state)

            // Saves a copy of the current state in the stack for Undo and Replay purposes
            this.plays.push(Object.assign({}, this.currentState));

            if(this.server.checkGameEnd) {
                this.gameEnded = true;
            }
        }

        //RESET
    }
    initGame() {
        this.plays = [];
        this.currentState = new GameState([Array(8).fill(Array(8).fill(0)), Array(7).fill(Array(7).fill(0))], [1,0]);
        this.gameEnded = false;
    }
}