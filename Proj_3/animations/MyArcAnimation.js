/**
 *  @class MyArcAnimation
 *  @description Represents and applies an arc shaped keyframe animation.
 * 
 *  In order to place pieces on the board, they have to be animated.
 *  KeyframeAnimation does not allow a specific rotation axis to be chosen.
 *  ArcAnimation makes use of all KeyframeAnimation methods, but allowing a custom vertical axis for rotation.
 */
class MyArcAnimation extends MyKeyframeAnimation {
    /**
     * @constructor
     * @param {XMLscene object to whom this animation belongs to} scene 
     * @param {this animation id} id 
     * @param {array of MyKeyframe objects} keyframes 
     * @param {vec3 axis to rotate around} axis 
     * @param {vec3 axis translation from origin} displacement 
     */
    constructor(scene, id, keyframes, axis, displacement) {
        super(scene, id, keyframes);

        // In order to rotate around any axis, we first need to:
        // 1 - rotate it to one of the three main axis
        // 2 - apply the desired rotation on that main axis
        // 3 - do the inverse rotation of 1
        // We chose z-axis as our main axis
        this.alpha_x = 0;
        this.alpha_y = 0;
        this.calculateRotations(axis);
        // If the axis is translated from the origin,
        // we first need to translate it back to the origin
        // and after the rotation is applied translate it back to where it was initially
        this.displacement = displacement;
        this.inverse_disp = this.calculateReverse(displacement);
    }
    /**
     * Calculates the necessary rotations to rotate any axis to the z-axis
     * @method calculateRotations
     * @param {vec3 representing the axis of rotation} axis 
     */
    calculateRotations(axis) {
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        let dxz = Math.sqrt(x*x + z*z);
        let dyz = Math.sqrt(y*y + z*z);

        if(x > 0){
            this.alpha_y = - Math.acos(z/dxz);
        } else {
            this.alpha_y = Math.acos(z/dxz);
        }

        if(y < 0){
            this.alpha_x = - Math.acos(z/dyz);
        } else {
            this.alpha_x = Math.acos(z/dyz);
        }

        console.log('alpha_x: ' + this.alpha_x * 180 / Math.PI);
        console.log('alpha_y: ' + this.alpha_y * 180 / Math.PI);
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
    apply() {
        this.scene.translate(...this.displacement);
        this.scene.rotate(-this.alpha_y, 0, 1, 0);
        this.scene.rotate(-this.alpha_x, 1, 0, 0);
        super.apply();
        this.scene.rotate(this.alpha_x, 1, 0, 0);
        this.scene.rotate(this.alpha_y, 0, 1, 0);
        this.scene.translate(...this.inverse_disp);
    }
}