class MyGameOrchestrator {
    constructor(scene, player1Dif, player2Dif) {
        this.scene = scene;
        this.animator = new MyGameAnimator(this);
        this.board = new MyBoard(this.scene, 0);
        this.gameSequence = new MyGameSequence(this);
        this.player1Dif = player1Dif;
        this.player2Dif = player2Dif;
        this.player1 = true;
        this.prolog = new Server();

        this.prologConnectionState = 0; // 0 -> not awaiting anything, 1 -> awaiting play reply, 2-> awaiting game end reply, 3-> awaiting turns reply

        this.currentTurnState = new TurnStateMachine(this.scene);
        this.pickablePiece = new MyGamePiece(this.scene, 0.5, 0.5, 'white');

        this.test();
        this.initGame();
        this.initTurnVars();
    }
    test() {
        //this.mypiece = new MyGamePiece(this.scene, 1, 1, 'white');
        //this.mypiece2 = new MyGamePiece(this.scene, 2, 2, 'black');
        this.themes = new MyGameScenes(this.scene);
    }
    update(time) {
        this.scene.graph.updateKeyframeAnimations(time);
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

            if(this.player1){this.currPlayer = 1;}
            else{this.currPlayer = 2;}
            this.prolog.play(this.currentState.boardToString(), this.currPlayer, this.currentTurnState.destinationTile.coords['x'] + 1, this.currentTurnState.destinationTile.coords['y'] + 1);
            
            //execute GameMove here
            this.currentTurnState.destinationTile.setPiece(this.currentTurnState.piece); //this will get swapped for GameMove
            this.prologConnectionState = 1;
        }
        else if(this.currentTurnState.state == 2 && this.prologConnectionState == 1){
            //this occurs AFTER GameMove finishes
            let ret = this.prolog.getReply();
            //console.log(ret);
            if(ret != null){
                this.Cut = ret[1];
                this.NewBoard = ret[0];
                this.prolog.checkGameEnd(JSON.stringify(this.NewBoard), this.currPlayer);
                this.prologConnectionState = 2;
            }

        }
        else if(this.currentTurnState.state == 2 && this.prologConnectionState == 2){

            let ret = this.prolog.getReply();
            if(ret != null){
                if(ret === 1){this.gameEnded = true;}
                this.prolog.updateTurns(this.Cut, this.currentState.turnsToString());
                this.prologConnectionState = 3;
            }
        }
        else if(this.currentTurnState.state == 2 && this.prologConnectionState == 3){
            let ret = this.prolog.getReply();
            console.log(ret);
            if(ret != null){
                this.newTurns = ret;
                if(this.newTurns[0] > 0){this.player1 = true}
                else{this.player1 = false}
                //this.player1 = !this.player1;
                if(this.player1){
                    this.pickablePiece = new MyGamePiece(this.scene, 0.5, 0.5, 'white');
                }
                else{
                    this.pickablePiece = new MyGamePiece(this.scene, 0.5, 0.5, 'black');
                }
                this.currentTurnState.clean();
                this.currentState = new MyGameState(this.NewBoard, this.newTurns);
                console.log(this.currentState);
                this.prologConnectionState = 0;
                this.initTurnVars();
            }
        }
    }
    display(){
        if(this.scene.graph.displayOk) {
            this.themes.display();
            //this.mypiece.display();
            //this.mypiece2.display();
            this.board.display();
            this.scene.registerForPick(65, this.pickablePiece);
            this.scene.pushMatrix();
            if(this.player1){this.scene.translate(-1, 0, 4);}
            else{this.scene.translate(9, 0, 4);}
            this.pickablePiece.display();
            this.scene.popMatrix();
            this.scene.clearPickRegistration();
        }
    }
    initGame() {
        this.plays = [];
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