class MyOctoTile extends CGFobject {
    constructor(scene, id, x, y) {
        super(scene);
        this.id = id;
        this.coords = [];
        this.coords['x']=x;
        this.coords['y']=y;
        this.octagon = new MyOctagon(this.scene, this.id, 0.5);
        this.piece;
        //TODO: make pickable
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
        this.octagon.display();
        if(this.piece != null){
            this.piece.display();
        }
    }


}