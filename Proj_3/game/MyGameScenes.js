class MyGameScenes {
    constructor(scene) {
        this.scene = scene;
        // this.orchestrator = orchestrator;
        this.sceneFiles = [];
        this.totalScenes = 0;
        // The first scene is the default one
        this.currentScene = 0;

        // Interface related attributes
        this.sceneNames = [];
        this.selectedScene = null;

        this.loadFile();
    }
    loadFile() {
        let request = new XMLHttpRequest();
        request.open('GET', './scenes/scenes.txt', true);

        request.onerror = () => alert('Error loading scenes file. Please check for file scenes/scenes.txt');
        this.onFileLoad.bind(this);
        request.onload = (evt) => this.onFileLoad(evt);

        request.send();
    }
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
    loadGraph() {
        // First the display on scene is stoped
        this.scene.sceneInited = false;
        // Then the graph is loaded and it restarts the scene display
        this.graph = new MySceneGraph(this.sceneFiles[this.currentScene], this.scene);
    }
    changeScene(scenename) {
        // Finds the scene on the scenes array
        let index = this.sceneNames.indexOf(scenename);
        // If the scene is found then it is loaded
        if (index != -1) {
            this.currentScene = index;
            this.loadGraph();
        }
    }
    display() {
        if (this.graph.displayOk) {
            this.graph.displayScene();
        }
    }
}