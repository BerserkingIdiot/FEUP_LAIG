/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the primitive
 * @param base - Radius of the base (Z = 0)
 * @param top - Radius of the top (Z = height)
 * @param height - Size along the positive z axis
 * @param slices - Number of sections around the circunferences
 * @param stacks - Number of divisions along the z axis
 */
class MyCylinder extends CGFobject {
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Alpha is the angle value around the circuference, starting at x axis
        var alpha = 0;
        // Each iteration alpha will be incremented by 2*PI/slices
        var delta_alpha = 2 * Math.PI / this.slices;

        var z = 0;
        // Each iteration z will be incremented by height/stacks
        var delta_z = this.height / this.stacks;
        // Radius of each circunference
        var radius = this.base;
        // Each iteration the base radius becomes closer to the top radius by a rate of (top - base)/stacks
        var delta_r = (this.top - this.base) / this.stacks;
        // Maximum number of vertices (used to display the last faces, which have to go from the end of the vertices array to the start)
        var lineOffset = (this.stacks + 1);

        for (var i = 0; i <= this.slices; i++) {
            // X coordinate of current vertex
            var x = Math.cos(alpha) * radius;
            // Y coordinate of current vertex
            var y = Math.sin(alpha) * radius;
            // The normal vector at each point of the circunference is:
            // N = [(x, y, z) - (0, 0, z)]; which still has to be normalized
            // When considering the inclination of the faces (due to different base and top radius)
            // N has to be rotated around the x axis, which means its z coordinate will change to
            // Nz = tg(inclination) * |N| = (base - top) / height * |N|
            var normal = [x, y, 0];
            normal[2] = (this.base - this.top) / this.height * this.vectorNorm(normal);
            // Normalizing the vector; this vector is the same for the current side 'edge'
            normal = this.vectorNormalize(normal);

            for (var j = 0; j < this.stacks; j++) {
                this.vertices.push(x, y, z);
                this.normals.push(...normal);
                
                //At each iteration we push indices relative to the face composed by the next vertices
                if(i != this.slices) {
                    this.indices.push(
                        lineOffset * i + 1 + j, lineOffset * i + j, lineOffset * (i + 1) + j,
                        lineOffset * i + 1 + j, lineOffset * (i + 1) + j, lineOffset * (i + 1) + 1 + j
                    );
                    console.log("Inidice: (" +  (lineOffset * i + 1 + j) + "," + (lineOffset * i + j) + "," + (lineOffset * (i + 1) + j) + ")");
                    console.log("Inidice: (" +  (lineOffset * i + 1 + j) + "," + (lineOffset * (i + 1) + j) + "," + (lineOffset * (i + 1) + 1 + j) + ")");
                }


                // At each iteration we go up on the z axis and closer to top radius
                z += delta_z;
                radius += delta_r;
                x = Math.cos(alpha) * radius;
                y = Math.sin(alpha) * radius;
            }

            //By stopping at j = stacks we miss the last point (the one on the top circunference)
            this.vertices.push(x, y, z);
            this.normals.push(...normal);
            
            z = 0;
            radius = this.base;
            alpha += delta_alpha;
        }

        //TODO: texture coords

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

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

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the cylinder
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}