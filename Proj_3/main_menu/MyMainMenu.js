class MyMainMenu extends CGFobject {
    constructor(scene) {
        super(scene);

        this.stateMachine = new MenuStateMachine(scene);

        this.background = new MyRectangle(scene, 0, -1, 1, -1, 1);
        this.background.updateTexCoords(2, 2);
        this.backgroundTexture = new CGFtexture(scene, "scenes/images/main_menu.png");

        this.shader = new CGFshader(scene.gl, "shaders/gui.vert", "shaders/gui.frag");
    }
    onClick(objID) {
        this.stateMachine.handleEvent(objID);
    }
    display() {
        this.scene.pushMatrix();
        // Apply the custom gui shader
		this.scene.setActiveShader(this.shader);

        // Applying the backgournd texture and displaying it
        this.backgroundTexture.bind();
        this.background.display();
        this.backgroundTexture.unbind();

        // The state machine holds the state of the menu and knows what should be displayed
        this.stateMachine.display();
        
        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();
    }
}