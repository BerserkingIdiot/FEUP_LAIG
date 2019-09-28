/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.base = base;
        this.top = top;
        this.height = height;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;
        var coordX = 0;

        for (var i = 0; i < this.slices; i++) {
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa=this.base*Math.sin(ang);
            var saa=this.base*Math.sin(ang+alphaAng);
            var ca=this.base*Math.cos(ang);
            var caa=this.base*Math.cos(ang+alphaAng);

            this.vertices.push(ca, -sa, 0);
            this.vertices.push(ca, -sa, this.height);
            this.vertices.push(caa, -saa, 0);
            this.vertices.push(caa, -saa, this.height);

            var normal1 = [
                ca,
                0,
                -sa
            ];

            var normal2 = [
                caa,
                0,
                -saa
            ];

            // normalization
            var nsize = Math.sqrt(
                normal1[0] * normal1[0] +
                normal1[1] * normal1[1] +
                normal1[2] * normal1[2]
            );

            normal1[0] /= nsize;
            normal1[1] /= nsize;
            normal1[2] /= nsize;

            nsize = Math.sqrt(
                normal2[0] * normal2[0] +
                normal2[1] * normal2[1] +
                normal2[2] * normal2[2]
            );

            normal2[0] /= nsize;
            normal2[1] /= nsize;
            normal2[2] /= nsize;

            this.normals.push(...normal1);
            this.normals.push(...normal1);
            this.normals.push(...normal2);
            this.normals.push(...normal2);

            //indices
            this.indices.push(
                4 * i, (4 * i + 1), (4 * i + 2),
                (4 * i + 2), (4 * i + 1), 4 * i,
                (4 * i + 1), (4 * i + 3), (4 * i + 2),
                (4 * i + 2), (4 * i + 3), (4 * i + 1),
            );

            //texture coords
            this.texCoords.push(
                coordX, 1,
                coordX, 0
            );
            coordX += 1 / this.slices;
            this.texCoords.push(
                coordX, 1,
                coordX, 0
            );
            ang += alphaAng;
        }

        //Base drawing
        ang = 0;

        for(i = 0; i < this.slices; i++){
            var sal=this.radius*Math.sin(ang);
            var cal=this.radius*Math.cos(ang);

            this.vertices.push(cal, 0, -sal);
            this.vertices.push(cal, this.height, -sal);

            this.normals.push(0,-1,0);
            this.normals.push(0,1,0);

            this.indices.push((2*i+2) % (2*this.slices) + 4*this.slices, 4*this.slices+(2*i), 6*this.slices);
            this.indices.push(6*this.slices+1, 4*this.slices+(2*i+1), (2*i+3) % (2*this.slices) + 4*this.slices);

            this.texCoords.push(
                0,0,
                0,0
            );

            ang+=alphaAng;
        }
        
        this.vertices.push(0,0,0);
        this.vertices.push(0,this.height,0);
        this.normals.push(0,-1,0);
        this.normals.push(0,1,0);
        this.texCoords.push(
            0,0,
            0,0
        );

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
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