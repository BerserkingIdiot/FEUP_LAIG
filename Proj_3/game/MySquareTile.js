class MySquareTile extends CGFobject {
    constructor(scene, id, x, y) {
        super(scene);
        this.id = id;
        this.coords = [];
        this.coords['x']=x;
        this.coords['y']=y;
        this.square = new MyRectangle(this.scene, this.id, -Math.PI/16, Math.PI/16, -Math.PI/16, Math.PI/16);
        this.piece = null;
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

    getColor() {
        if(this.piece !== null) {
            return this.piece.color === 'white' ? 1 : 2;
        }

        return 0;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.rotate(-Math.PI/4,0,0,1);
        this.square.display();
        this.scene.popMatrix();
        if(this.piece != null){
            this.piece.display();
        }
    }

}


