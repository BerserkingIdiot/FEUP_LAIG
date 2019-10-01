/**
 * MySemiSphere
 * @constructor
 */
class MySemiSphere extends CGFobject
{
	constructor(scene, slices, stacks)
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var xz_angle = 2*Math.PI/this.slices;
		var y_angle = Math.PI/(2*this.stacks);

		for(var xz = 0; xz <= this.slices; ++xz) {

			for(var y = 0; y <= this.stacks; ++y) {

				this.vertices.push(
                    Math.cos(y_angle*y)*Math.cos(xz_angle*xz), 
                    Math.cos(y_angle*y)*Math.sin(xz_angle*xz), 
                    Math.sin(y_angle*y)
				);

				this.normals.push(
                    Math.cos(y_angle*y)*Math.cos(xz_angle*xz), 
                    Math.cos(y_angle*y)*Math.sin(xz_angle*xz), 
                    Math.sin(y_angle*y)
				);

				this.texCoords.push(
                    ((Math.cos(y_angle*y)*Math.cos(xz_angle*xz))+1)/2, 
                    1 - ((Math.cos(y_angle*y)*Math.sin(xz_angle*xz))+1)/2
				);

			}

		}

		for (var i = 0; i < this.slices; ++i) {
			for(var j = 0; j < this.stacks; ++j) {
				this.indices.push(
                    (i+1)*(this.stacks+1) + j, i*(this.stacks+1) + j+1, i*(this.stacks+1) + j,
                    i*(this.stacks+1) + j, i*(this.stacks+1) + j+1, (i+1)*(this.stacks+1) + j, 
                    i*(this.stacks+1) + j+1, (i+1)*(this.stacks+1) + j, (i+1)*(this.stacks+1) + j+1,
                    (i+1)*(this.stacks+1) + j+1, (i+1)*(this.stacks+1) + j, i*(this.stacks+1) + j+1
				);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};