/**
 * Primitive
 * @constructor
 * @extends CGFobject
 * @param scene - Reference to MyScene object
 */
class Primitive extends CGFobject {
	constructor(scene) {
		super(scene);
	}
	
	/**
	 * Does nothing for primitives since they dont control what material they have
	 */
	cycleMaterial() {
        //Do nothing
        return;
    }

	/**
	 * Returns false, since it's the default behaviour of the function. 
	 * If a primitive can have texture lengths it should overload this function returning true
	 */
	needsLengths() {
        //Default behaviour for the function
		return false;
	}
}

