/**
 * MyCylinder
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 * @param base - Radius of the base
 * @param top - Radius of the top
 * @param height - Height of the cylinder
 * @param slices - Number of divisions in rotation
 * @param stacks - Number of divisions in height
 */
class MyCylinder extends Primitive {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
	}
    
    /**
     * Initializes the buffers of the primitive
     */
	initBuffers() {
        //=========== VERTICES/NORMALS/TEXCOORDS ===========================
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];

        var alphaAng = 2 * Math.PI /this.slices;
        var alphaH = this.height/this.stacks;
        this.alphaRadius = (this.top - this.base)/this.stacks;

        for (var i = 0; i <= this.stacks; i++) {
            for (var j = 0; j <= this.slices; j++) {
                //vertices
                var vertX = (this.base + i*this.alphaRadius) * Math.cos(j*alphaAng);
                var vertY = -(this.base + i*this.alphaRadius) * Math.sin(j*alphaAng);
                var vertZ = i*alphaH;

                this.vertices.push(vertX,vertY,vertZ);

                //normals
                this.normals.push(Math.cos(j*alphaAng),-Math.sin(j*alphaAng),0);

                //texCoords
                this.texCoords.push(-j/this.slices,1-i/this.stacks);
            }
        }

        //============ INDICES ============================
        this.indices = [];

        for (var i = 0; i < this.stacks; i++) {
            for (var j = 0; j < this.slices; j++) {
                var i1 = j + i * (this.slices + 1);
                var i2 = (j+1) + i * (this.slices + 1);
                var i3 = j + (i+1) * (this.slices + 1);
                var i4 = (j+1) + (i+1) * (this.slices + 1);  

            this.indices.push(i1,i3,i4);
            this.indices.push(i1,i4,i2);
            }
        }
        //==================================================
        
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

	/**
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

