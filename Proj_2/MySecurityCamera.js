/**
 * 
 */
class MySecurityCamera extends CGFobject {
    constructor(scene, texture) {
        super(scene);

        this.screen = new MyRectangle(this.scene, -1, 0, 5, 0, 5);
        this.texture = texture;
        this.cameraShader = new CGFshader(this.scene.gl, "shaders/camera.vert", "shaders/camera.frag");
        this.cameraShader.setUniformsValues({ uSampler: 0 });
    }
    display() {
        this.scene.pushMatrix();
        
        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.cameraShader);
        
        this.texture.bind();
        this.screen.display();
        this.texture.unbind();

        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();
    }
}