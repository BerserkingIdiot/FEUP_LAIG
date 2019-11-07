/**
 * MyKeyframeAnimation
 * Extends MyAnimation and implements a keyframe based animation.
 * @param scene - Reference to XMLScene object
 * @param id - ID of the animation
 * @param numKF - Number of keyframes used on the animation
 * @param keyframes - Array with MyKeyframe objects
*/
class MyKeyframeAnimation extends MyAnimation {
    constructor(scene, id, numKF, keyframes){
        super();
        this.scene = scene;
        this.id = id;
        this.numKF = numKF;
        this.keyframes = keyframes;
        // Keyframe 0 is added at the start of the array
        this.keyframes.unshift(new MyKeyframe(0, 0, [0, 0, 0], [0, 0, 0], [1, 1, 1]));
        // Transformation matrix at each instant
        this.transfMatrix = mat4.create();
        // Keyframes to the left (previous) and to the right (next) of the current instant
        this.leftKF = 0;
        this.rightKF = 1;
    }
    /**
     * Updates the transformation matrix according with the elapsed time
     * @param {elapsed time since the scene has been initiated} t
     */
    update(t) {
        // This first section adjusts the previous and next keyframes
        // according to the instant passed as argument.
        while(this.rightKF < this.numKF && t > this.keyframes[this.rightKF].instant){
            this.leftKF++;
            this.rightKF++;
        }

        var translation;
        var rotation;
        var scale;

        if(t >= this.keyframes[this.numKF].instant){
            translation = this.keyframes[this.numKF].translation;
            rotation = this.keyframes[this.numKF].rotation;
            scale = this.keyframes[this.numKF].scale;
        }
        else if(t == 0){
            translation = this.keyframes[0].translation;
            rotation = this.keyframes[0].rotation;
            scale = this.keyframes[0].scale;
        }
        else {
            translation = this.interpolateTranslation(t);
            rotation = this.interpolateRotation(t);
            scale = this.interpolateScale(t);
        }

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

        for(var i = 0; i < 3; i++){
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

        for(var i = 0; i < 3; i++){
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

        for(var i = 0; i < 3; i++){
            var r = Math.pow(this.keyframes[this.rightKF].scale[i] / this.keyframes[this.leftKF].scale[i], 1/(this.keyframes[this.rightKF].instant - this.keyframes[this.leftKF].instant));
            scale[i] = Math.pow(r, t - this.keyframes[this.leftKF].instant) * this.keyframes[this.leftKF].scale[i];
        }

        return scale;
    }
}