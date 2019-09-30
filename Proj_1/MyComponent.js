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
class MyComponent extends CGFobject{
    constructor(scene, id, matrix, materials, texture, compChildren, primChildren, ls, lt) {
        super(scene);
        this.transfMat = matrix;
        this.materials = materials; //TODO: cycle materials
        this.texture = texture;
        this.compChildren = compChildren;
        this.primChildren = primChildren;
        this.lengthS = ls;
        this.lengthT = lt;
    }

}