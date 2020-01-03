class MySquarePiece extends CGFobject {
    constructor(scene, x, y, color) {
        super(scene);

        this.lidSquare = new MyRectangle(this.scene, this.id, -Math.PI/16, Math.PI/16, -Math.PI/16, Math.PI/16);
        this.sideSquare = new MyRectangle(this.scene, this.id, -Math.PI/16, Math.PI/16, 0, 0.2);        
        this.x = x;
        this.y = y;
        this.initMaterials(scene, color);
    }
    initMaterials(scene, color) {
        if(color === 'white') {
            this.color = new CGFappearance(scene);
            this.color.setAmbient(0.2, 0.2, 0.2, 1.0);
            this.color.setDiffuse(0.8, 0.8, 0.8, 1.0);
            this.color.setSpecular(0.1, 0.1, 0.1, 1.0);
            this.color.setShininess(10.0);
        } else if (color === 'black') {
            this.color = new CGFappearance(scene);
            this.color.setAmbient(0.1, 0.1, 0.1, 1.0);
            this.color.setDiffuse(0.0, 0.0, 0.0, 1.0);
            this.color.setSpecular(0.1, 0.1, 0.1, 1.0);
            this.color.setShininess(10.0);
        } else {
            console.error('Invalid piece type');
        }
    }
    display() {
        // if(this.color){
        this.color.apply();
        this.scene.pushMatrix();
        
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.rotate(-Math.PI/4,0,0,1);

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.lidSquare.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.2);
        this.lidSquare.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/4, 0,1,0);
        this.scene.translate(0, 0, Math.PI/16);
        this.sideSquare.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(3*Math.PI/4, 0,1,0);
        this.scene.translate(0, 0, Math.PI/16);
        this.sideSquare.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(5*Math.PI/4, 0,1,0);
        this.scene.translate(0, 0, Math.PI/16);
        this.sideSquare.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(7*Math.PI/4, 0,1,0);
        this.scene.translate(0, 0, Math.PI/16);
        this.sideSquare.display();
        this.scene.popMatrix();


        // }
    }
    getCoords() {
        let coords = [];
        coords['x'] = this.x;
        coords['y'] = this.y;

        return coords;
    }
    setCoords(coords) {
        this.x = coords['x'];
        this.y = coords['y'];
    }
}