/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);
        this.id = id;
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
        var coordX = 0;

        for (var i = 0; i < this.slices; i++) {
            // X coordinate of current vertex
            var x = Math.cos(alpha) * radius;
            // Y coordinate of current vertex
            var y = Math.sin(alpha) * radius;
            // The normal vector at each point of the circunference is:
            // N = [(x, y, z) - (0, 0, z)]; which still has to be normalized
            // When considering the inclination of the faces (due to different base and top radius)
            // N has to be rotated around the x axis, which means its z coordinate will change to
            // Zn = tg(inclination) * |N| = (base - top) / height * |N|
            var normal = [x, y, 0];
            // Changing Zn
            normal[2] = (this.base - this.top) / this.height * this.vectorNorm(normal);
            // Normalizig the vector; this vector is the same for the current side 'edge'
            normal = this.vectorNormalize(normal);

            for (var j = 0; j < this.stacks; j++) {
                this.vertices.push(x, y, z);
                this.normals.push(...normal);

                // At each iteration we go up on the z axis and closer to top radius
                z += delta_z;
                radius += delta_r;
                x = Math.cos(alpha) * radius;
                y = Math.sin(alpha) * radius;
            }

            //TODO: add indices

            z = 0;
            alpha += delta_alpha;
        }

        // for (var i = 0; i < this.slices; i++) {
        //     // All vertices have to be declared for a given face
        //     // even if they are shared with others, as the normals 
        //     // in each face will be different

        //     var sa=this.base*Math.sin(ang);
        //     var saa=this.base*Math.sin(ang+alphaAng);
        //     var ca=this.base*Math.cos(ang);
        //     var caa=this.base*Math.cos(ang+alphaAng);

        //     this.vertices.push(ca, -sa, 0);
        //     this.vertices.push(ca, -sa, this.height);
        //     this.vertices.push(caa, -saa, 0);
        //     this.vertices.push(caa, -saa, this.height);

        //     var normal1 = [
        //         ca,
        //         0,
        //         -sa
        //     ];

        //     var normal2 = [
        //         caa,
        //         0,
        //         -saa
        //     ];

        //     // normalization
        //     var nsize = Math.sqrt(
        //         normal1[0] * normal1[0] +
        //         normal1[1] * normal1[1] +
        //         normal1[2] * normal1[2]
        //     );

        //     normal1[0] /= nsize;
        //     normal1[1] /= nsize;
        //     normal1[2] /= nsize;

        //     nsize = Math.sqrt(
        //         normal2[0] * normal2[0] +
        //         normal2[1] * normal2[1] +
        //         normal2[2] * normal2[2]
        //     );

        //     normal2[0] /= nsize;
        //     normal2[1] /= nsize;
        //     normal2[2] /= nsize;

        //     this.normals.push(...normal1);
        //     this.normals.push(...normal1);
        //     this.normals.push(...normal2);
        //     this.normals.push(...normal2);

        //     //indices
        //     this.indices.push(
        //         4 * i, (4 * i + 1), (4 * i + 2),
        //         (4 * i + 2), (4 * i + 1), 4 * i,
        //         (4 * i + 1), (4 * i + 3), (4 * i + 2),
        //         (4 * i + 2), (4 * i + 3), (4 * i + 1),
        //     );

        //     //texture coords
        //     this.texCoords.push(
        //         coordX, 1,
        //         coordX, 0
        //     );
        //     coordX += 1 / this.slices;
        //     this.texCoords.push(
        //         coordX, 1,
        //         coordX, 0
        //     );
        //     ang += alphaAng;
        // }

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
            vec.forEach(element => {
                element /= norm; // Every coordinate is divided by the vector norm
            });
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