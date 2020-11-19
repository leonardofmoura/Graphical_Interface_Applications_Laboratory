/**
 * MyRectangle2
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class MyRectangle2 extends Primitive {
    constructor(scene)
    {
        super(scene);
        this.initBuffers();
    };

    initBuffers()
    {
        this.vertices = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0
        ];

        this.indices = [
            0, 1, 2,
            3, 2, 1
        ];


        this.normals = [ 0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1];


        this.texCoords = [
            0, 1,
            1, 1,
            0, 0,
            1, 0
        ]
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

    /**
     * Returnsn true because this primitive can have length_s and length_t set
     */
    needsLengths() {
        return true;
    }

    /**
     * Sets the texture lengths of the primitive
     * @param {*} length_s - Horizontal length
     * @param {*} length_t - Vertical length
     */
    setLengths(length_s,length_t) {
        if (length_t == null) {
            length_t = 1;
        }
        if (length_s == null) {
            length_s = 1;
        }

        this.texCoords = [
            0,1/length_t,
            1/length_s,1/length_t,
            0,0,
            1/length_s,0
        ];

        this.updateTexCoordsGLBuffers();
    }
}