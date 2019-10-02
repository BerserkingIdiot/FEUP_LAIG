/**
 * MySemiSphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the primitive
 * @param radius - Radius of the sphere
 * @param slices - Number of divisions around the axis (in our case, z-axis)
 * @param stacks - number of division between poles
 */
class MySphere extends CGFobject
{
	constructor(scene, id, radius, slices, stacks)
	{
		super(scene);

		this.radius = radius;
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

		//Spherical coordinates:
		// phi -> angle around the z-axis (around the xy plane circunference/equator)
		// tet -> angle around the x-axis (around the yz plane circunference/meridians)
		var phi_angle = 2*Math.PI/this.slices;
		var tet_angle = Math.PI/(2*this.stacks);

		for(var phi_inc = 0; phi_inc <= this.slices; ++phi_inc) {

			for(var tet_inc = 0; tet_inc < this.stacks; ++tet_inc) {
				var x = this.radius*Math.cos(tet_angle*tet_inc)*Math.cos(phi_angle*phi_inc);
				var y = this.radius*Math.cos(tet_angle*tet_inc)*Math.sin(phi_angle*phi_inc);
				var z = this.radius*Math.sin(tet_angle*tet_inc);

				this.vertices.push(
                    this.radius*Math.cos(tet_angle*tet_inc)*Math.cos(phi_angle*phi_inc),
                    this.radius*Math.cos(tet_angle*tet_inc)*Math.sin(phi_angle*phi_inc), 
                    this.radius*Math.sin(tet_angle*tet_inc)
				);
				// console.log("point: (" + Math.round(x) + ", " + Math.round(y) + ", " + Math.round(z) + ")");

				this.normals.push(
                    Math.cos(tet_angle*tet_inc)*Math.cos(phi_angle*phi_inc), 
                    Math.cos(tet_angle*tet_inc)*Math.sin(phi_angle*phi_inc), 
                    Math.sin(tet_angle*tet_inc)
				);
				
				//TODO: Sphere tex coords
				// this.texCoords.push(
                //     ((Math.cos(tet_angle*tet_inc)*Math.cos(phi_angle*phi_inc))+1)/2, 
                //     1 - ((Math.cos(tet_angle*tet_inc)*Math.sin(phi_angle*phi_inc))+1)/2
				// );

				// this.texCoords.push(
				// 	1/this.slices * phi_inc, Math.abs(tet_inc-1)
				// );
			}
		}

		//North pole coordinates and normal vector
		this.vertices.push(0,0,this.radius);
		this.normals.push(0,0,1);
		// for(var i = 0; i < this.slices;)
		console.log("Last: " + this.vertices[8*3] + "," + this.vertices[8*3+1] + "," + this.vertices[8*3+3]);

		//South pole coordinates and normal vector

		var max_vertices = this.stacks * this.slices + this.stacks;
		for (var i = 0; i < this.slices; ++i) {
			var j;
			for(j = 0; j < this.stacks - 1; ++j) { //The last stack will be the one with a pole. That one is treated differently
				this.indices.push(
					this.stacks * i + j + 1, this.stacks * i + j, (this.stacks * (i + 1) + j),
					this.stacks * i + j + 1, (this.stacks * (i + 1) + j), (this.stacks * (i + 1) + j + 1)
				);

				console.log("points: (" + (this.stacks * i + j + 1) + ", " + (this.stacks * i + j) + ", " +  (this.stacks * (i + 1) + j) + ")");
				console.log("points: (" + (this.stacks * i + j + 1) + ", " + (this.stacks * (i + 1) + j) + ", " + (this.stacks * (i + 1) + j + 1) + ")");
			}

			// Near the pole we only display triangles
			this.indices.push(
				max_vertices, this.stacks * i + j, (this.stacks * (i + 1) + j)
			);

			console.log("points: (" + (this.stacks * this.slices) + ", " + (this.stacks * i + j) + ", " + (this.stacks * (i + 1) + j) +")");
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};