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

        console.log(src);
        console.log(dest);
        console.log(midpoint);
        console.log(axis);
        console.log(angle * 180 / Math.PI);

        return {midpoint, axis, angle};
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