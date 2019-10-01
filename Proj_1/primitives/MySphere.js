/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject
{
	constructor(scene, slices, stacks)
	{
		super(scene);

        this.semi = new MySemiSphere(scene, slices, stacks);

		this.initBuffers();
	};
    display(){
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.semi.display();
        this.scene.popMatrix();

        this.semi.display();
    }
};