/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Id of the primitive
 * @param radius - Radius of the shpere
 * @param slices - Number of divisions around the Z axis
 * @param stacks - Number of divisions around the Y axis
 */
class MySphere extends CGFobject {
	constructor(scene, id, radius, slices, stacks) {
        super(scene);
        
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
	}
	
	initBuffers() {
        //=========== VERTICES/NORMALS/TEXCOORDS ============================
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

        var alphaAngZ = 2 * Math.PI/this.slices;
        var alphaAngY = 2 * Math.PI/this.stacks;

        for (var i = 0; i <= this.slices; i++) {
            for (var j = 0; j <= this.stacks; j++) {
                //vertices
                var vertX = this.radius * Math.cos(i*alphaAngZ) * Math.cos(j*alphaAngY);
                var vertY = this.radius * Math.sin(i*alphaAngZ) * Math.cos(j*alphaAngY);
                var vertZ = this.radius * Math.sin(j*alphaAngY);

                this.vertices.push(vertX,vertY,vertZ);

                //normals
                var normX = Math.cos(i*alphaAngZ) * Math.cos(j*alphaAngY);
                var normY = Math.sin(i*alphaAngZ) * Math.cos(j*alphaAngY);
                var normZ = Math.sin(j*alphaAngY);

                this.normals.push(normX,normY,normZ);

                //texCoords
                var u = i/this.slices
                var v = 1 - j/this.stacks;

                this.texCoords.push(u,v);
            }
        }

        //============ INDICES ============================
        this.indices = [];

        for (var i = 0; i < this.slices; i++) {
            for (var j = 0; j < this.stacks; j++) {
                var i1 = i * (this.stacks+1) + j;
                var i2 = (i+1) * (this.stacks+1) + j;
                var i3 = i * (this.stacks+1) + (j+1);
                var i4 = (i+1) * (this.stacks+1) + (j+1);

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

