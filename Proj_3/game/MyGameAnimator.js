class MyGameAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;
        this.startTime = 0;
        this.currentMove = null;

        this.finalInstant = 2;
    }
    start(t, type, move) {
        this.startTime = t;
        this.currentMove = move;

        switch (type) {
            case 'arc':
                this.createArcAnimation();
                break;
            
            // If no type is specified then an Arc animation is used
            default:
                this.createArcAnimation();
                break;
        }
    }
    createArcAnimation() {
        let midpoint = this.currentMove.midpoint;
        let keyframe = new MyKeyframe(1, this.finalInstant, [0, 0, 0], [179 * Math.PI / 180, 0, 0], [1, 1, 1]);
        this.animation = new MyArcAnimation(this.scene, 0, [keyframe], vec3.fromValues(-1, 0, 1), vec3.fromValues(midpoint['x'], 0, midpoint['y']));
    }
    update(t) {
        let deltaT = t - this.startTime;

        if(deltaT < this.finalInstant * 1000)
            this.animation.update(t - this.startTime);
        else{
            this.orchestrator.onAnimationOver();
            this.currentMove.onAnimationOver();
        }
    }
    display() {
        this.scene.pushMatrix();
        this.animation.apply();
        this.currentMove.display();
        this.scene.popMatrix();
    }
}