class MyGameMove {
    constructor(orchestrator, piece, destination, state) {
        this.orchestrator = orchestrator;
        this.piece = piece;
        this.destination = destination;
        this.state = state;

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
    display() {
        this.piece.display();
    }
}