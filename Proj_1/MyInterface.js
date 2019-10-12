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

        // Dropdown to select the light to be controled
        this.gui.add(this.scene, 'selectedLight', this.scene.lightIDs).name('Selected Light').onChange(this.updateFolders.bind(this));

        // Lights' names
        this.lightNames = Object.keys(this.scene.lightIDs);
        this.folder = this.gui.addFolder(this.lightNames[this.scene.selectedLight] + ' Properties');
        this.folder.add(this.scene.lights[this.scene.selectedLight], 'enabled').name("Enabled");

        // a folder for grouping parameters for one of the lights
        // var f0 = this.gui.addFolder('Light 0 ');
        // f0.add(this.scene.lights[0], 'enabled').name("Enabled");
        // // a subfolder for grouping only the three coordinates of the light
        // var sf0 = f0.addFolder('Light 0 Position');
        // sf0.add(this.scene.lights[0].position, '0', -5.0, 5.0).name("X Position");
        // sf0.add(this.scene.lights[0].position, '1', -5.0, 5.0).name("Y Position");
        // sf0.add(this.scene.lights[0].position, '2', -5.0, 5.0).name("Z Position");
    }

    /**
     *  Updates the name of the folder with the selected light properties
     */
    updateFolders() {
        this.gui.removeFolder(this.folder);

        this.folder = this.gui.addFolder(this.lightNames[this.scene.selectedLight] + ' Properties');
        this.folder.add(this.scene.lights[this.scene.selectedLight], 'enabled').name("Enabled");
    }

    /**
     * Initializes the keyboard handlers
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}