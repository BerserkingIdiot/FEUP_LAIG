class MenuStateMachine {
    constructor(scene) {
        this.scene = scene;
        
        this.startState();
    }
    handleEvent(objID) {
        switch (this.state) {
            case 'start':
                if(objID === 1) { // Play button pressed
                    // this.playState();
                }
                break;
            
            case 'play':
                if(objID === 1) { // Back button pressed
                    // this.startState();
                }
                if(objID === 2) { // Start button pressed
                    // Start Game
                }
                if(objID === 10) { // Player 1 down arrow pressed

                }
                if(objID === 20) { // Player 2 down arrow pressed

                }
                if(objID === 11) { // Player 1 up arrow pressed

                }
                if(objID === 21) { // Player 2 up arrow pressed

                }
                break;

            default:
                break;
        }
    }
    startState() {
        this.state = 'start';
        this.button = new MyRectangle(this.scene, 1, -0.25, 0.25, -0.25, 0);
        this.button.updateTexCoords(0.5, 0.25);
        this.buttonTexture = new CGFtexture(this.scene, "scenes/images/play_button.png");
    }
    playState() {
        this.state = 'play';

        this.playerTextures = [
            new CGFtexture(this.scene, "scenes/images/player_button.png"),
            new CGFtexture(this.scene, "scenes/images/ai_easy.png"),
            new CGFtexture(this.scene, "scenes/images/ai_hard.png")
        ];

        this.player1 = new MyRectangle(this.scene, 0, -0.5, -0.2, -0.15, 0);
        this.player1.updateTexCoords(0.3, 0.15);
        this.player1Texture = 0;
        
        this.player2 = new MyRectangle(this.scene, 0, 0.2, 0.5, -0.15, 0);
        this.player2.updateTexCoords(0.3, 0.15);
        this.player2Texture = 0;

        this.back = new MyRectangle(this.scene, 2, -0.2, 0, -0.55, -0.40);
        this.back.updateTexCoords(0.2, 0.15);
        this.backTexture = new CGFtexture(this.scene, "scenes/images/back_button.png");

        this.start = new MyRectangle(this.scene, 3, 0, 0.2, -0.55, -0.40);
        this.start.updateTexCoords(0.2, 0.15);
        this.startTexture = new CGFtexture(this.scene, "scenes/images/start_button.png");
    }
    display() {
        this.scene.pushMatrix();

        switch (this.state) {
            case 'start':
                this.scene.registerForPick(1, this.button);
                this.buttonTexture.bind();
                this.button.display();
                this.buttonTexture.unbind();
                this.scene.clearPickRegistration();
                break;
        
            case 'play':
                this.scene.registerForPick(2, this.back);
                this.backTexture.bind();
                this.back.display();
                this.backTexture.unbind();
                this.scene.clearPickRegistration();

                this.scene.registerForPick(3, this.start);
                this.startTexture.bind();
                this.start.display();
                this.startTexture.unbind();
                this.scene.clearPickRegistration();

                this.playerTextures[this.player1Texture].bind();
                this.player1.display();
                this.playerTextures[this.player1Texture].unbind();

                this.playerTextures[this.player2Texture].bind();
                this.player2.display();
                this.playerTextures[this.player2Texture].unbind();
                break;

            default:
                break;
        }

        this.scene.popMatrix();
    }
}