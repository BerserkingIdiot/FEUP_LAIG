var DEGREE_TO_RAD = Math.PI / 180;

/**
 * MainMenuScene class, representing the scene that is to be rendered.
 */
class MainMenuScene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();
        this.interface = myinterface;
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
        
        this.gl.clearDepth(100.0);
        // No depth test is used because the menu is a GUI whit overlaping elements
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        
        // Enables mouse picking on the scene
        this.setPickEnabled(true);
        // this.axis = new CGFaxis(this);
        this.menu = new MyMainMenu(this);
    }
    /**
     * Initializes the scene camera
     * It is an ortho camera so everything appears to be in 2D
     */
    initCameras() {
        this.camera = new CGFcameraOrtho(-1.5, 1.5, -1, 1, 0.1, 500, vec3.fromValues(0, 0, 10), vec3.fromValues(0, 0.0001, 0), vec3.fromValues(0, 0, 1));
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
        // console.log('picker called');
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
    display() {
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