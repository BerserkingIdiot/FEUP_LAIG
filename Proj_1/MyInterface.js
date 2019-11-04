/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.initKeys();

        return true;
    }

    /**
     *  Handler to be called after scene has been inited to configure the interface
     */
    initInterface() {
        // Dropdown to control the active camera
        this.gui.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Selected View').onChange(this.scene.changeCamera.bind(this.scene));

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