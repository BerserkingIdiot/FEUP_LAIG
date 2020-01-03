class MyGameMove {
    constructor(scene, piece, destination) {
        this.scene = scene;
        this.piece = piece;
        this.destination = destination;
    }
    onAnimationOver() {
        this.piece.setCoords(this.destination.getCoords());
        this.destination.setPiece(this.piece);
    }
    display() {
        this.piece.display();
    }
}