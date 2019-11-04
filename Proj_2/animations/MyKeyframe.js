/**
 * MyKeyframe
 * All transformations are arrays with 3 coordinates.
 * E.G.: Translation = [DeltaX, DeltaY, DeltaZ]
 * @param orderNum - Order number of the keyframe
 * @param instant - Time instant when the keyframe should be applied
 * @param translation - Translation defined on the keyframe
 * @param rotation - Rotation defined on the keyframe
 * @param scale - Scale defined on the keyframe
*/
class MyKeyframe {
    constructor(orderNum, instant, translation, rotation, scale) {
        this.orderNum = orderNum;
        this.instant = instant;
        this.translation = translation;
        this.rotation = rotation;
        /* this.rotX = rotation[0];
        this.rotY = rotation[1];
        this.rotZ = rotation[2]; */
        this.scale = scale;
    }
}