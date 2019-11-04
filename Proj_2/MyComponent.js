/**
 * MyComponent
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Id of the component
 * @param matrix - Transformation matrix of the component
 * @param materials - Materials applied to the component
 * @param texture - texture applied to the component
 * @param compChildren - component children of the component
 * @param primChildren - primitive children of the component
 * @param ls - scale of the s parameter of the texture
 * @param lt - scale of the t parameter of the texture
 */
class MyComponent extends CGFobject {
    constructor(scene, id, matrix, materials, texture, compChildren, primChildren, ls, lt, animation) {
        super(scene);
        this.id = id;
        this.transfMat = matrix;
        this.materials = materials;
        this.texture = texture;
        this.compChildren = compChildren;
        this.primChildren = primChildren;
        this.lengthS = ls;
        this.lengthT = lt;
        this.animation = animation;
        this.visited = false;
        this.materialIndex = 0;
    }

    updateMaterialIndex() {
        this.materialIndex = this.materialIndex + 1;
        if (this.materialIndex >= this.materials.length)
            this.materialIndex = 0;
    }

    getCurrentMaterialID() {
        return this.materials[this.materialIndex];
    }

}