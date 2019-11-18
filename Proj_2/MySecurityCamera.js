/**
 * 
 */
class MySecurityCamera extends CGFobject {
    constructor(scene, texture) {
        super(scene);

        this.rectangle = new MyRectangle(this.scene, 0, 0.5, 1, -1, -0.5);
        //Normalizing the rectangle texCoords
        this.rectangle.updateTexCoords(0.5, 0.5);
        this.texture = texture;
        this.cameraShader = new CGFshader(this.scene.gl, "shaders/camera.vert", "shaders/camera.frag");
    }
    updateShader(t) {
        this.cameraShader.setUniformsValues({ currentTime: t / 100 % 2});
    }
    display() {
        this.scene.pushMatrix();
        
        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.cameraShader);
        
        this.texture.bind();
        this.rectangle.display();
        this.texture.unbind();
        
        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();
    }
}