/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the primitive
 * @param base - Radius of the base (Z = 0)
 * @param top - Radius of the top (Z = height)
 * @param height - Size along the positive z axis
 * @param slices - Number of sections around the circunferences
 * @param loops - Number of divisions along the z axis
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
            // The normal vector at each point of the circunference is:
            // N = [(x, y, z) - (0, 0, z)]; which still has to be normalized
            // When considering the inclination of the faces (due to different base and top radius)
            // N has to be rotated around the x axis, which means its z coordinate will change to
            // Nz = tg(inclination) * |N| = (base - top) / height * |N|
            //var normal = [Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta)];
            
            //normal = this.vectorNormalize(normal);

            for (var j = 0; j < this.loops; j++) {
                this.vertices.push(x, y, z);
                var normal = [Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta)];
            
                normal = this.vectorNormalize(normal);
                this.normals.push(...normal);
                
                //At each iteration we push indices relative to the face composed by the next vertices
                this.indices.push (
                    ((this.loops + 1) * (i + 1) + j) % max_vertices, (this.loops + 1) * i + j, (this.loops + 1) * i + 1 + j,
                    ((this.loops + 1) * (i + 1) + 1 + j) % max_vertices , ((this.loops + 1) * (i + 1) + j) % max_vertices, (this.loops + 1) * i + 1 + j
                )

                // At each iteration we go up on the z axis and closer to top radius
                phi += delta_phi;
                x = (this.outer + this.inner * Math.cos(theta)) * Math.cos(phi);
                y = (this.outer + this.inner * Math.cos(theta)) * Math.sin(phi);
            }

            //By stopping at j = loops we miss the last point (the one on the top circunference)
            this.vertices.push(x, y, z);
            var normal = [Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta)];
            
            normal = this.vectorNormalize(normal);
            this.normals.push(...normal);
            
            phi = 0;
            theta += delta_theta;
        }

        //TODO: texture coords

        //Base drawing
        // ang = 0;

        // for(i = 0; i < this.slices; i++){
        //     var sal=this.radius*Math.sin(ang);
        //     var cal=this.radius*Math.cos(ang);

        //     this.vertices.push(cal, -sal, 0);
        //     this.vertices.push(cal, -sal, this.height);

        //     this.normals.push(0,0,-1);
        //     this.normals.push(0,0,1);

        //     this.indices.push((2*i+2) % (2*this.slices) + 4*this.slices, 4*this.slices+(2*i), 6*this.slices);
        //     this.indices.push(6*this.slices+1, 4*this.slices+(2*i+1), (2*i+3) % (2*this.slices) + 4*this.slices);

        //     this.texCoords.push(
        //         0,0,
        //         0,0
        //     );

        //     ang+=alphaAng;
        // }

        // this.vertices.push(0,0,0);
        // this.vertices.push(0,0,this.height);
        // this.normals.push(0,0,-1);
        // this.normals.push(0,0,1);
        // this.texCoords.push(
        //     0,0,
        //     0,0
        // );

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