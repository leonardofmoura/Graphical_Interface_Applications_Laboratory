/**
 * MyComponent
 * @constructor
 * @extends CGFobject
 * @param scene - Reference to MyScene object
 * @param id - Id of the component
 * @param transformation - Transformation matrix associated to the component
 */
class MyComponent extends CGFobject {
	constructor(scene,id) {
        super(scene);

        this.id = id;
        this.transformation = mat4.create();

        this.futureChildrenCompIDs = [];    //IDs of children components that may not be defined yet

        this.children = [];                 //Actual children

        this.materials = [];   
        this.currentMaterial = 0;

        this.texture= 0;
        this.inheritTexture = false;
        this.nullTexture = false;

        this.length_s = 1;
        this.length_t = 1;

        this.keyFrameAnimation;
    }

    /**
     * Sets the transformation matrix
     * @param {mat4} transMatrix 
     */
    setTransformation(transMatrix) {
        this.transformation = transMatrix;
    }

    /**
     * Sets animation in the component
     * @param {KeyFrameAnimation} animation
     */
    setAnimation(animation) {
        this.keyFrameAnimation = animation;
    }

    /**
     * Adds a new child to the component
     * @param child 
     */
    addChild(child) {
        this.children.push(child);
    }

    /**
     * Adds a new future child to the component
     * @param {String} compChild - ID of a child that will be added in the future
     */
    addFutureCompChild(compChild) {
        this.futureChildrenCompIDs.push(compChild);
    }

    /**
     * Returns the future children of the component and resets the array;
     */
    getFutureChildren() {
        var ret = this.futureChildrenCompIDs;
        this.futureChildrenCompIDs = [];
        return ret;
    }


    /**
     * Adds a new material to the component 
     * @param {CGFappearance} material 
     */
    addMaterial(material) {
        this.materials.push(material);
    }

    /**
     * Cycles to the next material for a component and it's children
     */
    cycleMaterial() {
        this.currentMaterial++;

        if (this.currentMaterial == this.materials.length) {
            this.currentMaterial = 0;
        }

        for (var i = 0; i < this.children.length; i++) {
            this.children[i].cycleMaterial();
        }
    }

    /**
     * Set the component to inherit texture from the father
     */
    setInheritTexture() {
        this.inheritTexture = true;
    }

    /**
     * Sets the texture to be null
     */
    setNullTexture() {
        this.nullTexture = true;
    }

    /**
     * Sets the length of the components
     * @param {Float} length_s 
     * @param {Float} length_t 
     */
    setLengths(length_s,length_t)  {
        this.length_s = length_s;
        this.length_t = length_t;
    }

    /**
     * Returns false, since we cant define texture lengths for a component
     */
    needsLengths() {
		return false;
	}

    /**
     * Displays a component and it's children
     * @param {CGFmaterial} activeMat - Material active in the parent component 
     * @param {CGFtexture} activeTex - Texture active in the parent component 
     * @param {Float} lengthS - length_s passed by the parent component
     * @param {Float} lengthT - length_t passed by the parent component
     */
    display(activeMat,activeTex,lengthS,lengthT) {
        this.scene.pushMatrix();

        this.scene.multMatrix(this.transformation);

        //Check for animation matrix
        if (this.keyFrameAnimation != null) {
            this.keyFrameAnimation.apply();
        }


        var activeMaterial;
        var activeTexture;
        var activeLength_s;
        var activeLength_t;

        //process materials
        if (this.materials[this.currentMaterial].constructor.name == "MyNullMaterial") {
            activeMaterial = activeMat;
        }
        else {
            activeMaterial = this.materials[this.currentMaterial];
        }

        //process texture
        if (this.nullTexture) {
            activeTexture =  null;
        }
        else if (this.inheritTexture){
            activeTexture = activeTex;
        }
        else{
            activeTexture = this.texture;
        }

        //process lengths 
        if (this.inheritTexture) {
            activeLength_s = lengthS;
            activeLength_t = lengthT;
        }
        else {
            activeLength_s = this.length_s;
            activeLength_t = this.length_t;
        }


        activeMaterial.setTexture(activeTexture);

        activeMaterial.apply();

        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].needsLengths()) {
                this.children[i].setLengths(activeLength_s,activeLength_t);
            }

            this.children[i].display(activeMaterial,activeTexture,lengthS,lengthT);
        }

        this.scene.popMatrix();
    }
}

