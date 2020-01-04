/**
 *  @class MyArcAnimation
 *  @description Represents and applies an arc shaped animation.
 * 
 *  In order to place pieces on the board, they have to be animated.
 *  KeyframeAnimation does not allow a specific rotation axis to be chosen.
 *  ArcAnimation makes implements MyAnimation methods, allowing a custom vertical axis for rotation.
 */
class MyArcAnimation extends MyAnimation {
    /**
     * @constructor
     * @param {XMLscene object to whom this animation belongs to} scene 
     * @param {duration of the animation in seconds} duration
     * @param {angle of the rotation} angle
     * @param {vec3 axis to rotate around} axis 
     * @param {vec3 axis translation from origin} displacement 
     */
    constructor(scene, duration, angle, axis, displacement) {
        super();

        this.scene = scene;
        this.duration = duration * 1000;
        this.angle = angle;
        // Current angle starts at 0 and will be interpolated on update() calls
        this.currentAngle = 0;
        this.finishedAnimation = false;
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
            this.currentAngle =  this.angle;
            this.finishedAnimation = true;
        } else {
            //Linear interpolation of an additive operation
            //Rcurrent = (Rnext - Rprevious) / (tnext - tprevious) * (t - tprevious) + Rprevious
            this.currentAngle = this.angle / this.duration * t
        }
    }
    apply() {
        // This 3 operations shift the rotation axis to its original position
        this.scene.translate(...this.displacement);
        this.scene.rotate(-this.alpha_y, 0, 1, 0);
        this.scene.rotate(-this.alpha_x, 1, 0, 0);
        // The following operation applies the actual rotation on the scene
        this.scene.rotate(this.currentAngle, 0, 0, 1);
        // This 3 operations shift the rotation axis to the z-axis
        this.scene.rotate(this.alpha_x, 1, 0, 0);
        this.scene.rotate(this.alpha_y, 0, 1, 0);
        this.scene.translate(...this.inverse_disp);
    }
}