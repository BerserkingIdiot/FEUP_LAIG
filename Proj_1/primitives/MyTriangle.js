/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the primitive
 * @param x1 - X coordinate of the first point
 * @param x2 - X coordinate of the second point
 * @param x3 - X coordinate of the third point
 * @param y1 - Y coordinate of the first point
 * @param y2 - Y coordinate of the second point
 * @param y3 - Y coordinate of the third point
 * @param z1 - Z coordinate of the first point
 * @param z2 - Z coordinate of the second point
 * @param z3 - Z coordinate of the third point
 */
class MyTriangle extends CGFobject {
    constructor(scene, id, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;

		this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
        ];
        
        //Counter-clockwise reference of vertices
		this.indices = [
            0, 1, 2
        ];
		
		//Vectors defined by the three points. A = [V1, V2]; B = [V2, V3]; C = [V3, V1]
		var vecA = [this.x2-this.x1, this.y2-this.y1, this.z2-this.z1];
		var vecB = [this.x3-this.x2, this.y3-this.y2, this.z3-this.z2];
		var vecC = [this.x1-this.x3, this.y1-this.y3, this.z1-this.z3];
		
		//In order to determine the normals we take two vectors and calculate their cross product
		//cross(A, B) = [ a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1 ]
        var norm = [
            vecA[1]*vecB[2]-vecA[2]*vecB[1],
            vecA[2]*vecB[0]-vecA[0]*vecB[2],
            vecA[0]*vecB[1]-vecA[1]*vecB[0]
		];
		//Normalizing the normal vector
		this.vectorNormalize(norm);

		this.normals = [
            ...norm,
            ...norm,
            ...norm
		];
		
        /*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		//Auxiliary calculations to determine internal angles
		var a = this.vectorNorm(vecA);
		var b = this.vectorNorm(vecB);
		var c = this.vectorNorm(vecC);
		//Alpha angle (angle on V1)
		var cos_alpha = (a*a - b*b + c*c)/ (2*a*c);
		var sin_alpha = Math.sqrt(1 - cos_alpha * cos_alpha);
		//Each vertex texCoords (aka default values) without texture scaling factors
		//These are global variables because we will need thenm to apply scaling on updateTexCoords()
		this.t1 = [0, 0];
		this.t2 = [a, 0];
		this.t3 = [c*cos_alpha, c*sin_alpha];
        
		this.texCoords = [
			...this.t1,
			...this.t2,
			...this.t3
		];
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	
	/**
	 * @method vectorNorm
     * Calculates the norm of a vector.
     * @param {array containing the coordinates} vec 
     */
    vectorNorm(vec) {
        if (!Array.isArray(vec)) {
            return vec;
        } else {
            var sum = 0;
            vec.forEach(element => {
                sum += element * element; // Acumulates the square of each coordinate
            });
            return Math.sqrt(sum); // The square root of the sum of the squares
        }
    }

    /**
	 * @method vectorNormalize
     * Normalizes a vector. Depends on vectorNorm().
     * @param {array containing the coordinates} vec 
     */
    vectorNormalize(vec) {
        if (!Array.isArray(vec)) {
            return vec;
        } else {
            var norm = this.vectorNorm(vec);
            vec[0] /= norm;
            vec[1] /= norm;
            vec[2] /= norm;
            return vec;
        }
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 * @param {Int} length_s - Scaling factor on texture's s axis
	 * @param {Int} length_t - Scaling factor on texture's s axis
	 */
	updateTexCoords(length_s, length_t) {
		//Updating the texture coordinates based on the default values
		this.texCoords = [
			...this.t1,
			this.t2[0] / length_s, this.t2[1],
			this.t3[0] / length_s, this.t3[1] / length_t
		];
		this.updateTexCoordsGLBuffers();
	}
}