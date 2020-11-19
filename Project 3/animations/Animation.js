/**
 * Animation - This class should not be instantiated
 * @constructor
 * @param scene - The scene where the animation will be applied
 */
class Animation {
    constructor(scene) {
        if (this.constructor == Animation) {
            throw new Error("Can't instantiate abstract class");
        }
    }

    /**
     * Update the animation time
     * @abstract 
     * @param {Integer} time - The current time 
     */
    update(time) {
        throw new Error("Update method must be implemeneted");
    }

    /**
     * Applies the current animation transformation matrix
     * @abstract
     */
    apply() {
        throw new Error("Apply method must be implememeted");
    }
}