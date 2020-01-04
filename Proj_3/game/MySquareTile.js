class MySquareTile extends CGFobject {
    constructor(scene, id, x, y) {
        super(scene);
        this.id = id;
        this.coords = [];
        this.coords['x']=x;
        this.coords['y']=y;
        this.square = new MyRectangle(this.scene, this.id, -Math.PI/16, Math.PI/16, -Math.PI/16, Math.PI/16);
        this.piece = null;

        this.initMaterials()
    }
    initMaterials() {
        // Square tiles material
        this.squareMat = new CGFappearance(this.scene);
        this.squareMat.setAmbient(0.5, 0.2, 0.0, 1.0);
        this.squareMat.setDiffuse(0.5, 0.2, 0.0, 1.0);
        this.squareMat.setSpecular(0.5, 0.2, 0.0, 1.0);
        this.squareMat.setShininess(10.0);
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

    display(noMaterial) {
        if(!noMaterial){
            this.squareMat.apply();
        }

        this.scene.pushMatrix();
        this.scene.translate(this.coords['x'] + 1, 0, this.coords['y'] + 1);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.rotate(-Math.PI/4,0,0,1);
        this.square.display();
        this.scene.popMatrix();
        
        if(this.piece != null){
            this.piece.display();
        }
    }

}


