class MyGameOrchestrator {
    constructor(scene, player1Dif, player2Dif) {
        this.scene = scene;
        this.themes = new MyGameScenes(this.scene);
        this.board = new MyBoard(this.scene, 0);
        this.gameSequence = new MyGameSequence(this);
        this.animator = new MyGameAnimator(this);
        this.player1Dif = player1Dif;
        this.player2Dif = player2Dif;
        this.player1 = true;
        this.prolog = new Server();

        this.prologConnectionState = 0; // 0 -> not awaiting anything, 1 -> awaiting play reply, 2-> awaiting game end reply, 3-> awaiting turns reply

        this.currentTurnState = new TurnStateMachine(this.scene);
        this.pickablePiece = new MyGamePiece(this.scene, -1.5, 3.5, 'white');

        this.initGame();
        this.initTurnVars();
    }
    onAnimationOver() {
        this.currentTurnState.state = 4;
    }
    update(time) {
        if(this.moveInitiated){
            this.animator.start(time, 'arc');
            this.currentTurnState.startAnimation();
            this.moveInitiated = false;
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
    orchestrate() {
        this.pickingHandler(this.scene.pickMode, this.scene.pickResults);
        if(this.currentTurnState.state == 2 && this.prologConnectionState == 0){
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
            
            this.gameSequence.push(move);
            this.moveInitiated = true;
            this.prologConnectionState = 1;
        }
        else if(this.currentTurnState.state == 4 && this.prologConnectionState == 1){
            //this occurs AFTER GameMove finishes
            let ret = this.prolog.getReply();
            //console.log(ret);
            if(ret != null){
                this.Cut = ret[1];
                this.NewBoard = ret[0];
                this.prolog.checkGameEnd(JSON.stringify(this.NewBoard), this.currPlayer);
                this.board.updateDiagonals(this.NewBoard[1]);
                this.prologConnectionState = 2;
            }
        }
        else if(this.currentTurnState.state == 4 && this.prologConnectionState == 2){

            let ret = this.prolog.getReply();
            if(ret != null){
                if(ret === 1){this.gameEnded = true;}
                this.prolog.updateTurns(this.Cut, this.currentState.turnsToString());
                this.prologConnectionState = 3;
            }
        }
        else if(this.currentTurnState.state == 4 && this.prologConnectionState == 3){
            let ret = this.prolog.getReply();
            
            if(ret != null){
                this.newTurns = ret;
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
                this.currentTurnState.clean();
                this.currentState = new MyGameState(this.NewBoard, this.newTurns);
                // console.log(this.currentState);
                this.prologConnectionState = 0;
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
            if(this.currentTurnState.state == 3){
                this.animator.display();
            }else {
                this.scene.registerForPick(65, this.pickablePiece);
                this.pickablePiece.display();
                this.scene.clearPickRegistration();
            }
            
        }
    }
    initGame() {
        this.currentState = new MyGameState([Array(8).fill(Array(8).fill(0)), Array(7).fill(Array(7).fill(0))], [1,0]);
        this.gameEnded = false;
    }

    initTurnVars(){
        this.Cut = null;
        this.NewBoard = null;
        this.newTurns = null;
        this.currPlayer = 0;
    }
}