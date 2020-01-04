class MyGameOrchestrator {
    constructor(scene, player1Dif, player2Dif) {
        this.scene = scene;
        this.themes = new MyGameScenes(this.scene);
        this.board = new MyBoard(this.scene, 0);
        this.gameSequence = new MyGameSequence(this);
        this.player1Dif = player1Dif;
        this.player2Dif = player2Dif;
        
        this.animator = new MyGameAnimator(this);
        this.animationPlaying = false;
        
        this.prolog = new Server(this);
        this.waintingReply = false;
        
        this.currentTurnState = new TurnStateMachine(this.scene);

        this.initGame();
        this.initTurnVars();
    }
    initGame() {
        this.currentState = new MyGameState([Array(8).fill(Array(8).fill(0)), Array(7).fill(Array(7).fill(0))], [1,0]);
        this.pickablePiece = new MyGamePiece(this.scene, -1.5, 3.5, 'white');
        this.dropInitiated = true;
        this.player1 = true;
        this.gameEnded = false;
    }
    initTurnVars(){
        this.Cut = null;
        this.NewBoard = null;
        this.newTurns = null;
        this.currPlayer = 0;
    }
    update(time) {
        if(this.arcInitiated){
            this.animator.start(time, 'arc', this.gameSequence.getCurrentMove());
            this.animationPlaying = true;
            this.arcInitiated = false;
        } else if (this.growInitiated) {
            this.animator.start(time, 'grow', this.updatedSquares);
            this.animationPlaying = true;
            this.growInitiated = false;
        } else if (this.dropInitiated) {
            this.animator.start(time, 'drop', this.pickablePiece);
            this.animationPlaying = true;
            this.dropInitiated = false;
        }
        this.scene.graph.updateKeyframeAnimations(time);
        this.animator.update(time);
    }
    pickingHandler(pickMode, pickResults) {
        if (pickMode == false) {
            if (pickResults != null && pickResults.length > 0) {
                for (var i = 0; i < pickResults.length; i++) {
                    var obj = pickResults[i][0];
                    if (obj) {
                        var customId = pickResults[i][1];
                        if(customId == 65){
                            this.currentTurnState.pickPiece(obj);
                        }
                        else {
                            this.currentTurnState.pickTile(obj);
                        }
                        console.log("Picked object: (" + obj.getCoords()['x'] + ", " + obj.getCoords()['y'] + "), with pick id " + customId);
                        console.log("CTS is at state: " + this.currentTurnState.state);						
						
                    }
                }
                pickResults.splice(0, pickResults.length);
            }
        }
    }
    onAnimationOver(type) {
        this.animationPlaying = false;

        switch (type) {
            case 'arc':
                this.gameSequence.getCurrentMove().onAnimationOver();
                this.currentTurnState.arcAnimationOver();
                break;

            case 'grow':
                this.board.updateDiagonals(this.updatedSquares);
                this.updatedSquares = [];
                this.currentTurnState.growAnimationOver();
                break;
        
            default:
                break;
        }
    }
    handlePrologReply(code, reply) {
        this.waintingReply = false;
        this.reply = JSON.parse(reply);

        switch (code) {
            case 1:
                this.currentTurnState.playRequestOver();
                break;

            case 2:
                this.currentTurnState.checkGameEndRequestOver();
                break;
            case 3:
                this.currentTurnState.updateTurnsRequestOver();
                break;
        
            default:
                break;
        }
    }
    orchestrate() {
        this.pickingHandler(this.scene.pickMode, this.scene.pickResults);
        if(!this.waintingReply){
            if(this.currentTurnState.state == 2){
                let piece = this.currentTurnState.getPiece();
                let tile = this.currentTurnState.getTile();
                let coords = tile.getCoords();
                let move = new MyGameMove(piece, tile);

                if(this.player1) {
                    this.currPlayer = 1;
                } else {
                    this.currPlayer = 2;
                }
                this.prolog.play(this.currentState.boardToString(), this.currPlayer, coords['x'] + 1, coords['y'] + 1);
                this.waintingReply = true;
                
                this.gameSequence.push(move);
                this.arcInitiated = true;
            }
            else if(this.currentTurnState.state == 5){
                this.Cut = this.reply[1];
                this.NewBoard = this.reply[0];

                this.prolog.checkGameEnd(JSON.stringify(this.NewBoard), this.currPlayer);
                this.waintingReply = true;

                this.updatedSquares = this.board.compareDiagonals(this.NewBoard[1]);
                this.growInitiated = true;
            }
            else if(this.currentTurnState.state == 8){
                if(this.reply === 1) {
                    this.gameEnded = true;
                }
                this.prolog.updateTurns(this.Cut, this.currentState.turnsToString());
                this.waintingReply = true;
            }
            else if(this.currentTurnState.state == 9){
                this.newTurns = this.reply;
                if(this.newTurns[0] > 0) {
                    this.player1 = true;
                } else {
                    this.player1 = false;
                }
                
                if(this.player1){
                    this.pickablePiece = new MyGamePiece(this.scene, -1.5, 4, 'white');
                }
                else{
                    this.pickablePiece = new MyGamePiece(this.scene, 8.5, 4, 'black');
                }
                this.dropInitiated = true;

                this.currentState = new MyGameState(this.NewBoard, this.newTurns);
                // Once this is done, the state machine restarts from the beginning of the turn
                this.currentTurnState.reset();
                this.initTurnVars();
            }
        }
    }
    display(){
        if(this.gameEnded) {
            alert('Game Ended - Player ' + this.currPlayer + ' Wins!');
        }
        if(this.scene.graph.displayOk) {
            // this.themes.display();
            this.board.display();
            if(this.animationPlaying){
                this.animator.display();
            }else if (!this.dropInitiated) {
                this.scene.registerForPick(65, this.pickablePiece);
                this.pickablePiece.display();
                this.scene.clearPickRegistration();
            }
            
        }
    }
}