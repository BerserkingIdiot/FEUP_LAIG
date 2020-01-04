class MyGameAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;
        this.startTime = 0;
        this.object = null;
        this.type = null;
        this.animation = null;
        this.playing = false;

        this.finalInstant = 1;
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
                let {midpoint, axis, angle} = this.calculateValues(this.object);
                this.animation = new MyArcAnimation(this.scene, this.finalInstant, angle, axis, midpoint);
                break;

            case 'grow':
                this.animation = [];
                for(let i = 0; i < obj.length; i++) {
                    let coords = obj[i].getCoords();
                    let position = vec3.fromValues(coords['x'], 0, coords['y']);
                    this.animation.push(new MyGrowAnimation(this.scene, this.finalInstant, 0.1, position));
                }
                break;

            case 'drop':
                this.createDropAnimation();
                break;
                
            // If no type is specified or it is invalid, a Drop animation is used
            default:
                this.createDropAnimation();
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
    
            if(deltaT < this.finalInstant * 1000)
                this.animation.update(t - this.startTime);
            else{
                this.orchestrator.onAnimationOver();
                this.object.onAnimationOver();
                this.reset();
            }
        }
    }
    displayType() {
        switch (this.type) {
            // Grow animations can be called on an array of square pieces
            case 'grow':
                for(let i = 0; i < this.object.length; i++) {
                    this.animation[i].apply();
                    this.object[i].display();
                }
                break;
                
            // Both arc and drop animations are called on a single object
            default:
                this.animation.apply();
                this.object.display();
                break;
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