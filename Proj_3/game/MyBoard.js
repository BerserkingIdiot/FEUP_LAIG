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
        // Octogonal tiles material
        this.octoMat = new CGFappearance(this.scene);
        this.octoMat.setAmbient(0.6, 0.4, 0.0, 1.0);
        this.octoMat.setDiffuse(0.6, 0.4, 0.0, 1.0);
        this.octoMat.setSpecular(0.6, 0.4, 0.0, 1.0);
        this.octoMat.setShininess(10.0);
        // Square tiles material
        this.squareMat = new CGFappearance(this.scene);
        this.squareMat.setAmbient(0.5, 0.2, 0.0, 1.0);
        this.squareMat.setDiffuse(0.5, 0.2, 0.0, 1.0);
        this.squareMat.setSpecular(0.5, 0.2, 0.0, 1.0);
        this.squareMat.setShininess(10.0);
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
        //this.octoMat.apply();
        this.octoTiles.forEach((tile) => tile.display());
        
        // Applying the square tile material
        //this.squareMat.apply();
        this.squareTiles.forEach((tile) => this.squareTileDisplay(tile, false));

        // Applying the white square tile material
        this.whiteMat.apply();
        this.whiteTiles.forEach((tile) => this.squareTileDisplay(tile, true));

        // Applying the black square tile material
        this.blackMat.apply();
        this.blackTiles.forEach((tile) => this.squareTileDisplay(tile, true));
    }
    squareTileDisplay(tile, border) {
        let coords = tile.getCoords();
        if(!border){this.squareMat.apply();}
        this.scene.pushMatrix();
        this.scene.translate(coords['x'] + 1, 0, coords['y'] + 1);
        //this.scene.rotate(-Math.PI/2,1,0,0);
        //this.scene.rotate(-Math.PI/4,0,0,1);
        tile.display();
        this.scene.popMatrix();
    }
    getTile(x, y) {
        let index = y*8+x;
        return this.octoTiles[index];
    }
    updateDiagonals(newDiagArray){
        for(let i = 0; i < 7; i++){ //this is the Y
            for(let j = 0; j < 7; j++){ // this is the X
                let index = i*7+j;
                let currentColor = this.squareTiles[index].getColor();
                let newColor = newDiagArray[i][j];
                if( currentColor != newColor){
                    let color;
                    if(newColor == 1) {
                        color = 'white';
                    } else {
                        color = 'black';
                    }
                    this.squareTiles[index].setPiece(new MySquarePiece(this.scene, color));
                }
            }
        }
    }
}