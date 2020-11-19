/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Id of the primitive
 * @param inner - Radius of the inner circle
 * @param outer - Radius of the outer circle
 * @param slices - Number of divisions arround each inner circle
 * @param loops - Number of divisions arround the outer circle
 */
class MyTorus extends CGFobject {
	constructor(scene, id, inner, outer, slices, loops) {
        super(scene);
        
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

		this.initBuffers();
	}
	
	initBuffers() {
        //=========== VERTICES/NORMALS/TEXTURECOORDS ============================
        /*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        */

        this.vertices = [];
        this.normals = [];
        this.texCoords = [];

        var alphaInnerAng = 2*Math.PI/this.slices;
        var alphaOuterAng = 2*Math.PI/this.loops;

        for (var i = 0; i <= this.loops; i++) {
            for (var j = 0; j <= this.slices; j++) {
                //vertices
                var vertX = (this.outer + this.inner * Math.cos(alphaInnerAng*j)) * Math.cos(alphaOuterAng*i);
                var vertY = (this.outer + this.inner * Math.cos(alphaInnerAng*j)) * Math.sin(alphaOuterAng*i);
                var vertZ = this.inner * Math.sin(alphaInnerAng*j);

                this.vertices.push(vertX,vertY,vertZ);

                //normals
                //tangent vector to the outer circle
                var outTanX = -Math.sin(alphaOuterAng*i);
                var outTanY = Math.cos(alphaOuterAng*i);
                var outTanZ = 0;

                //tangent vector to the inner circle
                var inTanX = Math.cos(alphaOuterAng*i)*(-Math.sin(alphaInnerAng*j));
                var inTanY = Math.sin(alphaOuterAng*i)*(-Math.sin(alphaInnerAng*j));
                var inTanZ = Math.cos(alphaInnerAng*j);

                //normal is the cross product between the two
                var normal = MyMath.normalizeVec(MyMath.calcCrossPorduct([outTanX,outTanY,outTanZ],[inTanX,inTanY,inTanZ]));

                this.normals.push(...normal);

                //texCoords
                var s = i/this.loops;
                var t = 1- j/this.slices ;

                this.texCoords.push(s,t)
            }
        }

        //============ INDICES ============================
        this.indices = [];

        for (var i = 0; i < this.loops; i++) {
            for (var j = 0; j < this.slices; j++) { 
                var i1 = i * (this.slices+1) + j;
                var i2 = (i+1) * (this.slices+1) + j;
                var i3 = i * (this.slices+1) + (j+1);
                var i4 = (i+1) * (this.slices+1) + (j+1);

                this.indices.push(i1,i2,i3);
                this.indices.push(i2,i4,i3);
            }
        }
    
        //==================================================
        
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

    needsLengths() {
		return false;
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

