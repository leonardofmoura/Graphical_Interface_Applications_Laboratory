/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     * @extends CGFinterface
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        this.gui.add(this.scene, 'drawAxis').name("Display Axis");
        this.gui.add(this.scene, 'showSecCam').name("Security Camera");

        this.cameraControler = null;
        this.secCamControler = null;
        this.lightFolder = null;


        this.initKeys();

        return true;
    }

    loadScenes() {
        this.sceneControler = this.gui.add(this.scene.orchestrator,'selectedScene', this.scene.orchestrator.sceneNames).name('Selected Scene').onChange(this.scene.orchestrator.updateScene.bind(this.scene.orchestrator));
    }

    reset() {
        if (this.cameraControler != null) {
            this.gui.remove(this.cameraControler);
        }
        if (this.secCamControler != null) {
            this.gui.remove(this.secCamControler);
        }
        if (this.lightFolder != null) {
            this.gui.removeFolder(this.lightFolder);
        }
    }

    /**
     * Loads the interface for the cameras
     */
    loadCameras() {
        for (var key in this.scene.graph.views) {
            this.scene.cameraIDs.push(key); 
        }

        this.scene.selectedCamera = this.scene.graph.defaultViewID;
        this.scene.selectedSecurityCamera = this.scene.graph.defaultViewID;

        //dropdown for cameras 
        this.cameraControler = this.gui.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Active Camera').onChange(this.scene.updateCamera.bind(this.scene));

        //dropdown for sec camera
        this.secCamControler = this.gui.add(this.scene, 'selectedSecurityCamera', this.scene.cameraIDs).name('Security Camera').onChange(this.scene.updateSecCamera.bind(this.scene));

        this.scene.updateCamera();
        this.scene.updateSecCamera();
    }

    updateInterface() {
        this.cameraControler.updateDisplay();
    }

    /**
     * Loads the interface for the lights
     */
    loadLights() {
        this.lightFolder = this.gui.addFolder('Lights');
        this.lightFolder.open();

        var lights = this.scene.graph.lights;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightsEnabeled[key] = lights[key][0];
                this.lightFolder.add(this.scene.lightsEnabeled,key);
            }
        }
    }

    /**
     * Initializes key prcessing
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    /**
     * Processes the down pressing of a key
     * @param {*} event - The event of the key pressed
     */
    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    /**
     * Processes the release of a key
     * @param {*} event - The event of the key released
     */
    processKeyUp(event) {
        this.activeKeys[event.code]=false;

        if (event.key == 'm' || event.key == 'M') {
            this.scene.graph.cycleMaterials();
        }
    };

    /**
     * Checks if a given key is pressed
     * @param {*} keyCode The code of the key to be checked
     */
    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}