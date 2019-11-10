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
        let degreeU = this.slices;
        let degreeV = this.stacks;

        let controlPoints = this.arrangeControlPoints();

        let surface = new CGFnurbsSurface(degreeU, degreeV, controlPoints);
        
        this.nurbObject = new CGFnurbsObject(this.scene, this.slices, this.stacks, surface)
    }
    /**
	 * @method arrangeControlPoints
     * Arranges an array of control points according to U and V degrees.
     * The returned array is a valid CGFnurbsSurface 3rd argument.
     */
    arrangeControlPoints() {
        let pointsU = [];

        // Alpha is the angle value around the circuference, starting at x axis
        let alpha = 0;
        // Each iteration alpha will be incremented by 2*PI/slices
        let delta_alpha = 2 * Math.PI / this.slices;

        let z = 0;
        // Each iteration z will be incremented by height/stacks
        let delta_z = this.height / this.stacks;
        // Radius of each circunference
        let radius = this.base;
        // Each iteration the base radius becomes closer to the top radius by a rate of (top - base)/stacks
        let delta_r = (this.top - this.base) / this.stacks;

        for (let u = 0; u <= this.slices; u++) {
            let pointsV = [];
            // X coordinate of current vertex
            let x = Math.cos(alpha) * radius;
            // Y coordinate of current vertex
            let y = Math.sin(alpha) * radius;
            for (let v = 0; v < this.stacks; v++) {
                pointsV.push([x, y, z, 1]);
                // At each iteration we go up on the z axis and closer to top radius
                z += delta_z;
                radius += delta_r;
                x = Math.cos(alpha) * radius;
                y = Math.sin(alpha) * radius;
            }
            //By stopping at j = stacks we miss the last point (the one on the top circunference)
            pointsV.push([x, y, z, 1]);
            pointsU.push(pointsV);

            z = 0;
            radius = this.base;
            alpha += delta_alpha;
        }


        return pointsU;
    }

    display() {
        this.nurbObject.display();
    }
}