#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D noiseTexture;
uniform float currentTime;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord); // Color from RTT
	vec4 noise = texture2D(noiseTexture, vTextureCoord); // Color from noise texture
	// The radial gradient is achieved by calculating the radius from the center of the rectangle and then inverting the values
	// so that it gets darker to the corners (darker means closer to 0.0)
	float radius = (vTextureCoord.x - 0.5) * (vTextureCoord.x - 0.5) + (vTextureCoord.y - 0.5) * (vTextureCoord.y - 0.5);
	float radialGradient = (1.0 - sqrt(radius) * 1.6);

	// Grayscale conversion (based on a Wikipedia formula)
	float grayscale = color.r * 0.21 + color.g * 0.71 + color.b * 0.072;
	color.r = grayscale;
	color.g = grayscale;
	color.b = grayscale;

	//By default there is no interference. It only is applied when the below condition is met
	vec4 interference = vec4(color.rgb, 1.0);
	if(mod((vTextureCoord.y + currentTime / 8.0) * 100.0, 10.0) < 0.8){
		interference = vec4(color.rgb + 0.1 , 1.0) + noise; //Applies the noise texture and adding a little white to the line color
	}

	// Applying both effects to the actual fragment color
	gl_FragColor = vec4(interference.rgb * radialGradient, 1.0);
}