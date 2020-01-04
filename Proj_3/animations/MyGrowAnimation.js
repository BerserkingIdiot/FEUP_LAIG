class MyGrowAnimation extends MyAnimation {
    constructor(scene, duration, initialSize, position) {
        super();

        this.scene = scene;
        this.duration = duration * 1000;
        this.initialSize = initialSize;
        // Current size starts as the initial size and will be interpolated on update() calls.
        // It will grow until it reachs the object's actual size (scaling of 1).
        this.currentSize = initialSize;
        this.finishedAnimation = false;
        // In order to scale any object, we first need to:
        // 1 - translate it to the origin
        // 2 - apply the desired scaling
        // 3 - translate it back to its starting position
        this.position = position;
        this.inverse_trans = this.calculateReverse(position);
    }
    /**
     * Calculates the reverse of a translation.
     * @method calculateReverse
     * @param {vec3 representing the axis translation form the origin} translation 
     */
    calculateReverse(translation) {
        let reverse = [];
        translation.forEach((value) => reverse.push(-value));

        return reverse;
    }
    update(t) {
        if (this.finishedAnimation) {
            return;
        }

        if (t >= this.duration) {
            this.currentSize =  this.finalSize;
            this.finishedAnimation = true;
        } else {
            //Linear interpolation of a multiplicative operation
            //Scurrent = r^(t - tprevious) + Sprevious
            //Where r = (tnext - tprevious) root (Snext / Sprevious)
            let r = Math.pow(1/ this.initialSize, 1 / this.duration)
            this.currentSize = Math.pow(r, this.duration) + this.initialSize;
        }
    }
    apply() {
        // The following operation translates the object back to its original position
        this.scene.translate(...this.position);
        // The following operation applies the actual scaling on the scene
        this.scene.scale(this.currentSize, this.currentSize, this.currentSize);
        // The following operation translates the object back to the origin
        this.scene.translate(...this.inverse_trans);
    }
}