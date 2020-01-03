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
        // Applying the octogonal tile material
        this.octoMat.apply();
        this.octoTiles.forEach((tile) => this.octoTileDisplay(tile));
        
        // Applying the square tile material
        this.squareMat.apply();
        this.squareTiles.forEach((tile) => this.squareTileDisplay(tile));

        // Applying the white square tile material
        this.whiteMat.apply();
        this.whiteTiles.forEach((tile) => this.squareTileDisplay(tile));

        // Applying the black square tile material
        this.blackMat.apply();
        this.blackTiles.forEach((tile) => this.squareTileDisplay(tile));
    }
    squareTileDisplay(tile) {
        let coords = tile.getCoords();

        this.scene.pushMatrix();
        this.scene.translate(coords['x'] + 0.725, 0, coords['y'] + 1);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.rotate(-Math.PI/4,0,0,1);
        tile.display();
        this.scene.popMatrix();
    }
    octoTileDisplay(tile) {
        let coords = tile.getCoords();
        
        this.scene.pushMatrix();
        this.scene.translate(coords['x'] + 0.5, 0, coords['y'] + 0.5);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.rotate(Math.PI / 8, 0, 0, 1);
        tile.display();
        this.scene.popMatrix();
    } 
    getTile(x, y) {
        let index = y*8+x;
        return this.octoTiles[index];
    }
}