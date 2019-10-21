/**
 * MyKeyframeAnimation
 * Extends MyAnimation and implements a keyframe based animation.
 * @param scene - Reference to XMLScene object
 * @param id - ID of the animation
 * @param numKF - Number of keyframes used on the animation
 * @param keyframes - Array with 
*/
class MyKeyframeAnimation extends MyAnimation {
    constructor(scene, id, numKF, keyframes){
        this.scene = scene;
        this.id = id;
        this.numKF = numKF;
        this.keyframes = keyframes;
        this.transfMatrix = mat4.create();
    }
    update(t) {

    }
    apply() {
        this.scene.multMatrix(this.transfMatrix);
    }
}