/**
 * @class MyGameScenes
 * Class that representes a set of xml defined scenes.
 * It loads the xml filenames from scenes/scenes.txt.
 * Loads the first one on file as the default.
 * Only loads another one when the user changes the current scene in the interface.
 */
class MyGameScenes {
    /**
     * @constructor
     * @param {refrence to XMLscene this belongs to} scene 
     */
    constructor(scene) {
        this.scene = scene;
        this.sceneFiles = [];
        this.totalScenes = 0;
        // The first scene is the default one
        this.currentScene = 0;

        // Interface related attributes
        this.sceneNames = [];
        this.selectedScene = null;

        this.loadFile();
    }
    /**
     * @method loadFile
     * Loads the scenes/scenes.txt file via AJAX.
     * Calls @method onFileLoad when the file is ready.
     */
    loadFile() {
        let request = new XMLHttpRequest();
        request.open('GET', './scenes/scenes.txt', true);

        request.onerror = () => alert('Error loading scenes file. Please check for file scenes/scenes.txt');
        this.onFileLoad.bind(this);
        request.onload = (evt) => this.onFileLoad(evt);

        request.send();
    }
    /**
     * @method onFileLoad
     * Reads the file and loads all filenames and associated scenenames.
     * Also counts the number of scenes defined.
     * Scene's filenames are saved in @member sceneFiles and scenenames in @member sceneNames .
     * Calls @method loadGraph to initialize the first scene.
     * 
     * @param {XMLHttpRequest onload event} event 
     */
    onFileLoad(event) {
        let fileText = event.target.responseText;
        let lines = fileText.split('\n');

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            line = line.replace(/\r/g, '');
            let values = line.split(' as ');
            let filename = values[0];
            let scenename = values[1];

            if (i === 0) {
                this.selectedScene = scenename;
            }

            this.sceneFiles[i] = filename;
            this.sceneNames[i] = scenename;
            this.totalScenes++;
        }

        // After reading the scenes file the first scene is loaded
        this.loadGraph();
    }
    /**
     * @method loadGraph
     * Loads a scene by constructing a MySceneGraph with the current selected scene.
     */
    loadGraph() {
        // First the display on scene is stoped
        this.scene.sceneInited = false;
        // Then the graph is loaded and it restarts the scene display
        this.graph = new MySceneGraph(this.sceneFiles[this.currentScene], this.scene);
    }
    /**
     * @method changeScene
     * Changes the current scene to the one passed as argument.
     * 
     * @param {new scene's name} scenename 
     */
    changeScene(scenename) {
        // Finds the scene on the scenes array
        let index = this.sceneNames.indexOf(scenename);
        // If the scene is found then it is loaded
        if (index != -1) {
            this.currentScene = index;
            this.loadGraph();
        }
    }
    /**
     * @method display
     * Displays the current scene graph.
     */
    display() {
        this.graph.displayScene();
    }
}