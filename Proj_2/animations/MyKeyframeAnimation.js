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
    update(t) {
        // This first section adjusts the previous and next keyframes
        // according to the instant passed as argument.
        if(t > this.keyframes[this.rightKF].instant){
            do{
                this.leftKF++;
                this.rightKF++;
            }while(t > this.keyframes[this.rightKF].instant);
        }

        var translation = interpolateTranslation(t);
        var rotation = interpolateRotation(t);
        var scale = interpolateScale(t);

        this.transfMatrix = mat4.scale(transfMatrix, transfMatrix, scale);
        this.transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, rotation[0]);
        this.transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, rotation[1]);
        this.transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, rotation[2]);
        this.transfMatrix = mat4.translate(transfMatrix, transfMatrix, translation);
    }
    apply() {
        this.scene.multMatrix(this.transfMatrix);
    }
    interpolateTranslation(t) {
        var translation = [];

        for(var i = 0; i < 3; i++){
            translation[i] = (this.keyframes[this.rightKF].translation[i] - this.keyframes[this.leftKF].translation[i]) /
                (this.keyframes[this.rightKF].instant - this.keyframes[this.leftKF].instant) * (t - this.keyframes[this.leftKF].instant) + this.keyframes[this.leftKF].instant;
        }
        
        return translation;
    }
    interpolateRotation(t) {
        var rotation = [];

        for(var i = 0; i < 3; i++){
            rotation[i] = (this.keyframes[this.rightKF].rotation[i] - this.keyframes[this.leftKF].rotation[i]) /
                (this.keyframes[this.rightKF].instant - this.keyframes[this.leftKF].instant) * (t - this.keyframes[this.leftKF].instant) + this.keyframes[this.leftKF].instant;
        }
        
        return rotation;
    }
    interpolateScale(t) {
        var scale = [];

        for(var i = 0; i < 3; i++){
            var r = Math.pow(this.keyframes[this.rightKF].scale[i] / this.keyframes[this.leftKF].scale[i], 1/this.keyframes[this.rightKF].instant);
            scale[i] = Math.pow(r, t); //FIXME: this does not seem right
        }

        return scale;
    }
}