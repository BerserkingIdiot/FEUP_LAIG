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
        if(this.piece != null){
            this.piece.display();
        }
        else {
            this.scene.registerForPick(this.id + 1, this); //DON'T use pick id 0
        }
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.rotate(Math.PI / 8, 0, 0, 1);
        this.octagon.display();
        this.scene.popMatrix();
        this.scene.clearPickRegistration();
    }


}