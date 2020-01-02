/**
 * 
 */
class MyGameOverView extends CGFobject {
    constructor(scene, texture) {
        super(scene);

        // The rectangle's coordinates are set according to the screen's axis system
        this.rectangle = new MyRectangle(scene, 0, -1, -0.5, 0.5, 1);
        // Normalizing the rectangle texCoords
        this.rectangle.updateTexCoords(0.5, 0.5);
        // texture is the RTT passed by the scene
        this.texture = texture;
        this.cameraShader = new CGFshader(scene.gl, "shaders/camera.vert", "shaders/camera.frag");
    }
    display() {
        this.scene.pushMatrix();
        
        // Apply the custom camera shader
		this.scene.setActiveShader(this.cameraShader);
        
        // RTT bind to the scene as unit 0
        this.texture.bind();
        this.rectangle.display();
        this.texture.unbind();
        
        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();
    }
}