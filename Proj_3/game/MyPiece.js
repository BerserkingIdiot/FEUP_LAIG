class MyPiece extends CGFobject {
    constructor(scene, tile) {
        this.shape = new MyCylinder(scene, id, 1, 1, 0.5, 8, 4);
        this.tile = tile;
    }
    display() {
        this.shape.display();
    }
}