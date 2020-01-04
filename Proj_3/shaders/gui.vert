attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main() {
    // The position is calculated without the projection matrix
    // so the rectangle does not get into the scene.
    // This way it stands as a static UI element.
	gl_Position = vec4(aVertexPosition, 1.0);

    // There is no RTT this time, so the texture is applied as it should be.
	vTextureCoord = aTextureCoord;
}
