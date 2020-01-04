class MyDropAnimation extends MyAnimation {
    constructor(scene, duration, initialHeight, finalHeight) {
        super();

        this.scene = scene;
        this.duration = duration * 1000;
        this.initialHeight = initialHeight;
        this.finalHeight = finalHeight;
        // Current height starts as the initial height and will be interpolated on update() calls.
        // It will drop until it reachs the object's actual height (finalHeight).
        this.currentHeight = initialHeight;
        this.finishedAnimation = false;
    }
    update(t) {
        if (this.finishedAnimation) {
            return;
        }

        if (t >= this.duration) {
            this.currentHeight =  this.finalHeight;
            this.finishedAnimation = true;
        } else {
           //Linear interpolation of an additive operation
            //Tcurrent = (Tnext - Tprevious) / (tnext - tprevious) * (t - tprevious) + Tprevious
            this.currentHeight = (this.finalHeight - this.initialHeight) / this.duration * t + this.initialHeight;
        }
    }
    apply() {
        // The following operation applies the actual scaling on the scene
        this.scene.translate(0, this.currentHeight, 0);
    }
}