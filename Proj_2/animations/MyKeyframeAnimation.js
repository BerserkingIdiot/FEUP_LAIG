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
        // Transformation matrix at each instant
        this.transfMatrix = mat4.create();
        // Keyframes to the left and to the right of the current instant
        this.leftKF = -1;
        this.rightKF = 0;
    }
    update(t) {
        // This first section adjusts the previous and next keyframes
        // according to the instant passed as argument.
        if(t > this.keyframes[this.rightKF].instant){
            while(true){
                this.leftKF++;
                this.rightKF++;
                if(t < this.keyframes[this.rightKF].instant){
                    break;
                }
            }
        }

        // Checking if we are using the first keyframe
        if(this.leftKF == -1){
            //TODO: add interpolation functions for v0
        } else {
            //TODO: add interpolation functions
        }
    }
    apply() {
        this.scene.multMatrix(this.transfMatrix);
    }
}