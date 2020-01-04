class MyBoard extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.id = id;
        this.octoTiles = [];
        this.squareTiles = [];
        this.whiteTiles = [];
        this.blackTiles = [];

        this.initMaterials();
        
        this.initTiles();
        this.base = new MyPlane(this.scene, 0, 20, 20);
    }
    initMaterials() {
        // White square tiles material
        this.whiteMat = new CGFappearance(this.scene);
        this.whiteMat.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.whiteMat.setDiffuse(0.8, 0.8, 0.8, 1.0);
        this.whiteMat.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.whiteMat.setShininess(10.0);
        // Black square tiles material
        this.blackMat = new CGFappearance(this.scene);
        this.blackMat.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.blackMat.setDiffuse(0.1, 0.1, 0.1, 1.0);
        this.blackMat.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.blackMat.setShininess(10.0);
        // Base plane material
        this.baseMat = new CGFappearance(this.scene);
        this.baseMat.setAmbient(0.75, 0.55, 0.0, 1.0);
        this.baseMat.setDiffuse(0.75, 0.55, 0.0, 1.0);
        this.baseMat.setSpecular(0.75, 0.55, 0.0, 1.0);
        this.baseMat.setShininess(10.0);
    }   
    initTiles() {
        for(var i = 0; i < 8; i++) {
            for(var j = 0; j < 8; j++){
                this.octoTiles.push(new MyOctoTile(this.scene, i*8+j, j, i));
            }
        }
        for(var i = 0; i < 7; i++) {
            for(var j = 0; j < 7; j++) {
                this.squareTiles.push(new MySquareTile(this.scene, i*7+j, j, i));
            }
        }
        for(var i = 0; i < 7; i++) {
            this.whiteTiles.push(new MySquareTile(this.scene, 48 + i, -1, i));
            this.whiteTiles.push(new MySquareTile(this.scene, 48 + i + 1, 7, i));
        }
        for(var j = 0; j < 7; j++) {
            this.blackTiles.push(new MySquareTile(this.scene, 60 + j, j, -1));
            this.blackTiles.push(new MySquareTile(this.scene, 60 + j + 1, j, 7));
        }
    }
    display() {
        this.baseMat.apply();
        this.scene.pushMatrix();
        this.scene.translate(4, -0.1, 4);
        this.scene.scale(12, 1, 12);
        this.base.display();
        this.scene.popMatrix();


        // Applying the octogonal tile material
        this.octoTiles.forEach((tile) => tile.display());
        
        // Applying the square tile material
        this.squareTiles.forEach((tile) => tile.display(false));

        // Applying the white square tile material
        this.whiteMat.apply();
        this.whiteTiles.forEach((tile) => tile.display(true));

        // Applying the black square tile material
        this.blackMat.apply();
        this.blackTiles.forEach((tile) => tile.display(true));
    }
    getTile(x, y) {
        let index = y*8+x;
        return this.octoTiles[index];
    }
    updateDiagonals(newDiagArray){
        let updatedPieces = [];

        for(let i = 0; i < 7; i++){ //this is the Y
            for(let j = 0; j < 7; j++){ // this is the X
                let index = i*7+j;
                let currentColor = this.squareTiles[index].getColor();
                let newColor = newDiagArray[i][j];
                if( currentColor != newColor){
                    if(newColor == 0){
                        this.squareTiles[index].clearPiece();
                    }
                    else{
                        let color;
                        if(newColor == 1) { color = 'white'; }
                        else { color = 'black'; }
                        let piece = new MySquarePiece(this.scene, j, i, color);
                        updatedPieces.push(piece);
                        this.squareTiles[index].setPiece(piece);
                    }
                }
            }
        }
        
        return updatedPieces;
    }

    clear() {
        this.octoTiles.forEach((tile) => tile.clearPiece());
        
        this.squareTiles.forEach((tile) => tile.clearPiece());
    }
}