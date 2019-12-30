class MyTile extends CGFobject {
    constructor(scene, id, x, y) {
        super(scene);
        this.id = id;
        this.coords = [];
        this.coords['x']=x;
        this.coords['y']=y;
        this.octagon = new MyOctagon(this.scene, this.id, 0.5);
        //TODO: make pickable
    }

    getCoords() {
        return this.coords;
    }

    display() {
        this.octagon.display();
    }


}