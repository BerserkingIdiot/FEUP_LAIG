/**
 * 
 */
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);

        this.screen = new MyRectangle(this.scene, -1, 0, 5, 0, 5);
        this.cameraShader = new CGFshader(this.scene.gl, "shaders/camera.vert", "shaders/camera.frag");
        this.cameraShader.setUniformsValues({ uSampler: 0 });
    }
    display() {
        //TODO: Aplicar os shaders
        this.scene.pushMatrix();
        
        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.cameraShader);
        
        this.scene.rtt.bind();
        this.screen.display();
        this.scene.rtt.unbind();

        // restore default shader (will be needed for drawing the axis in next frame)
		this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();
        //TODO: desaplicar os shaders??

    }
}