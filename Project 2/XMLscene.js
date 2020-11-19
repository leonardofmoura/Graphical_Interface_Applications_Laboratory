var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @extends CGFscene
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.timeSet = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.drawAxis = false;

        this.selectedCamera = "default";
        this.selectedSecurityCamera = "default";
        this.cameraIDs = [];

        this.lightsEnabeled = [];

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(10);

        this.secCamera = new MySecurityCamera(this);
        this.activeSecCamera = this.camera;
        this.activeCamera = this.camera;

        this.rtt = new CGFtextureRTT(this,this.gl.canvas.width, this.gl.canvas.height);
        this.secCamera.setTex(this.rtt);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /**
     * Sets the default appearance of the scene
     */
    setDefaultAppearance() {
        this.defaultMat = new CGFappearance(this);
        this.defaultMat.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.defaultMat.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.defaultMat.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.defaultMat.setShininess(10.0);


        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    /**
     * Updates the camera selected in the scene to camera selected in the inteface
     */
    updateCamera() {
        this.activeCamera = this.graph.views[this.selectedCamera];
        this.interface.setActiveCamera(this.activeCamera);
    }

    /**
     * Updates the camera used in the security camera to match the camera selected in the interface
     */
    updateSecCamera() {
        this.activeSecCamera = this.graph.views[this.selectedSecurityCamera];
    }


    /** 
     * Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.sceneInited = true;
        
        this.interface.loadCameras();

        this.interface.loadLights();
    }

    /**
     * Activates or disables lights according to the interface
     */
    processLights() {
        var index = 0;

        for (var key in this.lightsEnabeled) {
            if (this.lightsEnabeled.hasOwnProperty(key)) {
                if (this.lightsEnabeled[key]) {
                    this.lights[index].enable();
                }
                else {
                    this.lights[index].disable();
                }

                this.lights[index].update();
                index++;
            }
        }
    }

    /**
     * Updates animations and the security camera according to the current time
     * @param {Integer} t 
     */
    update(t) {
        //Update all animations
        if (this.sceneInited && !this.timeSet) {
            this.graph.setAnimationStartingTime(t);
            this.timeSet = true;
        }
        else if (this.sceneInited && this.timeSet) {
            this.graph.updateAnimations(t);
        }

        if (this.sceneInited) {
            this.secCamera.setTime(t);
        }
    }

    /**
     * Renders the scene.
     */
    render(activeCamera) {
        // ---- BEGIN Background, camera and axis setup
        this.camera = activeCamera;

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.drawAxis) {
            this.axis.display();
        }

        if (this.sceneInited) {
            //Process light interface
            this.processLights();

            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.defaultMat.apply();
            
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Displays the scene
     */
    display() {
        this.rtt.attachToFrameBuffer();
        this.render(this.activeSecCamera);
        this.rtt.detachFromFrameBuffer();
        this.render(this.activeCamera);

        this.gl.disable(this.gl.DEPTH_TEST);
        this.secCamera.display();
        this.gl.enable(this.gl.DEPTH_TEST);
    }
}