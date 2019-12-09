class GameController {
    constructor(player1Dif, player2Dif) {
        this.plays;
        this.currentState;
        this.player1Dif = player1Dif;
        this.player2Dif = player2Dif;
        this.player1 = true;
        this.server = Server();
    }
    gameLoop(){
        this.initGame();

        while(!this.gameEnded){ //TODO: game end
            //Display
            if(this.player1) {
                if(this.player1Dif != 0){
                    //play AI
                }
                else {
                    //player 1 pick
                }
            }
            else {
                if(this.player2Dif != 0){
                    //play AI
                }
                else {
                    //player 2 pick
                }
            }

            //execute_play (animation, prolog, change state)

            // Saves a copy of the current state in the stack for Undo and Replay purposes
            this.plays.push(Object.assign({}, this.currentState));

            if(this.server.checkGameEnd) {
                this.gameEnded = true;
            }
        }
        
    }
    initGame() {
        this.plays = [];
        this.currentState = new GameState([Array(8).fill(Array(8).fill(0)), Array(7).fill(Array(7).fill(0))], [1,0]);
        this.gameEnded = false;
    }
}