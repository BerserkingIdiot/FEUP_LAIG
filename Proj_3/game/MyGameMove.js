class MyGameMove {
    constructor(piece, destination) {
        this.piece = piece;
        this.destination = destination;
    }
    onAnimationOver() {
        console.log(this.destination.getCoords());
        console.log(this.piece.getCoords());
        this.piece.setCoords(this.destination.getCoords());
        console.log(this.piece.getCoords());
        this.destination.setPiece(this.piece);
    }
    display() {
        this.piece.display();
    }
}