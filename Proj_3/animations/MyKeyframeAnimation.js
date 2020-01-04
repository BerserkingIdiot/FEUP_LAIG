/**
 * MyKeyframeAnimation
 * Extends MyAnimation and implements a keyframe based animation.
 * @param scene - Reference to scene object
 * @param id - ID of the animation
 * @param keyframes - Array with MyKeyframe objects
*/
class MyKeyframeAnimation extends MyAnimation {
    constructor(scene, id, keyframes) {
        super();
        this.scene = scene;
        this.id = id;
        this.numKF = keyframes.length;
        this.keyframes = keyframes;
        // Keyframe 0 is added at the start of the array
        this.keyframes.unshift(new MyKeyframe(0, 0, [0, 0, 0], [0, 0, 0], [1, 1, 1]));
        // Transformation matrix at each instant
        this.transfMatrix = mat4.create();
        // Keyframes to the left (previous) and to the right (next) of the current instant
        this.leftKF = 0;
        this.rightKF = 1;
        //Indicates the end of the animation
        this.finishedAnimation = false;
    }
    /**
     * Updates the transformation matrix according with the elapsed time
     * @param {elapsed time since the scene has been initiated} t
     */
    update(t) {
        if (this.finishedAnimation) {
            return;
        }
        // This first section adjusts the previous and next keyframes
        // according to the instant passed as argument.
        while (this.rightKF < this.numKF && t > this.keyframes[this.rightKF].instant) {
            this.leftKF++;
            this.rightKF++;
        }

        var translation;
        var rotation;
        var scale;

        //If t has surpassed the last keyframe, its transformation is always applied
        if (t >= this.keyframes[this.numKF].instant) {
            translation = this.keyframes[this.numKF].translation;
            rotation = this.keyframes[this.numKF].rotation;
            scale = this.keyframes[this.numKF].scale;
            this.finishedAnimation = true;
        }
        //If t corresponds to the left keyframe's instant then it applies its transformation (preventing a division by 0 on interpolations)
        else if (t == this.leftKF) {
            translation = this.keyframes[this.leftKF].translation;
            rotation = this.keyframes[this.leftKF].rotation;
            scale = this.keyframes[this.leftKF].scale;
        }
        //Otherwise, the transformation is interpolated from the left and right keyframes
        else {
            translation = this.interpolateTranslation(t);
            rotation = this.interpolateRotation(t);
            scale = this.interpolateScale(t);
        }

        // Apply all transformations to a new matrix
        this.transfMatrix = mat4.create();
        this.transfMatrix = mat4.translate(this.transfMatrix, this.transfMatrix, translation);
        this.transfMatrix = mat4.rotateX(this.transfMatrix, this.transfMatrix, rotation[0]);
        this.transfMatrix = mat4.rotateY(this.transfMatrix, this.transfMatrix, rotation[1]);
        this.transfMatrix = mat4.rotateZ(this.transfMatrix, this.transfMatrix, rotation[2]);
        this.transfMatrix = mat4.scale(this.transfMatrix, this.transfMatrix, scale);
    }
    /**
     * Applies the transformation matrix to the scene
     */
    apply() {
        this.scene.multMatrix(this.transfMatrix);
    }
    /**
     * Calculates the current transformation value depending on the elapsed time
     * @param {elapsed time since the scene has been initiated} t
     */
    interpolateTranslation(t) {
        var translation = [];

        //Linear interpolation of an additive operation
        //Tcurrent = (Tnext - Tprevious) / (tnext - tprevious) * (t - tprevious) + Tprevious
        for (var i = 0; i < 3; i++) {
            translation[i] = (this.keyframes[this.rightKF].translation[i] - this.keyframes[this.leftKF].translation[i]) /
                (this.keyframes[this.rightKF].instant - this.keyframes[this.leftKF].instant) * (t - this.keyframes[this.leftKF].instant) + this.keyframes[this.leftKF].translation[i];
        }

        return translation;
    }
    /**
     * Calculates the current rotation value depending on the elapsed time
     * @param {elapsed time since the scene has been initiated} t
     */
    interpolateRotation(t) {
        var rotation = [];

        //Linear interpolation of an additive operation
        //Rcurrent = (Rnext - Rprevious) / (tnext - tprevious) * (t - tprevious) + Rprevious
        for (var i = 0; i < 3; i++) {
            rotation[i] = (this.keyframes[this.rightKF].rotation[i] - this.keyframes[this.leftKF].rotation[i]) /
                (this.keyframes[this.rightKF].instant - this.keyframes[this.leftKF].instant) * (t - this.keyframes[this.leftKF].instant) + this.keyframes[this.leftKF].rotation[i];
        }

        return rotation;
    }
    /**
     * Calculates the current scale value depending on the elapsed time
     * @param {elapsed time since the scene has been initiated} t
     */
    interpolateScale(t) {
        var scale = [];

        //Linear interpolation of a multiplicative operation
        //Scurrent = r^(t - tprevious) + Sprevious
        //Where r = (tnext - tprevious) root (Snext / Sprevious)
        for (var i = 0; i < 3; i++) {
            var r = Math.pow(this.keyframes[this.rightKF].scale[i] / this.keyframes[this.leftKF].scale[i], 1 / (this.keyframes[this.rightKF].instant - this.keyframes[this.leftKF].instant));
            scale[i] = Math.pow(r, t - this.keyframes[this.leftKF].instant) * this.keyframes[this.leftKF].scale[i];
        }

        return scale;
    }
}