/**
 * 
 */
class MySecurityCamera extends CGFobject {
    constructor(scene, texture) {
        super(scene);

        // The rectangle's coordinates are set according to the screen's axis system
        this.rectangle = new MyRectangle(scene, 0, 0.5, 1, -1, -0.5);
        // Normalizing the rectangle texCoords
        this.rectangle.updateTexCoords(0.5, 0.5);
        // texture is the RTT passed by the scene
        this.texture = texture;
        this.cameraShader = new CGFshader(scene.gl, "shaders/camera.vert", "shaders/camera.frag");
        
        // The following texture is a TV noise texture used on fragment shader
        // It has to be bound to unit 1 because the RTT is bound to 0
        this.noiseText = new CGFtexture(scene, "scenes/images/noise.jpg")
        this.cameraShader.setUniformsValues({ noiseTexture: 1});
    }
    updateShader(t) {
        // Passing the scene's current time to the shader.
        // Notice that the module function is applied here, which means the lines are guaranteed to move.
        this.cameraShader.setUniformsValues({ currentTime: (t / 1000) % 10});
    }
    display() {
        this.scene.pushMatrix();
        
        // Apply the custom camera shader
		this.scene.setActiveShader(this.cameraShader);
        
        // RTT bind to the scene as unit 0
        this.texture.bind();
        // Noise texture as unit 1
        this.noiseText.bind(1);
        this.rectangle.display();
        this.noiseText.unbind(1);
        this.texture.unbind();
        
        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();
    }
}