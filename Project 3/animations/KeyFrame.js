/**
 * KeyFrame
 * @constructor
 * @param instant - The instant of the animation in seconds
 */
class KeyFrame {
    constructor(instant) {
        this.instant = instant * 1000;  // Converts the instant to milliseconds

        //Initializes transformations
        this.finalTranslation = [0,0,0];
        this.finalRotation = [0,0,0];
        this.finalScale = [1,1,1];
    }

    /**
     * Sets the translaion vector of the keyframe
     * @param {Float} x 
     * @param {Float} y 
     * @param {Float} z 
     */
    setTranslation(x,y,z) {
        this.finalTranslation =  [x,y,z];
    }

    /**
     * Sets the rotation vector of the keyframe
     * @param {Float} x 
     * @param {Float} y 
     * @param {Float} z 
     */
    setRotation(x,y,z) {
        this.finalRotation = [x,y,z];
    }

    /**
     * Sets the scale vector of the keyframe
     * @param {Float} x 
     * @param {Float} y 
     * @param {Float} z 
     */
    setScale(x,y,z) {
        this.finalScale = [x,y,z];
    }
}