class MyGameScenes {
    constructor(scene) {
        this.scene = scene;
        // this.orchestrator = orchestrator;
        this.scenesInfo = [];
        this.currentScene = null;
        this.loaded = false;
        
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
        
        for(let i = 0; i < lines.length; i++) {
            let line = lines[i];
            line = line.replace(/\r/g, '');
            let values = line.split(' as ');
            let filename = values[0];
            let scenename = values[1];
            
            // The first scene is the default one
            if(i === 0) {
                this.currentScene = scenename;
            }
            
            this.scenesInfo[scenename] = filename;
        }
        
        // console.log('THIS: ');
        // console.log(this);
        // console.log('Scenes Info: ');
        // console.log(this.scenesInfo);
        // console.log('Current Scene: ' + this.currentScene);
    }
    changeScene(scenename) {
        this.currentScene = scenename;
        this.loaded = false;
    }
    displayScene() {
        if(!this.loaded) {
            this.graph = new MySceneGraph(this.scenesInfo[this.currentScene], this.scene);
            this.loaded = true;
        }

        this.graph.displayScene();        
    }
}