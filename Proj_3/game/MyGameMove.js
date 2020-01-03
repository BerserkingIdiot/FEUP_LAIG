/**
 * @class MyGameMove
 * Holds the information of a game move: a piece and a destination tile.
 * Responsible for assigning a piece to a tile after an animation is over.
 */
class MyGameMove {
    /**
     * @constructor
     * @param {MyGamePiece representing the piece being moved} piece 
     * @param {MyOctoTile representing the board's destination tile} destination 
     */
    constructor(piece, destination) {
        this.piece = piece;
        this.destination = destination;
    }
    /**
     * @method onAnimationOver
     * Callback for when MyGameAnimator finishes the current move animation.
     * It bounds the piece to the tile and updates the piece coordinates.
     */
    onAnimationOver() {
        this.piece.setCoords(this.destination.getCoords());
        this.destination.setPiece(this.piece);
    }
    /**
     * @method display
     * Displays the move's piece.
     */
    display() {
        this.piece.display();
    }
}