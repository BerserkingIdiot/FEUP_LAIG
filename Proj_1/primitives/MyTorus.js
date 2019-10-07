/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the primitive
 * @param inner - radius of the inner circumference of the torus
 * @param outer - Radius of the outer circumference of the torus
 * @param slices - Number of sections around the inner circumference
 * @param loops - Number of sections around the outer circumference
 */
class MyTorus extends CGFobject {
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // theta is the angle value around the inner circumference
        var theta = 0;
        // Each iteration theta will be incremented by 2*PI/slices
        var delta_theta = 2 * Math.PI / this.slices;
        // phi is the angle value of the outer circumference
        var phi = 0;
        // Each iteration z will be incremented by height/loops
        var delta_phi = 2 * Math.PI / this.loops;

        
        // Maximum number of vertices (used to display the last faces, which have to go from the end of the vertices array to the start)
        var max_vertices = this.slices * (this.loops + 1);

        for (var i = 0; i < this.slices; i++) {
            // X coordinate of current vertex
            var x = (this.outer + this.inner * Math.cos(theta)) * Math.cos(phi);
            // Y coordinate of current vertex
            var y = (this.outer + this.inner * Math.cos(theta)) * Math.sin(phi);
            // Z coordinate of current vertex
            var z = this.inner * Math.sin(theta);

            for (var j = 0; j < this.loops; j++) {
                this.vertices.push(x, y, z);
                // Calculating the normal
                var normal = [Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta)];
                // Normalizing th enormal vector
                normal = this.vectorNormalize(normal);
                this.normals.push(...normal);
                
                //At each iteration we push indices relative to the face composed by the next vertices
                this.indices.push (
                    ((this.loops + 1) * (i + 1) + j) % max_vertices, (this.loops + 1) * i + j, (this.loops + 1) * i + 1 + j,
                    ((this.loops + 1) * (i + 1) + 1 + j) % max_vertices , ((this.loops + 1) * (i + 1) + j) % max_vertices, (this.loops + 1) * i + 1 + j
                )

                // At each iteration we go further on the outer circumference
                phi += delta_phi;
                x = (this.outer + this.inner * Math.cos(theta)) * Math.cos(phi);
                y = (this.outer + this.inner * Math.cos(theta)) * Math.sin(phi);
            }

            //By stopping at j = loops we miss the last point
            this.vertices.push(x, y, z);
            var normal = [Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta)];
            
            normal = this.vectorNormalize(normal);
            this.normals.push(...normal);
            
            phi = 0;
            theta += delta_theta;
        }

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
}