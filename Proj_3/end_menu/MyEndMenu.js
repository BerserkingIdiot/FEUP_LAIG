class MyEndMenu extends CGFobject {
    constructor(scene, playerWon) {
        super(scene);

        this.background = new MyRectangle(scene, 0, -1.5, 1.5, -1, 1);
        this.background.updateTexCoords(3, 2);
        if (playerWon === 1) {
            this.backgroundTexture = new CGFtexture(scene, "scenes/images/player1_won.png");
        } else {
            this.backgroundTexture = new CGFtexture(scene, "scenes/images/player2_won.png");
        }

        this.replay = new MyRectangle(this.scene, 1, -0.25, 0.25, 0, 0.15);
        this.replay.updateTexCoords(0.5, 0.15);
        this.replayTexture = new CGFtexture(scene, "scenes/images/replay_button.png");
        
        this.rematch = new MyRectangle(this.scene, 2, -0.25, 0.25, -0.25, -0.1);
        this.rematch.updateTexCoords(0.5, 0.15);
        this.rematchTexture = new CGFtexture(scene, "scenes/images/rematch_button.png");
        
        this.exit = new MyRectangle(this.scene, 3, -0.25, 0.25, -0.50, -0.35);
        this.exit.updateTexCoords(0.5, 0.15);
        this.exitTexture = new CGFtexture(scene, "scenes/images/exit_button.png");
    }
    onClick(objID) {
        switch (objID) {
            case 1:
                this.scene.replay();
                break;
            
            case 2:
                this.scene.rematch();
                break;
            
            case 3:
                this.scene.exit();
                break;
        
            default:
                break;
        }
    }
    display() {
        this.scene.pushMatrix();

        // Applying the background texture and displaying it
        this.backgroundTexture.bind();
        this.background.display();
        this.backgroundTexture.unbind();

        this.scene.translate(0, 0, 0.01);
        
        this.scene.registerForPick(1, this.replay);
        this.replayTexture.bind();
        this.replay.display();
        this.replayTexture.unbind();
        this.scene.clearPickRegistration();
        
        this.scene.registerForPick(2, this.rematch);
        this.rematchTexture.bind();
        this.rematch.display();
        this.rematchTexture.unbind();
        this.scene.clearPickRegistration();
        
        this.scene.registerForPick(3, this.exit);
        this.exitTexture.bind();
        this.exit.display();
        this.exitTexture.unbind();
        this.scene.clearPickRegistration();
        
        this.scene.popMatrix();
    }
}