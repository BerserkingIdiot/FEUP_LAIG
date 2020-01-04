class MyReplayOrchestrator {
    constructor(scene, board, sequence, winner){
        this.scene = scene;
        this.gameSequence = sequence;
        this.winner = winner;
        this.themes = new MyGameScenes(this.scene);
        this.board = board;
        this.animator = new MyGameAnimator(this);
        
        this.player1 = true;
        this.gameEnded = false;
        this.moveInitiated = false;

        this.roundState = 0;
        this.gameSequence.replay();
        this.board.clear();
    }

    update(time) {
        if(this.moveInitiated){
            this.animator.start(time, 'arc', this.gameSequence.getCurrentMove());
            this.roundState = 1;
            this.moveInitiated = false;
        }
        this.scene.graph.updateKeyframeAnimations(time);
        this.animator.update(time);
    }

    onAnimationOver() {
        this.roundState = 2;
    }

    orchestrate() {
        if(this.roundState == 0){
            /*
            if(this.gameSequence.getCurrentMove().gameState.turns[0] > 0) {
                this.player1 = true;
            } else {
                this.player1 = false;
            }
            */
            this.moveInitiated = true;
        }
        else if(this.roundState == 2){
            this.gameSequence.advance();
            this.updatedSquares = this.board.updateDiagonals(this.gameSequence.getCurrentMove().gameState.board[1]);
            if(this.gameSequence.atEnd()){
                this.gameEnded = true;
                this.roundState = -1;
            }
            else{
                this.roundState = 0;
            }
        }
    }

    display(){
        
        if(this.scene.graph.displayOk) {
            // this.themes.display();
            this.board.display();
            if(this.roundState == 1){
                this.animator.display();
            }else {
                this.gameSequence.getCurrentMove().piece.display();
            }

        }
        if(this.gameEnded) {
            alert('Game Ended - Player ' + this.winner + ' Wins!');
            this.gameEnded = false;
        }
    }
}