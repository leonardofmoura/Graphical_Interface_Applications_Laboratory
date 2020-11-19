class AnimatedCamera extends CGFcamera {
    constructor( fov, near, far, position, target ) {
        super(fov,near,far,position,target);

        this.animationTime = 1;

        this.currentTime = null;
        this.targetTime  = null;
        this.animationStartingTime = null;
        this.animComplete = false;
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
        returnVec[3] = this.interpolateValue(startingTime,endingTime,startingVec[3],endingVec[3],currentTime);

        return returnVec;
    }

    update(t) {
        this.currentTime = t;

        if (this.currentTime != null && this.targetTime != null && this.animationStartingTime != null && t <= this.targetTime) {
            this.fov = this.interpolateValue(this.animationStartingTime,this.targetTime,this.savedFov,this.targetFov,t);
            this.near = this.interpolateValue(this.animationStartingTime,this.targetTime,this.savedNear,this.targetNear,t);
            this.far = this.interpolateValue(this.animationStartingTime,this.targetTime,this.savedFar,this.targetFar,t);
            this.position = this.interpolateVectors(this.animationStartingTime,this.targetTime,this.savedPosition,this.targetPosition,t);
            this.target = this.interpolateVectors(this.animationStartingTime,this.targetTime,this.savedTar,this.targetTar,t);
            this.direction = this.interpolateVectors(this.animationStartingTime,this.targetTime,this.savedDir,this.targetDir,t);
        }
        else if (t > this.targetTime && !this.animComplete) {
            this.near = this.targetNear;
            this.far = this.targetFar;
            this.position = this.targetPosition;
            this.fov = this.targetFov;
            this.target = this.targetTar;
            this.animComplete = true;
        }
    }

    setTarget(fov, near, far, position, target,direction) {
        this.savedFov = this.fov;
        this.savedNear = this.near;
        this.savedFar = this.far;
        this.savedPosition = this.position;
        this.savedTar = this.target;
        this.savedDir = this.direction;
        
        this.targetFov = fov;
        this.targetNear = near;
        this.targetFar = far;
        this.targetPosition = position;
        this.targetTar = target;
        this.targetDir = direction;
        this.targetTime = this.currentTime + this.animationTime * 1000;
        this.animationStartingTime = this.currentTime;
        this.animComplete = false;
    }
}