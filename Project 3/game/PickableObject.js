/**
 * Represents a pickable object 
 */
class PickableObject extends CGFobject {
    constructor(scene) {
        super(scene);
    }

    /**
     * The function to be called when the object is picked
     */
    execPick() {
        console.error("execPick not implemented");
    }
}