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
            0, 2, 1
        ];
        
        /*In order to determine the normal we need the define 2 vectors and calculate their cross product
            */

        var norm = [
            (this.y3-this.y1)*(this.z2-this.z1)-(this.z3-this.z1)*(this.y2-this.y1),
            (this.z3-this.z1)*(this.x2-this.x1)-(this.x3-this.x1)*(this.z2-this.z1),
            (this.x3-this.x1)*(this.y2-this.y1)-(this.y3-this.y1)*(this.x2-this.x1)
        ];

		this.normals = [
            ...norm,
            ...norm,
            ...norm
        ];
        
        //TODO: Triangle texture coordinates
		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}