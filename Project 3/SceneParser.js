class SceneParser {
    constructor(orchestrator) {
        this.loadedOK = false;
        this.orchestrator = orchestrator;

        //The file reader
        this.reader = new CGFXMLreader();
        this.scenes = [];

        //Reads the xml calling onXMLReady when finished
        this.reader.open('scenes/scenes.xml',this);
    }

    onXMLReady() {
        console.log("Scenes xml parsed");

        let root = this.reader.xmlDoc.documentElement;
        
        let error = this.parseXML(root);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOK = true;
        this.orchestrator.onScenesParsed(this.scenes);
    }

    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    parseXML(root) {
        if (root.nodeName != "scenes") {
            return "root tag must be <scenes>";
        }

        let nodes = root.children;

        let numScenes = 0;

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName != "scene") {
                return "Only the <scene> tag is supported";
            }

            let sceneID = this.reader.getString(nodes[i],'id');
            if (sceneID == null) {
                return "No defined id for texture";
            }

            //check for repeated ids
            if (this.scenes[sceneID] != null) {
                return "Scene ids must be unique " + sceneID + "is not";
            }

            let sceneFile = this.reader.getString(nodes[i],'file');
            if (sceneFile == null) {
                return "file not defined for scene with id " + sceneID; 
            }

            this.scenes[sceneID] = sceneFile;
            numScenes++;

            if (i == 0) {
                this.defaultScene = sceneID;
            }
        }

        if (numScenes == 0) {
            return "At least one scene must be defined";
        }

        return null;
    }
}