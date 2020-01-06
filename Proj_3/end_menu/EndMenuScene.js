var DEGREE_TO_RAD = Math.PI / 180;
var FPS_60 = 1000 / 60;

/**
 * EndMenuScene class, representing the scene that is to be rendered.
 */
class EndMenuScene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface, squexGame, gameScene, playerWon, rtt) {
        super();
        this.interface = myinterface;
        this.game = squexGame;
        this.gameScene = gameScene;
        this.playerWon = playerWon;
        this.player1 = gameScene.player1Dif;
        this.player2 = gameScene.player2Dif
        this.overviewRTT = rtt;
        this.replaying = false;
    }
    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.initCameras();
        this.initLights();
        this.enableTextures(true);
        this.setUpdatePeriod(FPS_60);
        
        this.gl.clearDepth(100.0);
        // No depth test is used because the menu is a GUI whit overlaping elements
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        
        // Enables mouse picking on the scene
        this.setPickEnabled(true);
        this.menu = new MyEndMenu(this, this.playerWon, this.overviewRTT);
    }
    /**
     * Initializes the scene camera
     * It is an ortho camera so everything appears to be in 2D
     */
    initCameras() {
        this.camera = new CGFcameraOrtho(-1.49, 1.5, -1, 1, 0.1, 500, vec3.fromValues(0, 0, 10), vec3.fromValues(0, 0.0001, 0), vec3.fromValues(0, 0, 1));
    }
    initLights() {
        this.lights[0].setPosition(0, 0, 2, 1);
        this.lights[0].setAmbient(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }
    setDefaultAppearance() {
        this.setAmbient(1, 1, 1, 1.0);
        this.setDiffuse(0, 0, 0, 1.0);
        this.setSpecular(0, 0, 0, 1.0);
        this.setShininess(10.0);
    }
    logPicking() {
        if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
                        var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
						this.menu.onClick(customId);						
					}
				}
				this.pickResults.splice(0, this.pickResults.length);
			}
		}
    }
    replay() {
        this.gameScene.replay();
        this.replaying = true;
    }
    rematch() {
        this.game.startGame(this.player1, this.player2);
    }
    exit() {
        this.game.startMenu();
    }
    update(t) {
        if (this.replaying) {
            this.gameScene.update(t);
        }
    }
    display() {
        if(this.replaying) {
            this.gameScene.display();
            if(this.gameScene.gameOrchestrator.gameEnded) {
                this.replaying = false;
            }
            return;
        }

        // Check for picking results
        this.logPicking();
        this.clearPickRegistration();
        // ---- BEGIN Background, camera setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation)
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.setDefaultAppearance();
        // Displaying the menu
        this.menu.display();
        this.popMatrix();
        // ---- END Background, camera setup
    }
}