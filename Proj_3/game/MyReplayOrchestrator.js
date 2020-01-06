class MyReplayOrchestrator {
    constructor(scene, board, sequence, themes, winner){
        this.scene = scene;
        this.gameSequence = sequence;
        this.winner = winner;
        this.themes = themes;
        this.board = board;
        this.animator = new MyGameAnimator(this);
        this.gameSequence.orchestrator = this;
        
        // this.animationPlaying = false;
        
        // this.player1 = true;
        // this.gameEnded = false;

        // this.roundState = 5;
        // this.gameSequence.replay();
        // this.board.clear();
        // this.dropInitiated = true;
        // this.dropDone = false;

        this.reset();
    }
    reset() {
        this.animationPlaying = false;
        this.player1 = true;
        this.gameEnded = false;

        this.roundState = 5;
        this.gameSequence.replay();
        this.board.clear();
        this.dropInitiated = true;
        this.dropDone = false;
    }
    requestReplay() {
        this.reset();
        return this;
    }
    update(time) {
        if(this.arcInitiated){
            this.animator.start(time, 'arc', this.gameSequence.getCurrentMove());
            this.animationPlaying = true;
            this.arcInitiated = false;
            //console.log("started arc");
        } else if (this.growInitiated) {
            this.animator.start(time, 'grow', this.updatedSquares);
            this.animationPlaying = true;
            this.growInitiated = false;
            //console.log("started grow");
        } else if (this.dropInitiated) {
            this.animator.start(time, 'drop', this.gameSequence.getCurrentMove().piece);
            this.animationPlaying = true;
            this.dropInitiated = false;
            //console.log(this.gameSequence);
            //console.log("started drop");
        }
        this.scene.graph.updateKeyframeAnimations(time);
        this.animator.update(time);
    }

    onAnimationOver(type) {
        this.animationPlaying = false;
        //console.log("anim over");
        switch (type) {
            case 'arc':
                this.gameSequence.getCurrentMove().onAnimationOver();
                this.roundState = 2;
                break;

            case 'grow':
                this.board.updateDiagonals(this.updatedSquares);
                this.updatedSquares = [];
                this.roundState = 4;
                break;
        
            case 'drop':
                this.roundState = 0;
                this.dropDone = true;
                //console.log("twas a drop");
                break;

            default:
                break;
        }
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
            this.arcInitiated = true;
            this.roundState = 1;
            //console.log("frist");
        }
        else if(this.roundState == 2){
            this.gameSequence.advance();
            this.dropDone = false;
            this.updatedSquares = this.board.compareDiagonals(this.gameSequence.getCurrentMove().gameState.board[1]);
            this.growInitiated = true;
            this.roundState = 3;
            //console.log("secs");
        }
        else if(this.roundState == 4){
            if(this.gameSequence.atEnd()){
                this.gameEnded = true;
                this.roundState = -1;
            }
            else{
                this.dropInitiated = true;
                this.roundState = 5;
                //console.log("tree");

            }
        }
    }

    display(){
        if(this.scene.graph.displayOk) {
            // this.themes.display();
            this.board.display();
            if(this.animationPlaying){
                this.animator.display();
            }else if (!this.dropInitiated && this.dropDone){
                this.gameSequence.getCurrentMove().piece.display();
            }

        }
    }
}