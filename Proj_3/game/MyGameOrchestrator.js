class MyGameOrchestrator {
    constructor(scene, player1Dif, player2Dif) {
        this.scene = scene;
        this.board = new MyBoard(this.scene, 0);
        this.gameSequence = new MyGameSequence(this);
        this.animator = new MyGameAnimator(this);
        this.player1Dif = player1Dif;
        this.player2Dif = player2Dif;
        this.player1 = true;
        this.prolog = new Server();

        this.currentTurnState = new TurnStateMachine(this.scene);
        this.pickablePiece = new MyGamePiece(this.scene, -1.5, 3.5, 'white');

        this.test();
    }
    test() {
        this.themes = new MyGameScenes(this.scene);
    }
    onAnimationOver() {
        //this occurs AFTER GameMove finishes
        this.player1 = !this.player1;
        if(this.player1){
            this.pickablePiece = new MyGamePiece(this.scene, -1.5, 3.5, 'white');
        }
        else{
            this.pickablePiece = new MyGamePiece(this.scene, 8.5, 3.5, 'black');
        }
        this.currentTurnState.clean();
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
        if(this.currentTurnState.state == 2){
            let piece = this.currentTurnState.getPiece();
            let tile = this.currentTurnState.getTile();
            let move = new MyGameMove(piece, tile);
            this.gameSequence.push(move);
            this.moveInitiated = true;
        }
    }
    display(){
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
        this.plays = [];
        this.currentState = new GameState([Array(8).fill(Array(8).fill(0)), Array(7).fill(Array(7).fill(0))], [1,0]);
        this.gameEnded = false;
    }
}