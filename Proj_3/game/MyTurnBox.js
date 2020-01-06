class MyTurnBox extends CGFobject {
    constructor(scene){
        super(scene);

        this.base = new MyPlane(this.scene, 0, 5, 5);

        // White square tiles material
        this.boxMat = new CGFappearance(this.scene);
        this.boxMat.setAmbient(0.5, 0.1, 0.2, 1.0);
        this.boxMat.setDiffuse(0.5, 0.1, 0.2, 1.0);
        this.boxMat.setSpecular(0.5, 0.1, 0.2, 1.0);
        this.boxMat.setShininess(10.0);

        this.undoMat = new CGFappearance(this.scene);
        this.undoMat.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.undoMat.setDiffuse(0.2, 0.2, 0.2, 1.0);
        this.undoMat.setSpecular(0.2, 0.2, 0.2, 1.0);
        this.undoMat.setShininess(2.0);

        // White square tiles material
        this.player1Mat = new CGFappearance(this.scene);
        this.player1Mat.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.player1Mat.setDiffuse(0.8, 0.8, 0.8, 1.0);
        this.player1Mat.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.player1Mat.setShininess(10.0);

        // White square tiles material
        this.player2Mat = new CGFappearance(this.scene);
        this.player2Mat.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.player2Mat.setDiffuse(0.8, 0.8, 0.8, 1.0);
        this.player2Mat.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.player2Mat.setShininess(10.0);

        this.zeroTexture = new CGFtexture(this.scene, 'scenes/images/zero.jpg');
        this.oneTexture = new CGFtexture(this.scene, 'scenes/images/one.jpg');
        this.twoTexture = new CGFtexture(this.scene, 'scenes/images/two.jpg');
        this.undoTexture = new CGFtexture(this.scene, 'scenes/images/undo.png');
        this.undoMat.setTexture(this.undoTexture);

        //this.roofMat.setTexture(this.roofTexture);
    }

    display(turns){
        this.boxMat.apply();
        //main box
        //front
        this.scene.pushMatrix();
        this.scene.translate(4, 1, -1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(4, 1, 2);
        this.base.display();
        this.scene.popMatrix();
        //top
        this.scene.pushMatrix();
        this.scene.translate(4, 2, -2);
        this.scene.scale(4, 1, 2);
        this.base.display();
        this.scene.popMatrix();
        //sides
        this.scene.pushMatrix();
        this.scene.translate(6, 1, -2);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(2, 1, 2);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2, 1, -2);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(2, 1, 2);
        this.base.display();
        this.scene.popMatrix();
        //back
        this.scene.pushMatrix();
        this.scene.translate(4, 1, -3);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(4, 1, 2);
        this.base.display();
        this.scene.popMatrix();

        //undo box
        //front
        this.scene.pushMatrix();
        this.scene.translate(4, 2.5, -1.2);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(2, 1, 1);
        this.base.display();
        this.scene.popMatrix();
        //top
        this.scene.pushMatrix();
        this.scene.translate(4, 3, -1.7);
        this.scene.scale(2, 1, 1);
        this.base.display();
        this.scene.popMatrix();
        //sides
        this.scene.pushMatrix();
        this.scene.translate(5, 2.5, -1.7);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(1, 1, 1);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(3, 2.5, -1.7);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(1, 1, 1);
        this.base.display();
        this.scene.popMatrix();
        //back
        this.scene.pushMatrix();
        this.scene.translate(4, 2.5, -2.2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(2, 1, 1);
        this.base.display();
        this.scene.popMatrix();

        //undo Button
        this.undoMat.apply();
        this.scene.pushMatrix();
        this.scene.translate(4, 2.5, -1.19);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.8, 0.6, 0.6);
        this.scene.registerForPick(66, this.base);
        this.base.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();



        if(turns[0] == 2){
            this.player1Mat.setTexture(this.twoTexture);
        }
        else if(turns[0] == 1){
            this.player1Mat.setTexture(this.oneTexture);
        } 
        else{
            this.player1Mat.setTexture(this.zeroTexture);
        }
        this.player1Mat.apply();
        this.scene.pushMatrix();
        this.scene.translate(2.7, 1, -0.99);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(1, 1, 1);
        this.base.display();
        this.scene.popMatrix();

        if(turns[1] == 2){
            this.player2Mat.setTexture(this.twoTexture);
        }
        else if(turns[1] == 1){
            this.player2Mat.setTexture(this.oneTexture);
        } 
        else{
            this.player2Mat.setTexture(this.zeroTexture);
        }
        this.player2Mat.apply();
        this.scene.pushMatrix();
        this.scene.translate(5.3, 1, -0.99);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(1, 1, 1);
        this.base.display();
        this.scene.popMatrix();
    }
}