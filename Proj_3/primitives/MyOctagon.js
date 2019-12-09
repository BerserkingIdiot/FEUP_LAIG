class MyOctagon extends CGFobject {
    constructor(scene, id, radius) {
        super(scene);
        this.radius = radius;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let delta_alpha = 2 * Math.PI / 8;

        for(let i = 0; i <= 8; i++) {
            let cos = Math.cos(delta_alpha * i);
            let sin = Math.sin(delta_alpha * i);
            let x = cos * this.radius;
            let y = sin * this.radius;

            this.vertices.push(x, y, 0);
            this.indices.push(i, i+1, 9);
            this.normals.push(0, 0, 1);
            this.texCoords.push(0.5 * cos + 0.5, -0.5 * sin + 0.5);
        }

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}