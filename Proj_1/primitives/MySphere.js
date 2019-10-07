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
		// Texture S axis increment
        var delta_s = 1 / this.slices;
        // Texture T axis increment
        var delta_t = 1 / (this.stacks * 2);

		for (var phi_inc = 0; phi_inc <= this.slices; ++phi_inc) {

			for (var tet_inc = 0; tet_inc < this.stacks; ++tet_inc) {
				// 3 cartesian coordinates defined using spherical coordinates
				var x = this.radius * Math.cos(tet_angle * tet_inc) * Math.cos(phi_angle * phi_inc);
				var y = this.radius * Math.cos(tet_angle * tet_inc) * Math.sin(phi_angle * phi_inc);
				var z = this.radius * Math.sin(tet_angle * tet_inc);

				// Adding vertices with positive z coordinate
				this.vertices.push(x,y,z);
				// Texture coordinates on +Z,
				// which means t value is counted upwards from the middle of the texture
				this.texCoords.push(delta_s * phi_inc, 0.5 + delta_t * tet_inc);
				// Positive Z normals
				this.normals.push(x / this.radius,y / this.radius,z / this.radius);
				
				// When tet_inc = 0, the vertices are being placed on the equator, which is common to both +Z and -Z
				// This way there is no duplication of vertices on the equator
				if (tet_inc != 0) {
					// Adding vertices with negative z coordinate (which corresponds to a simetry on xy plane)
					this.vertices.push(x,y,-z);
					// Texture coordinates on -Z,
					// which means t value is counted downwards from the middle of the texture
					this.texCoords.push(delta_s * phi_inc, 0.5 - delta_t * tet_inc);
					// Negative Z normals
					this.normals.push(x / this.radius,y / this.radius,- z / this.radius);
				}
			}
		}
		//Adding poles. This way there is no duplication of vertices on the poles
		//North pole coordinates and normal vector (before last vertex)
		this.vertices.push(0, 0, this.radius);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 1);
		//South pole coordinates and normal vector (last vertex)
		this.vertices.push(0, 0, -this.radius);
		this.normals.push(0, 0, -1);
		this.texCoords.push(0.5, 0);

		//Calculation for the last vertex index; considers no repetition on equator and on poles
		var last_vertex = this.stacks * this.slices * 2 - this.slices + this.stacks * 2;
		var line_offset = 2 * this.stacks - 1; //The amount of vertices between each slice start index
		var north_pole_offset = this.stacks - 2; //Offset that north pole neighbour vertices have because of the lack of repetition on the equator
		for (var i = 0; i < this.slices; ++i) {

			var j;
			for(j = 0; j < this.stacks - 1; ++j) { //The last stack will be the one with a pole. That one is treated differently
				//-----------------------------------------------------Positive Z indices

				var upper_offset = 2 * j + 1; //Offset of the vertex between the current and the next stacks
				var lower_offset = (j == 0) ? 0 : (2 * j - 1); //Offset of the vertex between the current and the previous stacks

				this.indices.push(
					line_offset * i + upper_offset, line_offset * i + lower_offset, line_offset * (i + 1) + lower_offset,
					line_offset * i + upper_offset, line_offset * (i + 1) + lower_offset, line_offset * (i + 1) + upper_offset
				);

				//-----------------------------------------------------Negative Z indices
				upper_offset = 2 * j + 2;
				lower_offset = 2 * j;

				this.indices.push(
					line_offset * (i + 1) + lower_offset, line_offset * i + lower_offset, line_offset * i + upper_offset,
					line_offset * (i + 1) + upper_offset, line_offset * (i + 1) + lower_offset, line_offset * i + upper_offset
				);
			}

			// Near the poles we only display triangles
			// Positive Z pole (North pole)
			this.indices.push(
				last_vertex - 1, line_offset * i + j + north_pole_offset, line_offset * (i + 1) + j + north_pole_offset
			);
			// Negative Z pole (South pole)
			this.indices.push(
				line_offset * (i + 1) + 2 * j, line_offset * i + 2 * j, last_vertex
			);
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};