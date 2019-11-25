attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main() {
    // The position is calculated without the projection matrix
    // so the rectangle does not get into the scene.
    // This way it stands as a static UI element.
	gl_Position = vec4(aVertexPosition, 1.0);

    //Since the rectangle texture coords are mirrored relative to x axis,
    //The following line inverts the y coordinate passed to the fragment shader,
    //thus mirroring it again.
	vTextureCoord.x = aTextureCoord.x;
	vTextureCoord.y = 1.0 - aTextureCoord.y;
}
