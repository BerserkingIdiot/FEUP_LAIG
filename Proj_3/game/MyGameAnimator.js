class MyGameAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;
        this.startTime = 0;
        this.object = null;
        this.type = null;
        this.animation = null;
        this.currentDuration = 0;
        this.playing = false;

        this.arcDuration = 1;
        this.growDuration = 0.5;
        this.dropDuration = 1;
    }
    reset() {
        this.startTime = 0;
        this.object = null;
        this.type = null;
        this.animation = null;
        this.playing = false;
    }
    start(t, type, obj) {
        this.startTime = t;
        this.object = obj;
        this.playing = true;
        this.type = type;
        
        switch (type) {
            case 'arc':
                // object is a MyGameMove object
                this.currentDuration = this.arcDuration;
                let {midpoint, axis, angle} = this.calculateValues(obj);
                this.animation = new MyArcAnimation(this.scene, this.arcDuration, angle, axis, midpoint);
                break;

            case 'grow':
                // object is an array of MySquarePiece objects
                this.currentDuration = this.growDuration;
                this.animation = [];
                for(let i = 0; i < obj.length; i++) {
                    let coords = obj[i].getCoords();
                    let position = vec3.fromValues(coords['x'] + 1, 0, coords['y'] + 1);
                    console.log(position);
                    this.animation.push(new MyGrowAnimation(this.scene, this.growDuration, 0.1, position));
                }
                break;

            case 'drop':
                // object is a MyGamePiece object
                this.currentDuration = this.dropDuration;
                this.animation = new MyDropAnimation(this.scene, this.dropDuration, 7, 0);
                break;
                
            // If no type is specified or it is invalid, a Drop animation is used
            default:
                // object is a MyGamePiece object
                this.type = 'drop';
                this.currentDuration = this.dropDuration;
                this.animation = new MyDropAnimation(this.scene, this.dropDuration, 7, 0);
                break;
        }
    }
    calculateValues(move) {
        // Source and destination coordinates
        let piece = move.piece.getCoords();
        let src = [];
        src['x'] = piece['x'] + 0.5;
        src['y'] = piece['y'] + 0.5;
        let tile = move.destination.getCoords();
        let dest = [];
        dest['x'] = tile['x'] + 0.5;
        dest['y'] = tile['y'] + 0.5;
        
        //Midpoint of the segment
        let dx = dest['x'] - src['x'];
        let dy = dest['y'] - src['y'];
        let midX = src['x'] + dx / 2.0;
        let midY = src['y'] + dy / 2.0;
        let midpoint = vec3.fromValues(midX, 0, midY);

        //Perpendicular axis
        let axis = vec3.fromValues(-dy, 0, dx);

        //Rotation angle
        let angle = dx > 0 ? (-175 * Math.PI / 180) : (175 * Math.PI / 180);

        return {midpoint, axis, angle};
    }
    update(t) {
        if(this.playing){
            let deltaT = t - this.startTime;
    
            if(deltaT < this.currentDuration * 1000)
                if(this.type === 'grow') {
                    for(let i = 0; i < this.animation.length; i++) {
                        this.animation[i].update(t - this.startTime);
                    }
                } else {
                    this.animation.update(t - this.startTime);
                }
            else{
                this.orchestrator.onAnimationOver(this.type);
                this.reset();
            }
        }
    }
    displayType() {
        if(this.type === 'grow') {
            for(let i = 0; i < this.object.length; i++) {
                this.scene.pushMatrix();
                this.animation[i].apply();
                this.object[i].display();
                this.scene.popMatrix();
            }
        } else {
            this.animation.apply();
            this.object.display();
        }
    }
    display() {
        if(this.playing) {
            this.scene.pushMatrix();
            this.displayType();
            this.scene.popMatrix();
        }
    }
}