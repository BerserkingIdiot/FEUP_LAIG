/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor(withGUI) {
        super();
        this.withGUI = withGUI
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        if(this.withGUI){
            this.gui = new dat.GUI();
        }

        this.initKeys();

        return true;
    }

    /**
     *  Handler to be called after scene has been inited to configure the interface
     */
    initInterface() {
        this.gui.destroy();
        this.gui = new dat.GUI();
        // Button to reset camera
        this.gui.add(this.scene, 'reset').name('Reset Camera');
        // Slider to rotate the camera. Rotation variable is used to reset the rotation angle back to 0 on camera reset
        this.rotation = this.gui.add(this.scene, 'rotationAngle', 0, 90).name('Rotate Camera').onChange(this.scene.rotateCamera.bind(this.scene));
        // Dropdown to control the active camera. Selected variable is used to reset to the original camera
        this.selected = this.gui.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Selected Cam');
        // Button to change themes
        let orchestrator = this.scene.gameOrchestrator;
        this.gui.add(orchestrator.themes, 'selectedScene', orchestrator.themes.sceneNames).name('Theme').onChange(orchestrator.themes.changeScene.bind(orchestrator.themes));

        // Folder holding all the lights
        this.lightsFolder = this.gui.addFolder('Lights');

        // Adding each light's enabled property to the folder
        var i = 0
        for (var key in this.scene.lightIDs) {
            this.lightsFolder.add(this.scene.lights[i], 'enabled').name(key);
            i++
        }
    }

    /**
     * Initializes the keyboard handlers
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}