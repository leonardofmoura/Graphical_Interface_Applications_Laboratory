#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

uniform float time_factor;

float shade(float x, float y) {
	return (-abs((x - 1.0/2.0)*2.0) + 1.0) * ((-abs((y - 1.0/2.0)*2.0) + 1.0));
}

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	vec2 recTexCoord = vec2(vTextureCoord.x,1.0-vTextureCoord.y);
	vec4 filter = texture2D(uSampler2, recTexCoord);
	vec4 final_color;

	if(mod((vTextureCoord.y*3.0 - time_factor*0.03) * 5.0, 2.0) > 1.7) {
		color = vec4(color.rgb + 0.4,1.0);
	}

	vec4 shaded_color = vec4(color.rgb * shade(vTextureCoord.x,vTextureCoord.y) , 1.0);

	if (filter.rgb == vec3(1.0,0.0,0.0) || filter.rgb == vec3(1.0,1.0,1.0)) {
		final_color = filter;
	}
	else {
		final_color = shaded_color;
	}

	gl_FragColor = final_color;
}


