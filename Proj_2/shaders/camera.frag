#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float currentTime;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	float radius = (vTextureCoord.x - 0.5) * (vTextureCoord.x - 0.5) + (vTextureCoord.y - 0.5) * (vTextureCoord.y - 0.5);
	float radialGradient = (1.0 - sqrt(radius) * 1.5);
	vec4 interference = vec4(color.rgb, 1.0);

	if(mod((vTextureCoord.y + mod(currentTime, 100.0)) * 100.0, 10.0) < 1.0){
		interference = vec4(color.r + 0.5, color.g + 0.5, color.b + 0.5 , 1.0);
		//interference = vec4(1.0, 1.0, 1.0 , 1.0);
	}


	gl_FragColor = vec4(interference.rgb * radialGradient, 1.0);
}