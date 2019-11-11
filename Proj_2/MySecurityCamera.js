/**
 * 
 */
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);

        this.screen = new MyRectangle(this.scene, -1, 0, 0.5, 0, 0.5);
    }
    display() {
        //TODO: Aplicar os shaders

        this.screen.display();

        //TODO: desaplicar os shaders??
    }
}