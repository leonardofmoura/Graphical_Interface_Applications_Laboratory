/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the triangle
 * @param {Array} p1 - Coordinates of point 1 of the triangle (array)
 * @param {Array} p2 - Coordinates of point 2 of the triangle (array)
 * @param {Array} p3 - Coordinates of point 3 of the triangle (array)
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, p1, p2, p3) {
		super(scene);
        this.p1 = p1;
        this.p2 = p2;
		this.p3 = p3;
		
		this.length_s = 1;
		this.length_t = 1;

		this.initBuffers();
    }
	
	initBuffers() {
        /*
        Assuming a triangle like this
                    p3 * 

                                    * p2
        p1 *
        */


        this.vertices = [];
        
        this.vertices.push(...this.p1);
        this.vertices.push(...this.p2);
        this.vertices.push(...this.p3);

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			2, 1, 0
		];

		//============= NORMALS ============================
		this.normals = [];

		//the normals will be the same in all vertices, and can be calculated using the cross product
		//of the vectors of two edges

		var vp1p2 = MyMath.calcVector(this.p1,this.p2);
		var vp1p3 = MyMath.calcVector(this.p1,this.p3);

		var normalVec = MyMath.normalizeVec(MyMath.calcCrossPorduct(vp1p2,vp1p3)); 
		var normalVec2 = MyMath.normalizeVec(MyMath.calcCrossPorduct(vp1p3,vp1p2));

		for (var i = 0; i < 6; i++) {
			if (i < 3) {
				this.normals.push(...normalVec);
			}
			else {
				this.normals.push(...normalVec2);
			}
		}
		
		// =========== TEXTURE COORDINATES ==================
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        */

		//Calculate distances between the points
        this.dp1p3 = MyMath.calcDistance(this.p1,this.p3); 	//c
        this.dp2p3 = MyMath.calcDistance(this.p2,this.p3);	//b
		this.dp1p2 = MyMath.calcDistance(this.p1,this.p2);	//a
		
		this.a = 1/this.dp1p2;
		this.b = 1/this.dp2p3;
		this.c = 1/this.dp1p3;

		//Calculate sin and cos of the angle in p1
        this.cos_ang_p1 = (Math.pow(this.dp1p3,2) - Math.pow(this.dp2p3,2) + Math.pow(this.dp1p3,2))/(2*this.dp1p3*this.dp1p3); //cos(alpha)
		this.sin_ang_p1 = Math.sqrt(1-Math.pow(this.cos_ang_p1,2)); //sin(alpha)

        this.texCoords = [];
		
		//Calculate texture coordinates
		this.texCoords.push(0,1);
		this.texCoords.push(this.dp1p2,1);
		this.texCoords.push(this.dp1p3*this.cos_ang_p1, 1-this.dp1p3*this.sin_ang_p1);

		//=====================================================
        
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
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

	needsLengths() {
		return true;
	}

	setLengths(length_s,length_t) {
		if (length_t == null) {
			length_t = 1;
		}
		if (length_s == null) {
			length_s = 1;
		}

		this.length_s = length_s;
		this.length_t = length_t;

		this.texCoords = [];
		
		this.texCoords.push(0,1);
		this.texCoords.push(this.a/this.length_s,1);
		this.texCoords.push(this.c*this.cos_ang_p1/this.length_s,this.c*this.sin_ang_p1/this.length_t);

		this.updateTexCoordsGLBuffers();
	}
}

