/**
 * 
 */
class MySecurityCamera extends CGFobject {
    constructor(scene, texture) {
        super(scene);

        this.rectangle = new MyRectangle(scene, 0, 0.5, 1, -1, -0.5);
        //Normalizing the rectangle texCoords
        this.rectangle.updateTexCoords(0.5, 0.5);
        this.texture = texture;
        this.noiseText = new CGFtexture(scene, "scenes/images/noise.jpg")
        this.cameraShader = new CGFshader(scene.gl, "shaders/camera.vert", "shaders/camera.frag");

        this.cameraShader.setUniformsValues({ noiseTexture: 1});
    }
    updateShader(t) {
        this.cameraShader.setUniformsValues({ currentTime: (t / 1000) % 10});
    }
    display() {
        this.scene.pushMatrix();
        
        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.cameraShader);
        
        this.texture.bind();
        this.noiseText.bind(1);
        this.rectangle.display();
        this.noiseText.unbind(1);
        this.texture.unbind();
        
        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();
    }
}