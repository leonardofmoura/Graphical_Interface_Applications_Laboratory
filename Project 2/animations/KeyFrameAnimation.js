/**
 * KeyFrameAnimation
 * @constructor
 * @extends Animation
 * @param scene - The scene where the animation will be applied
 */
class KeyFrameAnimation extends Animation{
    constructor(scene) {
        super(scene);

        this.scene = scene;

        this.startTime = 0;
        this.animation_matrix = mat4.create();

        this.nullKeyFrame = new KeyFrame(0);

        this.keyframes = [];
    }

    /**
     * Adds a new keyframe to the animation (Assumes keyframes are added in order)
     * @param {Keyframe} keyframe 
     */
    addKeyFrame(keyframe) {
        this.keyframes.push(keyframe);
    }

    /**
     * Sets the starting time of the animation
     * @param {Integer} startingTime 
     */
    setStartingTime(startingTime) {
        this.startTime = startingTime;
    }

    /**
     * Calculates the linear interpolation of the parameters given
     * @param {Float} startingTime - The starting time of the keyframe
     * @param {Float} endingTime - The ending time of the keyframe
     * @param {Float} startingValue - The initial value of the keyframe
     * @param {Float} endingValue - The final value of the keyframe
     * @param {Float} currentTime - The current time
     * @returns Float - the linear interpolation of the values
     */
    interpolateValue(startingTime,endingTime,startingValue,endingValue,currentTime) {
        let returnValue;

        returnValue = startingValue + (currentTime - startingTime) * (endingValue - startingValue) / (endingTime - startingTime);

        return returnValue;
    }

    /**
     * Calculates the linear interpolation of the vectors given
     * @param {Float} startingTime - The starting time of the keyframe
     * @param {Float} endingTime - The ending time of the keyframe
     * @param {FloatArray} startingVec - Vector containing the staring values 
     * @param {FloatArray} endingVec - Vector containg the final values 
     * @param {Float} currentTime - The current time
     * @returns FloatArray - The interpolation of the two vectors
     */
    interpolateVectors(startingTime,endingTime,startingVec,endingVec,currentTime) {
        let returnVec = [];

        returnVec[0] = this.interpolateValue(startingTime,endingTime,startingVec[0],endingVec[0],currentTime);
        returnVec[1] = this.interpolateValue(startingTime,endingTime,startingVec[1],endingVec[1],currentTime);
        returnVec[2] = this.interpolateValue(startingTime,endingTime,startingVec[2],endingVec[2],currentTime);

        return returnVec;
    }

    /**
     * Updates the animation transformation matrix according to the current time
     * @param {Integer} currentTime 
     */
    update(currentTime) {
        let time = currentTime - this.startTime;

        // stay in the last keyframe
        if (time >= this.keyframes[this.keyframes.length - 1].instant) {
            let lastKeyframe = this.keyframes.length - 1;
            mat4.identity(this.animation_matrix); //reset the matrix
            mat4.translate(this.animation_matrix,this.animation_matrix,this.keyframes[lastKeyframe].finalTranslation);
            mat4.rotateX(this.animation_matrix,this.animation_matrix,MyMath.degreeToRad(this.keyframes[lastKeyframe].finalRotation[0]));
            mat4.rotateY(this.animation_matrix,this.animation_matrix,MyMath.degreeToRad(this.keyframes[lastKeyframe].finalRotation[1]));
            mat4.rotateZ(this.animation_matrix,this.animation_matrix,MyMath.degreeToRad(this.keyframes[lastKeyframe].finalRotation[2]));
            mat4.scale(this.animation_matrix ,this.animation_matrix,this.keyframes[lastKeyframe].finalScale);            
        }
        else {
            for (var i = 0; i < this.keyframes.length; i++) {
                // first keyframe
                if (i == 0 && time < this.keyframes[i].instant) {
                    mat4.identity(this.animation_matrix); //reset the matrix
                    mat4.translate(this.animation_matrix,this.animation_matrix,this.interpolateVectors(this.nullKeyFrame.instant,this.keyframes[i].instant,this.nullKeyFrame.finalTranslation,this.keyframes[i].finalTranslation,time));
                    mat4.rotateX(this.animation_matrix,this.animation_matrix,this.interpolateValue(this.nullKeyFrame.instant,this.keyframes[i].instant,MyMath.degreeToRad(this.nullKeyFrame.finalRotation[0]),MyMath.degreeToRad(this.keyframes[i].finalRotation[0]),time));
                    mat4.rotateY(this.animation_matrix,this.animation_matrix,this.interpolateValue(this.nullKeyFrame.instant,this.keyframes[i].instant,MyMath.degreeToRad(this.nullKeyFrame.finalRotation[1]),MyMath.degreeToRad(this.keyframes[i].finalRotation[1]),time));
                    mat4.rotateZ(this.animation_matrix,this.animation_matrix,this.interpolateValue(this.nullKeyFrame.instant,this.keyframes[i].instant,MyMath.degreeToRad(this.nullKeyFrame.finalRotation[2]),MyMath.degreeToRad(this.keyframes[i].finalRotation[2]),time));
                    mat4.scale(this.animation_matrix ,this.animation_matrix,this.interpolateVectors(this.nullKeyFrame.instant,this.keyframes[i].instant,this.nullKeyFrame.finalScale,this.keyframes[i].finalScale,time));
    
                    break;
    
                }
                else if (time < this.keyframes[i].instant && time > this.keyframes[i-1].instant) {
                    mat4.identity(this.animation_matrix); //reset the matrix
                    mat4.translate(this.animation_matrix,this.animation_matrix,this.interpolateVectors(this.keyframes[i-1].instant,this.keyframes[i].instant,this.keyframes[i-1].finalTranslation,this.keyframes[i].finalTranslation,time));
                    mat4.rotateX(this.animation_matrix,this.animation_matrix,this.interpolateValue(this.keyframes[i-1].instant,this.keyframes[i].instant,MyMath.degreeToRad(this.keyframes[i-1].finalRotation[0]),MyMath.degreeToRad(this.keyframes[i].finalRotation[0]),time));
                    mat4.rotateY(this.animation_matrix,this.animation_matrix,this.interpolateValue(this.keyframes[i-1].instant,this.keyframes[i].instant,MyMath.degreeToRad(this.keyframes[i-1].finalRotation[1]),MyMath.degreeToRad(this.keyframes[i].finalRotation[1]),time));
                    mat4.rotateZ(this.animation_matrix,this.animation_matrix,this.interpolateValue(this.keyframes[i-1].instant,this.keyframes[i].instant,MyMath.degreeToRad(this.keyframes[i-1].finalRotation[2]),MyMath.degreeToRad(this.keyframes[i].finalRotation[2]),time));
                    mat4.scale(this.animation_matrix ,this.animation_matrix,this.interpolateVectors(this.keyframes[i-1].instant,this.keyframes[i].instant,this.keyframes[i-1].finalScale,this.keyframes[i].finalScale,time));
    
                    break;
                }
                else {
                    mat4.identity(this.animation_matrix);
                }
            }
        }
    }

    /**
     * Applies the animation, applying the current transformation matrix
     */
    apply() {
        this.scene.multMatrix(this.animation_matrix);
    }
}