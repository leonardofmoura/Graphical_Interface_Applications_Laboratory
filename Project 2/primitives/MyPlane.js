/**
 * MyPlane
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 */
class MyPlane extends Primitive {
    constructor(scene,npartsU, npartsV){
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.patch = null;


        this.initBuffers();
    }

    /**
     * Initializes the buffers of the primitive
     */
    initBuffers() {

        this.controlpoints = [
                        [0.5, 0.0, 0.5, 1 ],
                        [-0.5,  0.0, 0.5, 1 ],
                        [ 0.5, 0.0,-0.5, 1 ],
                        [ -0.5,  0.0, -0.5, 1 ]
        ];

        this.patch = new MyPatch(this.scene, 2, 2, this.npartsU, this.npartsV,this.controlpoints);
    }

    /**
     * Displays the primitive
     */
    display(){
        this.patch.display();
    }
}





