class GameController {
    constructor(player1Dif, player2Dif) {
        this.plays;
        this.currentState;
        this.player1Dif = player1Dif;
        this.player2Dif = player2Dif;
        this.server;
    }
    gameLoop(){
        this.initGame();

        while(true){ //TODO: game end
            //Check player
            //Display
            //IF PLAYER -> handlePick : aiPlay_prolog
            //execute_play (animation, prolog, change state)
            this.playPiece(input)
        }

        //RESET
    }
    initGame() {
        this.plays = [];
        this.currentState = new GameState([Array(8).fill(Array(8).fill(0)), Array(7).fill(Array(7).fill(0))], [1,0])
    }
    playPiece() {
    }
}