var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.defaultViewID = this.reader.getString(viewsNode,'default');
        if (this.defaultViewID == null) {
            return "Invalid id for views";
        }

        this.views = [];

        var children = viewsNode.children;

        //iterate all children
        for (var i = 0; i < children.length; i++) {
            var viewType = children[i].nodeName;

            if (viewType != "perspective" && viewType != "ortho") {
                this.onXMLMinorError("unknown tag <" + viewType + ">");
                continue;
            }

            // Get id of the current view
            var viewID = this.reader.getString(children[i], 'id');
            if (viewID == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewID] != null)
                return "ID must be unique for each view (conflict: ID = " + viewID + ")";


            var grandChildren = children[i].children;

            //perspective cammeras
            if (viewType == 'perspective') {
                //Near
                var near = this.reader.getFloat(children[i],'near');
                if (!(near != null && !isNaN(near))) {
                    return "unable to parse near atribute for view with ID = " + viewID;
                }

                //far 
                var far = this.reader.getFloat(children[i],'far');
                if (!(far != null && !isNaN(far))) {
                    return "unable to parse far atribute for view with ID = " + viewID;
                }

                //angle
                var angle = this.reader.getFloat(children[i],'angle');
                if (!(angle != null && !isNaN(angle))) {
                    return "unable to parse angle atribute for view with ID = " + viewID;
                }

                //parse grandchildren
                if (grandChildren.length != 2) {
                    return "Wrong number of children for perpective with ID" + viewID;
                }
                else if (grandChildren[0].nodeName != "from") {
                    return "Missing node from for perpective with ID" + viewID;
                } 
                else if (grandChildren[1].nodeName != "to") {
                    return "Missing node to for perpective with ID" + viewID;
                }
                
                //from 
                var from = this.parseCoordinates3D(grandChildren[0],"view for ID " + viewID);

                //to
                var to = this.parseCoordinates3D(grandChildren[1],"view for ID " + viewID);
                
                this.views[viewID] = new CGFcamera(angle,near,far,from,to);
            }

            //Ortho cameras
            else if (viewType == 'ortho') {
                //Near
                var near = this.reader.getFloat(children[i],'near');
                if (!(near != null && !isNaN(near))) {
                    return "unable to parse near atribute for view with ID = " + viewID;
                }

                //far 
                var far = this.reader.getFloat(children[i],'far');
                if (!(far != null && !isNaN(far))) {
                    return "unable to parse far atribute for view with ID = " + viewID;
                }

                //left 
                var left = this.reader.getFloat(children[i],'left');
                if (!(left != null && !isNaN(left))) {
                    return "unable to parse left atribute for view with ID = " + viewID;
                }

                //right 
                var right = this.reader.getFloat(children[i],'right');
                if (!(right != null && !isNaN(right))) {
                    return "unable to parse right atribute for view with ID = " + viewID;
                }

                //top 
                var top = this.reader.getFloat(children[i],'top');
                if (!(top != null && !isNaN(top))) {
                    return "unable to parse top atribute for view with ID = " + viewID;
                }

                //bottom 
                var bottom = this.reader.getFloat(children[i],'bottom');
                if (!(bottom != null && !isNaN(bottom))) {
                    return "unable to parse bottom atribute for view with ID = " + viewID;
                }

                //parse granchildren
                if (grandChildren.length != 2 && grandChildren.length != 3) {
                    return "Wrong number of children for perpective with ID" + viewID;
                }
                else if (grandChildren[0].nodeName != "from") {
                    return "Missing node from for perpective with ID" + viewID;
                } 
                else if (grandChildren[1].nodeName != "to") {
                    return "Missing node to for perpective with ID" + viewID;
                }
                else if(grandChildren.length == 3 && grandChildren[2].nodeName != "up") {
                    return "Wrong name for node to for perpective with ID" + viewID;
                }

                //from 
                var from = this.parseCoordinates3D(grandChildren[0],"view for ID " + viewID);

                //to
                var to = this.parseCoordinates3D(grandChildren[1],"view for ID " + viewID);

                //up
                var up;

                if (grandChildren.length == 3) {
                    up = this.parseCoordinates3D(grandChildren[2],"view for ID " + viewID);
                }
                else {
                    up = [0,1,0];
                }

                this.views[viewID] = new CGFcameraOrtho(left,right,bottom,top,near,far,from,to,up);
            }
        }

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <globals> node.
     * @param {globals block element} globalsNode
     */
    parseGlobals(globalsNode) {

        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed globals");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        this.textures = [];

        var numTextures = 0;


        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";


            // Checks for repeated IDs.
                if (this.textures[textureID] != null)
                    return "ID must be unique for each texture (conflict: ID = " + textureID + ")";


            // Get filepath of the current texture.
            var textureFile = this.reader.getString(children[i], 'file');
            if (textureFile  == null)
                return "no file defined for texture with ID " + textureID;

            var texture = new CGFtexture(this.scene, textureFile);

            this.textures[textureID] = texture;
            numTextures++;
        }

        if (numTextures == 0)
            return "at least one texture must be defined";

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            //get shininess
            var shininess = this.reader.getFloat(children[i],'shininess');
            if (!(shininess != null && !isNaN(shininess))) {
                return "unable to parse shininess of the material for ID = " + materialID;
            }

            //create the material
            var material = new CGFappearance(this.scene);

            //parse grandChildren
            grandChildren = children[i].children;

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName){
                    case 'emission':
                        var emission = this.parseColor(grandChildren[j],"of the emission of the material for ID = " + materialID); 

                        material.setEmission(emission[0],emission[1],emission[2],emission[3]);
                        break;
                    
                    case 'ambient':
                        var ambient = this.parseColor(grandChildren[j],"of the ambient of the material for ID = " + materialID); 
                        
                        material.setAmbient(ambient[0],ambient[1],ambient[2],ambient[3]);
                        break;

                    case 'diffuse':
                        var diffuse = this.parseColor(grandChildren[j],"of the diffuse of the material for ID = " + materialID); 

                        material.setDiffuse(diffuse[0],diffuse[1],diffuse[2],diffuse[3]);
                        break;

                    case 'specular':
                        var specular = this.parseColor(grandChildren[j],"of the specular of the material for ID = " + materialID); 

                        material.setSpecular(specular[0],specular[1],specular[2],specular[3]);
                        break;
                }
            }

            //add material
            this.materials[materialID] = material;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;

            //creates identity matrix -> if there are no transformations, this will be the matrix returned
            var transfMatrix = mat4.create();

            var error = this.parseTransformationBlock(grandChildren,transfMatrix,transformationID);

            //check for errors
            if (error != null) {
                return error;
            }

            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the children of the <transformation> block
     * @param {children of transformation block element} transformationNodes - children of the <transformation> block
     * @param {mat4} transfMatrix - matrix where the transformation will be put 
     * @param transformationID - Id of the transformation
     */
    parseTransformationBlock(transformationNodes,transfMatrix,transformationID) {
        for (var i = 0; i < transformationNodes.length; i++) {
            switch (transformationNodes[i].nodeName) {

                case 'translate':
                    var coordinates = this.parseCoordinates3D(transformationNodes[i], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    var newMat = mat4.create();
                    mat4.translate(newMat, newMat, coordinates);
                    mat4.multiply(transfMatrix,transfMatrix,newMat);
                    break;

                case 'scale':                        
                    var scaleCoords = this.parseCoordinates3D(transformationNodes[i], "scale transformation for ID " + transformationID);
                    if (!Array.isArray(scaleCoords)) {
                        return scaleCoords;
                    }

                    var newMat = mat4.create();
                    mat4.scale(newMat, newMat, scaleCoords);
                    mat4.multiply(transfMatrix,transfMatrix,newMat);
                    break;

                case 'rotate':
                    var rotateAxisVec;
                    var rotateAxis = this.reader.getString(transformationNodes[i],'axis');
                    if (rotateAxis == null) {
                        return "unable to parse rotation axis transformation for ID = " + transformationID;
                    }

                    //check if rotation axis is valid
                    if (rotateAxis == "x") {
                        rotateAxisVec = [1,0,0];
                    }
                    else if (rotateAxis == "y") {
                        rotateAxisVec = [0,1,0];
                    }
                    else if (rotateAxis == "z") {
                        rotateAxisVec = [0,0,1];
                    }
                    
                    //if rotateAxisVec is not defined, the axis is invalid
                    if (rotateAxisVec == null){
                        return "Invalid rotation axis for transformation with ID " + transformationID;
                    }

                    var rotateAngle = this.reader.getFloat(transformationNodes[i],'angle');
                    if (!(rotateAngle != null && !isNaN(rotateAngle))) {
                        return "unable to parse rotation angle of the transformation for ID = " + transformationID;
                    }

                    var newMat = mat4.create();
                    mat4.rotate(newMat, newMat, rotateAngle * DEGREE_TO_RAD, rotateAxisVec);
                    mat4.multiply(transfMatrix,transfMatrix,newMat);
                    break;
            }
        }

        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }

            else if (primitiveType == 'triangle') {
                //x1
                var x1 = this.reader.getFloat(grandChildren[0],'x1');
                if (!(x1 != null && !isNaN(x1))) {
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                }

                //y1
                var y1 = this.reader.getFloat(grandChildren[0],'y1');
                if (!(y1 != null && !isNaN(y1))) {
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                }

                //z1
                var z1 = this.reader.getFloat(grandChildren[0],'z1');
                if (!(z1 != null && !isNaN(z1))) {
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                }

                //x2
                var x2 = this.reader.getFloat(grandChildren[0],'x2');
                if (!(x2 != null && !isNaN(x2))) {
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                }

                //y1
                var y2 = this.reader.getFloat(grandChildren[0],'y2');
                if (!(y2 != null && !isNaN(y2))) {
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                }

                //z1
                var z2 = this.reader.getFloat(grandChildren[0],'z2');
                if (!(z2 != null && !isNaN(z2))) {
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                }

                //x1
                var x3 = this.reader.getFloat(grandChildren[0],'x3');
                if (!(x3 != null && !isNaN(x3))) {
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                }

                //y1
                var y3 = this.reader.getFloat(grandChildren[0],'y3');
                if (!(y3 != null && !isNaN(y3))) {
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                }

                //z1
                var z3 = this.reader.getFloat(grandChildren[0],'z3');
                if (!(z3 != null && !isNaN(z3))) {
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                }

                var triangle = new MyTriangle(this.scene,primitiveId,[x1,y1,z1],[x2,y2,z2],[x3,y3,z3]);

                this.primitives[primitiveId] = triangle;
            }

            else if (primitiveType == 'cylinder') {
                //base 
                var base = this.reader.getFloat(grandChildren[0],'base');
                if (!(base != null && !isNaN(base))) {
                    return "unable to parse base of the primitive specifications for ID = " + primitiveId;
                }

                //top
                var top = this.reader.getFloat(grandChildren[0],'top');
                if (!(top != null && !isNaN(top))) {
                    return "unable to parse top of the primitive specifications for ID = " + primitiveId;
                }

                var height = this.reader.getFloat(grandChildren[0],'height');
                if (!(height != null && !isNaN(height))) {
                    return "unable to parse height of the primitive specifications for ID = " + primitiveId;
                }

                var slices = this.reader.getInteger(grandChildren[0],'slices');
                if (!(slices != null && !isNaN(slices))) {
                    return "unable to parse slices of the primitive specifications for ID = " + primitiveId;
                }

                var stacks = this.reader.getInteger(grandChildren[0],'stacks');
                if (!(base != null && !isNaN(base))) {
                    return "unable to parse stacks of the primitive specifications for ID = " + primitiveId;
                }

                var cylinder = new MyCylinder(this.scene,primitiveId,base,top,height,slices,stacks);

                this.primitives[primitiveId] = cylinder;
            }

            else if (primitiveType == 'sphere') {
                var radius = this.reader.getFloat(grandChildren[0],'radius');
                if (!(radius != null && !isNaN(radius))) {
                    return "unable to parse radius of the primitive specifications for ID = " + primitiveId;
                }

                var slices = this.reader.getInteger(grandChildren[0],'slices');
                if (!(slices != null && !isNaN(slices))) {
                    return "unable to parse slices of the primitive specifications for ID = " + primitiveId;
                }

                var stacks = this.reader.getInteger(grandChildren[0],'stacks');
                if (!(stacks != null && !isNaN(stacks))) {
                    return "unable to parse stacks of the primitive specifications for ID = " + primitiveId;
                }

                var sphere = new MySphere(this.scene,primitiveId,radius,slices,stacks);

                this.primitives[primitiveId] = sphere;
            }

            else if (primitiveType = 'torus') {
                var inner = this.reader.getFloat(grandChildren[0],'inner');
                if (!(inner != null && !isNaN(inner))) {
                    return "unable to parse inner radius of the primitive specifications for ID = " + primitiveId;
                }

                var outer = this.reader.getFloat(grandChildren[0],'outer');
                if (!(outer != null && !isNaN(outer))) {
                    return "unable to parse outer radius of the primitive specifications for ID = " + primitiveId;
                }

                var slices = this.reader.getInteger(grandChildren[0],'slices');
                if (!(slices != null && !isNaN(slices))) {
                    return "unable to parse slices of the primitive specifications for ID = " + primitiveId;
                }

                var loops = this.reader.getInteger(grandChildren[0],'loops');
                if (!(loops != null && !isNaN(loops))) {
                    return "unable to parse loops of the primitive specifications for ID = " + primitiveId;
                }

                var torus = new MyTorus(this.scene,primitiveId,inner,outer,slices,loops);

                this.primitives[primitiveId] = torus;
            }

            else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        //array of components IDs that may not be defined yet -> this is tested in the end
        var tempComponentIDs = [];
        var componentIDs = []; //used to store all component ids in order to set children

        // Do for each component
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            componentIDs.push(componentID);
            this.components[componentID] = new MyComponent(this.scene,componentID);

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            
            //============= TRANSFORMATIONS ===================================
            var transformationBlock = grandChildren[transformationIndex].children;

            var transfError = this.parseComponentTransformations(transformationBlock,componentID);

            //check for errors
            if (transfError != null) {
                return transfError;
            }

            //=================== MATERIALS =============================
            var materialBlock = grandChildren[materialsIndex].children;

            var matError = this.parseComponentMaterials(materialBlock,componentID);

            //check for errors
            if (matError != null) {
                return matError;
            }


            //==================== TEXTURES ===========================

             var textureBlock = grandChildren[textureIndex];

            var texError = this.parseComponentTexture(textureBlock,componentID);

            //check for errors
            if (texError != null) {
                return texError;
            }

            //=================== CHILDREN =============================
            var childrenBlock = grandChildren[childrenIndex].children;

            var childError = this.parseComponentChildren(childrenBlock,componentID,tempComponentIDs);

            //check for errors
            if (childError != null) {
                return childError;
            }

        }

        //load children
        this.loadChildren(tempComponentIDs,componentIDs);

        return null;
    }

    /**
     * Parses the transformations block of a component
     * @param {Transformation block} transformationBlock 
     * @param {String} componentID 
     */
    parseComponentTransformations(transformationBlock,componentID) {
        //test if transformation is a reference
        if (transformationBlock[0] != null && transformationBlock[0].nodeName == "transformationref") {
            var id = this.reader.getString(transformationBlock[0],'id');
            if (id == null || this.transformations[id] == null) {
                return "unable to reference transformation for component ID = " + componentID;
            }

            //check if transformation id exists
            if (this.transformations[id] == null) {
                return "Transformation reference id does not exist for component ID " + componentID;
            }
            //the transformation exists -> create component
            else {
                this.components[componentID].setTransformation(this.transformations[id]);
            }
        }
        //if it is not a reference then it is either empty or a normal set of new transformations
        //either way we can use the parseTransformationBlock() function
        else {
            //creates identity matrix -> if there are no transformations, this will be the matrix returned
            var transfMatrix = mat4.create();

            var error = this.parseTransformationBlock(transformationBlock,transfMatrix,"Component " + componentID);

            //check for errors
            if (error != null) {
                return error;
            }

            this.components[componentID].setTransformation(transfMatrix);
        }

        return null;
    }

    /**
     * Parses the materials block of a component
     * @param {Material block} materialBlock 
     * @param {String} componentID - Id of the component
     */
    parseComponentMaterials(materialBlock,componentID) {
        for (var m = 0; m < materialBlock.length; m++) {
            if (materialBlock[m].nodeName == "material") {
                var material = this.reader.getString(materialBlock[m],'id');
                if ((material == null || this.materials[material] == null) && material != "inherit") {
                    return "Unable to reference material for component " + componentID;
                }

                //Check if it has to inherit material
                if (material == "inherit") {
                    this.components[componentID].addMaterial(new MyNullMaterial(this.scene));
                }
                else {
                    this.components[componentID].addMaterial(this.materials[material]);
                }
            }
            else {
                return "Invalid value for material in component " + componentID;
            }
        }

        return null
    }


    /**
     * Parses the textures block of a component
     * @param {Texture block} Texture Block
     * @param {String} componentID - Id of the component
     */
    parseComponentTexture(texture,componentID) {
        var textureID = this.reader.getString(texture, 'id'); // retrieves the texture ID
        var length_s = this.reader.getString(texture,'length_s',null); //retrieves the length_s component
        var length_t = this.reader.getString(texture,'length_t',null); //retrieves the length_t component


         //check if texture id is valid
        if (textureID == null) {
            return "Texture reference id does not exist for component ID " + componentID;
        }


        if (textureID == 'inherit' || textureID =="none"){
            if (textureID == 'inherit'){
                this.components[componentID].setInheritTexture();
            }
            else if(textureID == 'none'){
                this.components[componentID].setNullTexture();
            }
        }
        //check if texture exists
        else if (this.textures[textureID] == null) {
            return "Texture reference id does not exist for component ID " + componentID;
        }
        else {
            if (length_s != null && length_t != null) {
                this.components[componentID].setLengths(length_s,length_t);
            }
            this.components[componentID].texture =this.textures[textureID];
        }

        return null
    }

    /**
     * Parses the children block of a component
     * @param {Children Block} childrenBlock 
     * @param {String} componentID - Id of the component
     * @param {Array} tempComponentIDs - Array of temporary component ids
     */
    parseComponentChildren(childrenBlock,componentID,tempComponentIDs) {
        for (var c = 0; c < childrenBlock.length; c++) {
            if (childrenBlock[c].nodeName == "componentref") {
                var tempComponentId = this.reader.getString(childrenBlock[c],'id');
                if (tempComponentId == null) {
                    return "unable to reference component for component ID = " + componentID;
                }

                this.components[componentID].addFutureCompChild(tempComponentId);
                tempComponentIDs.push(tempComponentId);
            }
            else if (childrenBlock[c].nodeName == "primitiveref") {
                var primitiveID = this.reader.getString(childrenBlock[c],'id');
                if (primitiveID == null) {
                    return "unable to reference primitive for component ID = " + componentID;
                }

                this.components[componentID].addChild(this.primitives[primitiveID]);
            }
            else {
                return "Invalid value for children in component " + componentID;
            }
        }

        return null;
    }

    /**
     * Post procesess the children
     * @param {Array} tempComponentIDs 
     * @param {Array} componentIDs 
     */
    loadChildren(tempComponentIDs,componentIDs) {
        //Verifies all future children
        for (var i = 0; i < tempComponentIDs.length; i++) {
            if (this.components[tempComponentIDs[i]] == null) {
                return this.components[tempComponentIDs[i]] + "does not exist";
            }
        }

        //Now that we know all children exist we can add them to their parents
        for (var i = 0; i < componentIDs.length; i++) {
            var currComp = this.components[componentIDs[i]];

            //get future children
            var currCompFutChild = currComp.getFutureChildren();
            
            //Add them all
            for (var j = 0; j < currCompFutChild.length; j++) {
                currComp.addChild(this.components[currCompFutChild[j]]);
            }
        }
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To test the parsing/creation of the primitives, call the display function directly

        this.components[this.idRoot].display(this.scene.defaultMat,null,null,null);
        
        //Lets leave this clean to ease future testing
    }

    /**
     * Cycles the materials for all the scene
     */
    cycleMaterials() {
        this.components[this.idRoot].cycleMaterial();
    }
}