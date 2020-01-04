class MyMainMenu extends CGFobject {
    constructor(scene) {
        super(scene);

        this.stateMachine = new MenuStateMachine(scene);

        this.background = new MyRectangle(scene, 0, -1.5, 1.5, -1, 1);
        this.background.updateTexCoords(3, 2);
        this.backgroundTexture = new CGFtexture(scene, "scenes/images/main_menu.png");
    }
    onClick(objID) {
        this.stateMachine.handleEvent(objID);
    }
    display() {
        this.scene.pushMatrix();

        // Applying the backgournd texture and displaying it
        this.backgroundTexture.bind();
        this.background.display();
        this.backgroundTexture.unbind();

        this.scene.translate(0, 0, 0.01);
        // The state machine holds the state of the menu and knows what should be displayed
        this.stateMachine.display();
        
        this.scene.popMatrix();
    }
}