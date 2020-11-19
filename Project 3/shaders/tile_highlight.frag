#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform float time_factor;

vec4 shade(vec4 color, float time_factor) {
	return vec4(color.rgb + 0.2*sin(0.7*time_factor),1.0);
}

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	
    vec4 final_color = shade(color,time_factor);

	gl_FragColor = final_color;
}