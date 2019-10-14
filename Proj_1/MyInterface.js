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

        // Retrieves the lights ids from the scene object to show as description in the interface
        this.lightNames = Object.keys(this.scene.lightIDs);
        this.folder = this.gui.addFolder(this.lightNames[this.scene.selectedLight] + ' Properties');
        this.folder.add(this.scene.lights[this.scene.selectedLight], 'enabled').name("Enabled");
    }

    /**
     *  Updates the name of the folder with the selected light properties
     */
    updateFolders() {
        // The old folder is removed
        this.gui.removeFolder(this.folder);
        // A new one is created with the 'enabled' property of the selected light
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