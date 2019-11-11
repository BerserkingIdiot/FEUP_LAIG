/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Primitive id of the object
 * @param npartsU - Number of parts in U-axis (or X-axis)
 * @param npartsV - Number of parts in V-axis (or Y-axis)
 * @param points - Array containing all the points (arrays) of the object
 */
class MyPatch extends CGFobject {
	constructor(scene, id, npointsU, npointsV, npartsU, npartsV, points) {
        super(scene);
        
		this.npointsU = npointsU;
		this.npointsV = npointsV;
		this.npartsU = npartsU;
		this.npartsV = npartsV;
		this.points = points;

		this.initObject();
	}
    /**
	 * @method initObject
     * Creates the NURBS object with the specified atributes
     */
	initObject() {
        let degreeU = this.npointsU - 1;
        let degreeV = this.npointsV - 1;

        let controlPoints = this.arrangeControlPoints();

        let surface = new CGFnurbsSurface(degreeU, degreeV, controlPoints);
        
        this.nurbObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, surface)
    }
    /**
	 * @method arrangeControlPoints
     * Arranges an array of control points according to U and V degrees.
     * The returned array is a valid CGFnurbsSurface 3rd argument.
     */
    arrangeControlPoints() {
        let pointsU = [];
        let pointsIndex = 0;

        for (let u = 0; u < this.npointsU; u++) {
            let pointsV = [];
            for (let v = 0; v < this.npointsV; v++) {
                pointsV.push([...this.points[pointsIndex], 1]);
                pointsIndex++;
            }
            pointsU.push(pointsV);
        }

        return pointsU;
    }

    display() {
        this.nurbObject.display();
    }
}