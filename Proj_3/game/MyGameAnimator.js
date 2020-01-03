class MyGameAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;
        this.gameSequence = orchestrator.gameSequence;
        this.startTime = 0;
        this.currentMove = null;
        this.animation = null;
        this.playing = false;

        this.finalInstant = 2;
    }
    reset() {
        this.startTime = 0;
        this.currentMove = null;
        this.animation = null;
        this.playing = false;
    }
    start(t, type) {
        this.startTime = t;
        this.currentMove = this.gameSequence.getCurrentMove();
        this.playing = true;

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
        console.log(this.currentMove);
        let {midpoint, axis, angle} = this.calculateValues(this.currentMove);
        let keyframe = new MyKeyframe(1, this.finalInstant, [0, 0, 0], [0, 0, angle], [1, 1, 1]);
        this.animation = new MyArcAnimation(this.scene, 0, [keyframe], axis, midpoint);
    }
    calculateValues(move) {
        // Source and destination coordinates
        let piece = move.piece.getCoords();
        let src = [];
        src['x'] = piece['x'] + 0.5;
        src['y'] = piece['y'] + 0.5;
        let tile = move.destination.getCoords();
        let dest = [];
        dest['x'] = tile['x'] + 0.5;
        dest['y'] = tile['y'] + 0.5;
        
        //Midpoint of the segment
        let dx = dest['x'] - src['x'];
        let dy = dest['y'] - src['y'];
        let midX = src['x'] + dx / 2.0;
        let midY = src['y'] + dy / 2.0;
        let midpoint = vec3.fromValues(midX, 0, midY);

        //Perpendicular axis
        let axis = vec3.fromValues(-dy, 0, dx);

        //Rotation angle
        let angle = dx > 0 ? (-175 * Math.PI / 180) : (175 * Math.PI / 180);

        return {midpoint, axis, angle};
    }
    update(t) {
        if(this.playing){
            let deltaT = t - this.startTime;
    
            if(deltaT < this.finalInstant * 1000)
                this.animation.update(t - this.startTime);
            else{
                this.orchestrator.onAnimationOver();
                this.currentMove.onAnimationOver();
                this.reset();
            }
        }
    }
    display() {
        if(this.playing) {
            this.scene.pushMatrix();
            this.animation.apply();
            this.currentMove.display();
            this.scene.popMatrix();
        }
    }
}