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
        
        this.undoButton = new MyRectangle(this.scene, 66, -1, 1, -1, 1);
        this.undoing = false;

        this.finalPaddingMove = new MyGameMove(new MyGamePiece(this.scene, 0, 0, 'white'), new MyOctoTile(this.scene, 0, 0));

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
                            console.log("Picked object: (" + obj.getCoords()['x'] + ", " + obj.getCoords()['y'] + "), with pick id " + customId);
                        }
                        else if(customId == 66){
                            if(this.currentTurnState.state == 0 || this.currentTurnState.state == 1){
                                this.undoing = true;
                            }
                            console.log("Picked object: undoButton, with pick id " + customId);
                        }
                        else {
                            this.currentTurnState.pickTile(obj);
                            console.log("Picked object: (" + obj.getCoords()['x'] + ", " + obj.getCoords()['y'] + "), with pick id " + customId);
                        }
                        
                        
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

            case 4:
                this.currentTurnState.pickTile(this.board.getTile(this.reply[0] - 1, this.reply[1] - 1));
                break;
        
            default:
                break;
        }
    }
    orchestrate() {
        if((this.player1 && this.player1Dif == 0) || (!this.player1 && this.player2Dif == 0)){
            this.pickingHandler(this.scene.pickMode, this.scene.pickResults);
        }
        else if(this.player1 && !this.animationPlaying && this.currentTurnState.state == 0){
            this.currentTurnState.pickPiece(this.pickablePiece);
            this.prolog.getAIinput(this.player1Dif, this.currentState.turnsToString(), this.currentState.boardToString());
        }
        else if(!this.player1 && !this.animationPlaying && this.currentTurnState.state == 0){
            this.currentTurnState.pickPiece(this.pickablePiece);
            this.prolog.getAIinput(this.player2Dif, this.currentState.turnsToString(), this.currentState.boardToString());
        }

        if(!this.waintingReply){
            if(this.currentTurnState.state == 2){
                let piece = this.currentTurnState.getPiece();
                let tile = this.currentTurnState.getTile();
                let coords = tile.getCoords();
                let move = new MyGameMove(piece, tile);
                move.setGameState(this.currentState);

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
                    this.finalPaddingMove.setGameState(new MyGameState(this.NewBoard, this.NewTurns));
                    this.gameSequence.push(this.finalPaddingMove);
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
                    this.pickablePiece = new MyGamePiece(this.scene, -1.5, 3.5, 'white');
                }
                else{
                    this.pickablePiece = new MyGamePiece(this.scene, 8.5, 3.5, 'black');
                }
                this.dropInitiated = true;

                this.currentState = new MyGameState(this.NewBoard, this.newTurns);
                // Once this is done, the state machine restarts from the beginning of the turn
                this.currentTurnState.clean();
                this.initTurnVars();
            }
        }
        if(this.undoing){ //FIXME: might have to undo 2 moves at a time when a bot is playing
            let undoneMove = this.gameSequence.undo();
            if(undoneMove == null){
                console.log("No moves to undo.");
            }
            else{
                undoneMove.destination.clearPiece();
                let diagonals = this.board.compareDiagonals(undoneMove.gameState.board[1]);
                this.board.updateDiagonals(diagonals);
                this.currentState = undoneMove.gameState;
                if(this.currentState.turns[0] > 0) {
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
                this.currentTurnState.clean();
                this.initTurnVars();
                
            }
            this.undoing = false;
        }
    }
    display(){
        if(this.gameEnded) {
            alert('Game Ended - Player ' + this.currPlayer + ' Wins, replaying game...');
            this.scene.gameOrchestrator = new MyReplayOrchestrator(this.scene, this.board, this.gameSequence, this.themes, this.currPlayer);
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

            this.scene.setDefaultAppearance();
            this.scene.pushMatrix();
            this.scene.translate(4, 2, -1);
            this.scene.registerForPick(66, this.undoButton);
            this.undoButton.display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
            
        }
    }
}