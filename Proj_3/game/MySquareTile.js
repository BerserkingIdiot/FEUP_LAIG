class MySquareTile extends CGFobject {
    constructor(scene, id, x, y) {
        super(scene);
        this.id = id;
        this.coords = [];
        this.coords['x']=x;
        this.coords['y']=y;
        this.square = new MyRectangle(this.scene, this.id, 0, Math.PI/8, 0, Math.PI/8);
        this.piece;
    }

    getCoords() {
        return this.coords;
    }

    setPiece(piece) {
        this.piece = piece;
    }

    clearPiece() {
        this.piece = null;
    }

    display() {
        this.square.display();
        if(this.piece != null){
            this.piece.display();
        }
    }

}


