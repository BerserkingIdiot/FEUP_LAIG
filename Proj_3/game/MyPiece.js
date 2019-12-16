class MyPiece extends CGFobject {
    constructor(scene, x, y, color) {
        super(scene);

        this.shape = new MyCylinder(scene, 0, 0.5, 0.5, 0.2, 8, 4);
        this.lid = new MyOctagon(scene, 0, 0.5);
        this.x = x;
        this.y = y;
        this.color = color;
    }
    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x - 0.5, 0, this.y - 0.5);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 8, 0, 0, 1);
        this.shape.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.lid.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.2);
        this.lid.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
    getCoords() {
        let coords = [];
        coords['x'] = this.x;
        coords['y'] = this.y;

        return coords;
    }
    setCoords(coords) {
        this.x = coords['x'];
        this.y = coords['y'];
    }
}