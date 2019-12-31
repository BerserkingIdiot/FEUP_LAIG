class MyGameMove {
    constructor(orchestrator, piece, destination, state) {
        this.orchestrator = orchestrator;
        this.piece = piece;
        this.destination = destination;
        this.state = state;

        //FIXME: change animation speed here
        this.endInstant = 1;
        let coords = destination.getCoords();
        let keyframe = new MyKeyframe(1, this.endInstant, [coords['x'], 0, coords['y']], [0, 0, 0], [1, 1, 1]);
        this.animation = new MyKeyframeAnimation(this.orchestrator.scene, 0, [keyframe]);
        this.startTime = null;

        this.calculate();
    }
    calculate() {
        // Source and destination coordinates
        let src = this.piece.getCoords();
        let dest = this.destination.getCoords();
        // Distance between the two coordinates
        let d = Math.sqrt((dest['x'] - src['x']) * (dest['x'] - src['x']) + (dest['y'] - src['y']) * (dest['y'] - src['y']));
        //Midpoint of the segment
        this.mid = [];
        this.mid['x'] = src['x'] + (dest['x'] - src['x']) / 2.0;
        this.mid['y'] = src['y'] + (dest['y'] - src['y']) / 2.0;
    }
    onAnimationOver() {
        //this.piece.setCoords(this.destination.getCoords());
        this.destination.setPiece(this.piece);
    }
    animate(t) {
        this.animation.update(t);
    }
    display() {
        this.animation.apply();
        this.piece.display();
    }
}