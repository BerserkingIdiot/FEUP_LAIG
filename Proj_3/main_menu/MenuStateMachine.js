class MenuStateMachine {
    constructor(scene) {
        this.scene = scene;
        
        this.startState();
    }
    handleEvent(objID) {
        switch (this.state) {
            case 'start':
                if(objID === 1) { // Play button pressed
                    this.playState();
                }
                break;
            
            case 'play':
                if(objID === 2) { // Back button pressed
                    this.startState();
                }
                if(objID === 3) { // Start button pressed
                    this.scene.startGame(this.player1Texture - 1, this.player2Texture - 1);
                }
                if(objID === 10) { // Player 1 down arrow pressed
                    this.player1Texture == 0 ? (this.player1Texture = this.playerTextures.length - 1) : (this.player1Texture -= 1);
                }
                if(objID === 20) { // Player 2 down arrow pressed
                    this.player2Texture == 0 ? (this.player2Texture = this.playerTextures.length - 1) : (this.player2Texture -= 1);
                }
                if(objID === 11) { // Player 1 up arrow pressed
                    this.player1Texture = (this.player1Texture + 1) % this.playerTextures.length;
                }
                if(objID === 21) { // Player 2 up arrow pressed
                    this.player2Texture = (this.player2Texture + 1) % this.playerTextures.length;
                }
                break;

            default:
                break;
        }
    }
    startState() {
        this.state = 'start';
        this.button = new MyRectangle(this.scene, 1, -0.35, 0.35, -0.25, 0);
        this.button.updateTexCoords(0.7, 0.25);
        this.buttonTexture = new CGFtexture(this.scene, "scenes/images/play_button.png");
    }
    playState() {
        this.state = 'play';

        this.playerTextures = [
            new CGFtexture(this.scene, "scenes/images/ai_easy.png"),
            new CGFtexture(this.scene, "scenes/images/player_button.png"),
            new CGFtexture(this.scene, "scenes/images/ai_hard.png")
        ];

        this.player1 = new MyRectangle(this.scene, 0, -0.5, -0.2, -0.075, 0.075);
        this.player1.updateTexCoords(0.3, 0.15);
        this.player1Texture = 1;
        
        this.player2 = new MyRectangle(this.scene, 0, 0.2, 0.5, -0.075, 0.075);
        this.player2.updateTexCoords(0.3, 0.15);
        this.player2Texture = 1;

        this.back = new MyRectangle(this.scene, 2, -0.2, 0, -0.55, -0.40);
        this.back.updateTexCoords(0.2, 0.15);
        this.backTexture = new CGFtexture(this.scene, "scenes/images/back_button.png");

        this.start = new MyRectangle(this.scene, 3, 0, 0.2, -0.55, -0.40);
        this.start.updateTexCoords(0.2, 0.15);
        this.startTexture = new CGFtexture(this.scene, "scenes/images/start_button.png");

        this.player1Up = new MyTriangle(this.scene, 11, -0.4, -0.3, -0.35, 0.125, 0.125, 0.225, 0, 0, 0);
        this.player1Down = new MyTriangle(this.scene, 10, -0.3, -0.4, -0.35, -0.125, -0.125, -0.225, 0, 0, 0);

        this.player2Up = new MyTriangle(this.scene, 21, 0.3, 0.4, 0.35, 0.125, 0.125, 0.225, 0, 0, 0);
        this.player2Down = new MyTriangle(this.scene, 20, 0.4, 0.3, 0.35, -0.125, -0.125, -0.225, 0, 0, 0);

        this.vs = new MyRectangle(this.scene, 0, -0.15, 0.15, -0.14, 0.16);
        this.vs.updateTexCoords(0.3, 0.3);
        this.vsTexture = new CGFtexture(this.scene, "scenes/images/vs_white.png");
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

                this.scene.registerForPick(11, this.player1Up);
                this.player1Up.display();
                this.scene.clearPickRegistration();
                
                this.scene.registerForPick(10, this.player1Down);
                this.player1Down.display();
                this.scene.clearPickRegistration();
                
                this.scene.registerForPick(21, this.player2Up);
                this.player2Up.display();
                this.scene.clearPickRegistration();
                
                this.scene.registerForPick(20, this.player2Down);
                this.player2Down.display();
                this.scene.clearPickRegistration();

                this.playerTextures[this.player1Texture].bind();
                this.player1.display();
                this.playerTextures[this.player1Texture].unbind();

                this.playerTextures[this.player2Texture].bind();
                this.player2.display();
                this.playerTextures[this.player2Texture].unbind();

                this.vsTexture.bind();
                this.vs.display();
                this.vsTexture.unbind();
                break;

            default:
                break;
        }

        this.scene.popMatrix();
    }
}