/**
 * @class MyGamePiece
 * Class that represents a game piece. Holds its coordinates and color.
 * Also responsible for displaying the piece.
 */
class MyGamePiece extends CGFobject {
    /**
     * @constructor
     * @param {reference to XMLscene this belongs to} scene 
     * @param {piece's x coordinate} x 
     * @param {piece's y coordinate} y 
     * @param {piece's color: either 'white' or 'black'} color 
     */
    constructor(scene, x, y, color) {
        super(scene);

        // let radius = 0.5 / Math.cos(22.5 * Math.PI / 180);
        let radius = 0.5;
        this.shape = new MyCylinder(scene, 0, radius, radius, 0.2, 8, 4);
        this.lid = new MyOctagon(scene, 0, radius);
        this.x = x;
        this.y = y;
        this.initMaterials(scene, color);
    }
    /**
     * @method initMaterials
     * Initializes the piece's material according to its color.
     * @param {reference to XMLscene this belongs to} scene 
     * @param {piece's color} color 
     */
    initMaterials(scene, color) {
        if(color === 'white') {
            this.color = new CGFappearance(scene);
            this.color.setAmbient(0.2, 0.2, 0.2, 1.0);
            this.color.setDiffuse(0.8, 0.8, 0.8, 1.0);
            this.color.setSpecular(0.1, 0.1, 0.1, 1.0);
            this.color.setShininess(10.0);
        } else if (color === 'black') {
            this.color = new CGFappearance(scene);
            this.color.setAmbient(0.1, 0.1, 0.1, 1.0);
            this.color.setDiffuse(0.0, 0.0, 0.0, 1.0);
            this.color.setSpecular(0.1, 0.1, 0.1, 1.0);
            this.color.setShininess(10.0);
        } else {
            console.error('Invalid piece type');
        }
    }
    /**
     * @method getCoords
     * Getter for piece's coordinates.
     */
    getCoords() {
        let coords = [];
        coords['x'] = this.x;
        coords['y'] = this.y;

        return coords;
    }
    /**
     * @method setCoords
     * Setter for piece's coordinates.
     * @param {map with 'x' and 'y' as keys representing new piece coordinates} coords 
     */
    setCoords(coords) {
        this.x = coords['x'];
        this.y = coords['y'];
    }
    /**
     * @method display
     * Display the piece on the scene.
     * Applies all necessary transformations to display it correctly.
     */
    display() {
        this.scene.pushMatrix();
        this.color.apply();

        this.scene.translate(this.x + 0.5, 0, this.y + 0.5);
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
}