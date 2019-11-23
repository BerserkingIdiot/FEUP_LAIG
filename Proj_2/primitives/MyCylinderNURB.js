/**
 * MyCylinderNURB
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the primitive
 * @param base - Radius of the base (Z = 0)
 * @param top - Radius of the top (Z = height)
 * @param height - Size along the positive z axis
 * @param slices - Number of sections around the circunferences
 * @param stacks - Number of divisions along the z axis
 */
class MyCylinderNURB extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);
        
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.initObject();
	}
    /**
	 * @method initObject
     * Creates the NURBS object with the specified atributes
     */
	initObject() {
        let degreeU = 1;
        let degreeV = 3;

        let controlPoints = this.arrangeControlPoints();

        let surface = new CGFnurbsSurface(degreeU, degreeV, controlPoints);
        

        this.nurbObject = new CGFnurbsObject(this.scene, this.slices * 2, this.stacks * 2, surface)
    }
    /**
	 * @method arrangeControlPoints
     * Arranges an array of control points according to U and V degrees.
     * The returned array is a valid CGFnurbsSurface 3rd argument.
     */
    arrangeControlPoints() {
        let pointsU = [];
        let pointsV = [];
        
        pointsV.push([-this.base, 0, 0, 1]);
        pointsV.push([-this.base, ((4.0*this.base)/3.0), 0, 1]);
        pointsV.push([this.base, ((4.0*this.base)/3.0), 0, 1]);
        pointsV.push([this.base, 0, 0, 1]);
        pointsU.push(pointsV);

        pointsV = [];
        pointsV.push([-this.top, 0, this.height, 1]);
        pointsV.push([-this.top, ((4.0*this.top)/3.0), this.height, 1]);
        pointsV.push([this.top, ((4.0*this.top)/3.0), this.height, 1]);
        pointsV.push([this.top, 0, this.height, 1]);
        pointsU.push(pointsV);

        return pointsU;
    }

    display() {
        // Only half of the cylinder is modeled as a NURB
        this.nurbObject.display();

        // Therefore, it needs to be displayed again rotated 180º around the Z axis
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.nurbObject.display();
        this.scene.popMatrix();
    }
}