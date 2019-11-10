/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Primitive id of the object
 * @param npartsU - Number of parts in U-axis (or X-axis)
 * @param npartsV - Number of parts in V-axis (or Y-axis)
 */
class MyPlane extends CGFobject {
	constructor(scene, id, npartsU, npartsV) {
        super(scene);
        
		this.npartsU = npartsU;
		this.npartsV = npartsV;

		this.initObject();
	}
    /**
	 * @method initObject
     * Creates the NURBS object with the specified atributes
     */
	initObject() {
        let degreeU = 1;
        let degreeV = 1;

        let controlPoints = [
            [[-0.5, 0, 0.5, 1], [-0.5, 0, -0.5, 1]],
            [[0.5, 0, 0.5, 1], [0.5, 0, -0.5, 1]]
        ];

        let surface = new CGFnurbsSurface(degreeU, degreeV, controlPoints);
        
        this.nurbObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, surface)
    }

    display() {
        this.nurbObject.display();
    }
}