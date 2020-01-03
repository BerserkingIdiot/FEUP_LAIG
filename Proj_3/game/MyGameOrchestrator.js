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

        this.test();
    }
    test() {
        this.mypiece = new MyGamePiece(this.scene, 4, 4, 'white');
        this.mypiece2 = new MyGamePiece(this.scene, 2, 2, 'black');
        // this.board.getTile(2,2).setPiece(this.mypiece2);
        this.move = new MyGameMove(this.scene, this.mypiece, this.board.getTile(7,0));
        this.themes = new MyGameScenes(this.scene);
        this.gameSequence.push(this.move);
        this.moveInitiated = true;
    }
    onAnimationOver() {
        this.animationInitiated = false;
    }
    update(time) {
        if(this.moveInitiated){
            this.animator.start(time, 'arc', this.move);
            this.moveInitiated = false;
            this.animationInitiated = true;
        }
        this.scene.graph.updateKeyframeAnimations(time);
        this.animator.update(time)
    }
    pickingHandler(pickMode, pickResults) {
        if (pickMode == false) {
            if (pickResults != null && pickResults.length > 0) {
                for (var i = 0; i < pickResults.length; i++) {
                    var obj = pickResults[i][0];
                    if (obj) {
                        var customId = pickResults[i][1];
                        console.log("Picked tile: (" + obj.getCoords()['x'] + ", " + obj.getCoords()['y'] + "), with pick id " + customId);						
                    }
                }
                pickResults.splice(0, pickResults.length);
            }
        }
    }
    orchestrate() {
        this.pickingHandler(this.scene.pickMode, this.scene.pickResults);
    }
    display(){
        if(this.scene.graph.displayOk) {
            // this.themes.display();
            this.mypiece2.display();
            if(this.animationInitiated)
                this.animator.display();
            else
                this.mypiece.display();
            this.board.display();
        }
    }
    initGame() {
        this.plays = [];
        this.currentState = new GameState([Array(8).fill(Array(8).fill(0)), Array(7).fill(Array(7).fill(0))], [1,0]);
        this.gameEnded = false;
    }
}