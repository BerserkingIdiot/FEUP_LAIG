class MyGameMove {
    constructor(piece, destination) {
        this.piece = piece;
        this.destination = destination;
        this.midpoint = this.calculateMidpoint();
    }
    calculateMidpoint() {
        // Source and destination coordinates
        let src = this.piece.getCoords();
        let tile = this.destination.getCoords();
        let dest = [];
        dest['x'] = tile['x'] + 1;
        dest['y'] = tile['y'] + 1;
        //Midpoint of the segment
        let mid = [];
        mid['x'] = src['x'] + (dest['x'] - src['x']) / 2.0;
        mid['y'] = src['y'] + (dest['y'] - src['y']) / 2.0;

        return mid;
    }
    onAnimationOver() {
        this.piece.setCoords(this.destination.getCoords());
        this.destination.setPiece(this.piece);
    }
    display() {
        this.piece.display();
    }
}