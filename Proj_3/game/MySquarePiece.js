class MySquarePiece extends CGFobject {
    constructor(scene, color) {
        super(scene);

        this.lidSquare = new MyRectangle(this.scene, this.id, -Math.PI/16, Math.PI/16, -Math.PI/16, Math.PI/16);
        this.sideSquare = new MyRectangle(this.scene, this.id, -Math.PI/16, Math.PI/16, 0, 0.2);
        this.color = color
        this.initMaterials(scene, color);
    }
    initMaterials(scene, color) {
        if(color === 'white') {
            this.colorMat = new CGFappearance(scene);
            this.colorMat.setAmbient(0.2, 0.2, 0.2, 1.0);
            this.colorMat.setDiffuse(0.8, 0.8, 0.8, 1.0);
            this.colorMat.setSpecular(0.1, 0.1, 0.1, 1.0);
            this.colorMat.setShininess(10.0);
        } else if (color === 'black') {
            this.colorMat = new CGFappearance(scene);
            this.colorMat.setAmbient(0.1, 0.1, 0.1, 1.0);
            this.colorMat.setDiffuse(0.0, 0.0, 0.0, 1.0);
            this.colorMat.setSpecular(0.1, 0.1, 0.1, 1.0);
            this.colorMat.setShininess(10.0);
        } else {
            console.error('Invalid piece type');
        }
    }
    display() {
        this.colorMat.apply();
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
    }
}