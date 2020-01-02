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
        this.mypiece = new MyGamePiece(this.scene, 1, 1, 'white');
        this.themes = new MyGameScenes(this.scene);
    }
    display(){
        if(this.scene.graph.displayOk) {
            this.themes.display();
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