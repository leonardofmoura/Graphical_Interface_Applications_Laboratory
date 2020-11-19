/**
 * MyPatch
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 */
class MyPatch extends Primitive{

    constructor(scene,npointsU,npointsV,npartsU,npartsV, controlpoints){
	super(scene);
    this.npointsU = npointsU;
    this.npointsV = npointsV;
    this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.controlpoints = controlpoints;
	this.obj = null;
    this.initBuffers();
    }

    /**
     * Initializes the buffers of the primitive
     */
    initBuffers() {

        this.degree1 = this.npointsU - 1;
        this.degree2 = this.npointsV - 1;


        this.controlvertexes = [];


        for (let i = 0 ; i< this.npointsU; i++){
            let vertexes = [];
            for (let j = 0 ; j< this.npointsV ; j++){
                vertexes.push(this.controlpoints.shift());
            }
            this.controlvertexes.push(vertexes);
        }

        this.nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlvertexes);

        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface );
    }
    
    /**
     * Displays the primitive
     */
    display(){
        this.obj.display();
    }


}

