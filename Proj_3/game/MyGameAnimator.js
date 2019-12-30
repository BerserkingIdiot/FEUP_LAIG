class MyGameAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.sequence = orchestrator.gameSequence;
        this.currentMove = null;
    }
    start() {
        this.currentMove = move;
        this.currentStartTime = t;
    }
    update(t) {
        let move = this.sequence.getCurrentMove();

        if(move !== this.currentMove) {
            this.start();
        }

        this.currentMove.animate(t - this.currentStartTime);
    }
    display() {
        this.currentMove.display();
    }
}