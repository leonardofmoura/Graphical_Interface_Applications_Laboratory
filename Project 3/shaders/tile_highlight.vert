attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float time_factor;

void main() {
    vec3 pos = aVertexPosition;
    pos.z = pos.z + 0.08*sin(0.5*time_factor)+0.08;

	gl_Position = uPMatrix * uMVMatrix * vec4(pos,1.0);

    vTextureCoord = aTextureCoord;
}

