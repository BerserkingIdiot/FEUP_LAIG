class MyBoard extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.id = id;
        this.octoTiles = [];
        this.squareTiles = [];
        //TODO: materials for octo tiles and square tiles
        this.octoMat = new CGFappearance(this.scene);
        this.squareMat = new CGFappearance(this.scene);
        this.octoMat.setAmbient(0.6, 0.4, 0.0, 1.0);
        this.octoMat.setDiffuse(0.6, 0.4, 0.0, 1.0);
        this.octoMat.setSpecular(0.6, 0.4, 0.0, 1.0);
        this.octoMat.setShininess(10.0);
        this.squareMat.setAmbient(0.5, 0.2, 0.0, 1.0);
        this.squareMat.setDiffuse(0.5, 0.2, 0.0, 1.0);
        this.squareMat.setSpecular(0.5, 0.2, 0.0, 1.0);
        this.squareMat.setShininess(10.0);
        this.initTiles();
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
    }

    display() {
        //TODO: apply octo tile material
        this.octoMat.apply();
        this.octoTiles.forEach(this.singleTileDisplay, this);

        //TODO: apply square tile material
        this.squareMat.apply();
        for(var i = 0; i < 7; i++) {
            for(var j = 0; j < 7; j++) {
                this.scene.pushMatrix();
                this.scene.translate(j + 0.725, 0, i + 1);
                this.scene.rotate(-Math.PI/2,1,0,0);
                this.scene.rotate(-Math.PI/4,0,0,1);
                this.squareTiles[i*7+j].display();
                this.scene.popMatrix();
            }
        }
    }

    singleTileDisplay(tile) { //FIXME: something wrong with the this
        var coords = tile.getCoords();
        
        this.scene.pushMatrix();
        this.scene.translate(coords['x'] + 0.5, 0, coords['y'] + 0.5);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.rotate(Math.PI / 8, 0, 0, 1);
        tile.display();
        this.scene.popMatrix();
    } 

}