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

        this.idRoot = null; // The id of the root element.
        this.displayOk = null;

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
        this.displayOk = true;

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

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
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
        var children = viewsNode.children;
        // Checking if there is at least one child
        if (children.length == 0) {
            return "at least one view must be defined";
        }

        var firstId = this.reader.getString(children[0], 'id');
        this.defaultCameraId = this.reader.getString(viewsNode, 'default');
        //checking if defaultCameraId is a valid string; otherwise it becomes firstId
        if (this.defaultCameraId == null) {
            this.onXMLMinorError("unable to set default camera from <views> block; assuming first camera found as default");
            this.defaultCameraId = firstId;
        }

        this.views = [];
        var numViews = 0;

        var grandChildren = [];
        var nodeNames = [];

        //Go through all views
        for (var i = 0; i < children.length; i++) {
            // Checking if there is an invalid tag
            if (children[i].nodeName != 'perspective' && children[i].nodeName != 'ortho') {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current view.
            var viewId = this.reader.getString(children[i], 'id');
            if (viewId == null)
                return "no ID defined for view";
            // Checks for repeated IDs.
            if (this.views[viewId] != null)
                return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            nodeNames = [];
            grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Near clipping plane distance value
            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near))) {
                return "unable to parse near component of the view with ID " + viewId;
            }
            // Far clipping plane distance value
            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far))) {
                return "unable to parse far component of the view with ID " + viewId;
            }

            // Finding to and from properties
            var toIndex = nodeNames.indexOf("to");
            var fromIndex = nodeNames.indexOf("from");
            if (!(toIndex != -1 && fromIndex != -1)) {
                return "<to> and <from> must be defined as children of view with ID " + viewId;
            }

            // <to> and <from> are accepted in any order
            // Camera's target vector coordinates
            var to = this.parseCoordinates3D(grandChildren[toIndex], "<to> for view ID " + viewId);
            if (!Array.isArray(to)) {
                return to;
            }
            // Camera's position vector coordinates
            var from = this.parseCoordinates3D(grandChildren[fromIndex], "<from> for view ID " + viewId);
            if (!Array.isArray(from)) {
                return from;
            }

            // Only perspectives have an angle component
            if (children[i].nodeName == 'perspective') {
                // FOV angle value
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle))) {
                    return "unable to parse angle component of the view with ID " + viewId;
                }
                if (angle >= 180) {
                    this.onXMLMinorError("angle on view ID " + viewId + " is too big; it might cause magical creatures to appear...");
                }
                if (angle <= 0) {
                    this.onXMLMinorError("angle on view ID " + viewId + " is too low; it should be greater than 0...");
                }
                angle = angle * Math.PI / 180;

                // Checking if there are aditional children
                if (grandChildren.length != 2) {
                    this.onXMLMinorError("unknow tag on view ID " + viewId + "'s children");
                }

                var perspective = new CGFcamera(angle, near, far, vec3.fromValues(...from), vec3.fromValues(...to));
                this.views[viewId] = perspective;
            } else { // Orthogonal cameras have more components and an optional <up> child
                // Left bound of the frustrum
                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left))) {
                    return "unable to parse left component of the view with ID " + viewId;
                }
                // Right bound of the frustrum
                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right))) {
                    return "unable to parse right component of the view with ID " + viewId;
                }
                // Top bound of the frustrum
                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top))) {
                    return "unable to parse top component of the view with ID " + viewId;
                }
                // Bottom bound of the frustrum
                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom))) {
                    return "unable to parse bottom component of the view with ID " + viewId;
                }
                // Up vector default coordinates
                var up = [0, 1, 0];
                var upIndex = nodeNames.indexOf("up");

                // Checking if there are aditional tags
                if (grandChildren.length > 3) {
                    this.onXMLMinorError("the number of children of view ID " + viewId + " is not correct; ignoring not recognized tags");
                }
                // Checking if the third property is 'up'. If it isn't a camera with default 'up' will be created
                if (grandChildren.length == 3 && upIndex == -1) {
                    this.onXMLMinorError("unknow tag on " + viewId + "'s children; assuming up = (0, 1, 0)");
                }
                // If there is an up component it is parsed
                if (upIndex != -1) {
                    up = this.parseCoordinates3D(grandChildren[upIndex], "up component of view with ID " + viewId);
                    if (!Array.isArray(up)) {
                        return up;
                    }
                }

                var ortho = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(...from), vec3.fromValues(...to), vec3.fromValues(...up));
                this.views[viewId] = ortho;
            }

            numViews++;
        }

        // Views is a map, so we have to guarantee that its size isn't zero
        if (numViews == 0) {
            return "at least one view must be defined";
        }
        // Checking if default
        if (this.views[this.defaultCameraId] == null) {
            this.onXMLMinorError("default camera id does not exist in <views> block; assuming first camera found as default");
            this.defaultCameraId = firstId;
        }

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseGlobals(ambientsNode) {

        var children = ambientsNode.children;

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
            } else {
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
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false))) {
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                aux = 1;
            }

            enableLight = aux;

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
                } else
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
                } else
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
        //For each texture in textures block, check ID and file URL
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

            // Retrieving file information and checking if it was successful
            var file = this.reader.getString(children[i], 'file');
            if (file == null) {
                return "no file defined for texture ID " + textureID;
            }
            // Checking if the file extension is either png or jpg
            var png = file.match(/\.png$/i);
            var jpg = file.match(/\.jpg$/i);
            if (jpg == null && png == null) {
                return "invalid file extension for texture ID " + textureID;
            }

            var texture = new CGFtexture(this.scene, file);
            this.textures[textureID] = texture;

            numTextures++;
        }

        if (numTextures == 0) {
            return "at least one texture must be defined";
        }

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        var numMaterials = 0;

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

            // Flag used to skip to the next iteration of the for loop when an invalid tag is found on this material children
            var invalidTag = false;

            grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++) {
                var tag = grandChildren[j].nodeName;
                nodeNames.push(tag);
                if (tag != 'emission' && tag != 'ambient' && tag != 'diffuse' && tag != 'specular') {
                    this.onXMLMinorError("unknown tag <" + tag + "> on material ID " + materialID + ";ignoring this material");
                    invalidTag = true; //An invalid tag was found
                    break;
                }
            }

            if (invalidTag) {
                continue; //Skip this material
            }

            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (!(shininess != null && !isNaN(shininess) && shininess > 0))
                return "unable to parse shininess component of material ID " + materialID;

            // Searching for each component in the grandchildren array
            var emissionIndex = nodeNames.indexOf('emission');
            var ambientIndex = nodeNames.indexOf('ambient');
            var diffuseIndex = nodeNames.indexOf('diffuse');
            var specularIndex = nodeNames.indexOf('specular');
            // Checking if all 4 components exist
            if (emissionIndex == -1 || ambientIndex == -1 || diffuseIndex == -1 || specularIndex == -1) {
                this.onXMLMinorError("four components (emission, ambient, diffuse, specular) must be defined on material ID " + materialID + ";ignoring this material");
                continue;
            }
            // Getting the actual values of each component
            var emission = this.parseColor(grandChildren[emissionIndex], "emission tag of material ID " + materialID);
            var ambient = this.parseColor(grandChildren[ambientIndex], "ambient tag of material ID " + materialID);
            var diffuse = this.parseColor(grandChildren[diffuseIndex], "diffuse tag of material ID " + materialID);
            var specular = this.parseColor(grandChildren[specularIndex], "specular tag of material ID " + materialID);
            // Setting up the new material
            var material = new CGFappearance(this.scene);
            material.setShininess(shininess);
            material.setEmission(...emission);
            material.setAmbient(...ambient);
            material.setDiffuse(...diffuse);
            material.setSpecular(...specular);
            material.setTextureWrap('REPEAT', 'REPEAT');

            this.materials[materialID] = material;
            numMaterials++;
        }

        if (numMaterials == 0) {
            return "at least one material must be defined";
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
            // Specifications for the current transformation.

            var transfMatrix = this.parseSingleTransformation(grandChildren, transformationID);

            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];
        var numPrimitives = 0;

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
                return "no ID defined for primitive";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)";
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
            } else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                //FIXME: May need some sort of verification z1 > x1

                var triangle = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);
                this.primitives[primitiveId] = triangle;
            } else if (primitiveType == 'cylinder') {
                // base -> has to be positive
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base) && base > 0))
                    return "unable to parse base of the primitive properties for ID = " + primitiveId;

                // top -> has to be positive
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top) && top > 0))
                    return "unable to parse top of the primitive properties for ID = " + primitiveId;

                // height -> has to be positive
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height) && height > 0))
                    return "unable to parse height of the primitive properties for ID = " + primitiveId;

                // slices -> has to be greater than 2, otherwise it is not a valid object
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices >= 3))
                    return "unable to parse slices of the primitive properties for ID = " + primitiveId;

                // stacks -> has to be positive
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0))
                    return "unable to parse stacks of the primitive properties for ID = " + primitiveId;

                var cylinder = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);
                this.primitives[primitiveId] = cylinder;
            } else if (primitiveType == 'sphere') {
                // radius -> has to be positive
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius) && radius > 0))
                    return "unable to parse radius of the primitive properties for ID = " + primitiveId;

                // slices -> has to be greater than 2, otherwise it is not a valid object
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices >= 3)) //FIXME: change slices according to tests
                    return "unable to parse slices of the primitive properties for ID = " + primitiveId;

                // stacks -> has to be positive
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0)) //FIXME: change stacks according to tests
                    return "unable to parse stacks of the primitive properties for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);
                this.primitives[primitiveId] = sphere;
            } else if (primitiveType == 'torus') {
                // inner -> has to be positive
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner) && inner > 0))
                    return "unable to parse inner of the primitive properties for ID = " + primitiveId;

                // outer -> has to be positive and greater than inner radius
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer) && outer > 0 && outer >= inner))
                    return "unable to parse outer of the primitive properties for ID = " + primitiveId;

                // slices -> has to be greater than 2, otherwise it is not a valid object
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices >= 3)) //FIXME: change slices according to tests
                    return "unable to parse slices of the primitive properties for ID = " + primitiveId;

                // loops -> has to be positive
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops) && loops > 0)) //FIXME: change loops according to tests
                    return "unable to parse loops of the primitive properties for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
                this.primitives[primitiveId] = torus;
            }

            numPrimitives++;
        }

        // Checking if at least one primitive was defined
        if (numPrimitives == 0) {
            return "at least one primitive must be defined";
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

        // All ids are put in this array to check if all referenced components do exist
        this.componentIDs = [];
        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var currentID = this.reader.getString(children[i], 'id');
            if (currentID == null)
                return "no ID defined for componentID";
            this.componentIDs[i] = currentID;
        }

        // Any number of components.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id from the auxiliar array.
            var componentID = this.componentIDs[i];

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // : Component Transformations
            var transfMatrix;
            grandgrandChildren = grandChildren[transformationIndex].children;
            if (grandgrandChildren.length == 0)
                transfMatrix = mat4.create();
            else if (grandgrandChildren[0].nodeName == "transformationref") {
                var transRefID = this.reader.getString(grandgrandChildren[0], 'id');
                if (transRefID == null)
                    return "unable to parse transformation id of component ID " + componentID;
                transfMatrix = this.transformations[transRefID];
                if (transfMatrix == null) {
                    return "no such transformation with ID " + transRefID + " for component ID " + componentID;
                }
                if (grandgrandChildren.length > 1)
                    this.onXMLMinorError("Multiple transformations declared and/or referred on " + componentID + "; defaulting to first referred transformation.");
            }
            else
                transfMatrix = this.parseSingleTransformation(grandgrandChildren, " of component " + componentID);

            // : Component Materials
            var materials = [];
            grandgrandChildren = grandChildren[materialsIndex].children;
            for (var j = 0; j < grandgrandChildren.length; j++) {
                var materialID = this.reader.getString(grandgrandChildren[j], 'id');
                if (materialID == null)
                    return "unable to parse texture id of component ID " + componentID;
                if (!(materialID == "inherit") && this.materials[materialID] == null) {
                    return "no such material with ID " + materialID + " for component ID " + componentID;
                }
                if(componentID == this.idRoot && materialID == "inherit"){
                    return "Root component ID " + componentID + " cannot inherit materials";
                }
                materials.push(materialID);
            }

            // : Component Texture
            var textureID = this.reader.getString(grandChildren[textureIndex], 'id');
            if (textureID == null)
                return "unable to parse texture id of component ID " + componentID;
            if (this.textures[textureID] == null && !(textureID == "none") && !(textureID == "inherit")) {
                return "no such texture with ID " + textureID + " for component ID " + componentID;
            }
            if(componentID == this.idRoot && textureID == "inherit"){
                return "Root component ID " + componentID + " cannot inherit texture";
            }
            
            var ls = this.reader.getFloat(grandChildren[textureIndex], 'length_s', false); //|| 1;
            var lt = this.reader.getFloat(grandChildren[textureIndex], 'length_t', false); //|| 1;

        if((textureID == "none" || textureID == "inherit") && (ls != null || lt != null)){
            return "texture ID " + textureID + " does not accept length_s and length_t values (component " + componentID + ")";
        }   
        else if(textureID != "none" && textureID != "inherit") {
            if(ls == null)
                ls = 1;
            if(lt == null)
                lt = 1;
        }

            // : Component Children
            var compChildren = [];
            var primChildren = [];

            grandgrandChildren = grandChildren[childrenIndex].children;
            for (var j = 0; j < grandgrandChildren.length; j++) {
                if (grandgrandChildren[j].nodeName == "componentref") {
                    var compRef = this.reader.getString(grandgrandChildren[j], 'id');
                    if (compRef == null) {
                        return "unable to parse componentref id of component ID " + componentID;
                    }
                    if (this.componentIDs.indexOf(compRef) == -1) {
                        return "no such component with ID " + compRef + " for component ID " + componentID;
                    }
                    compChildren.push(compRef);
                }
                else if (grandgrandChildren[j].nodeName == "primitiveref") {
                    var primRef = this.reader.getString(grandgrandChildren[j], 'id');
                    if (primRef == null) {
                        return "unable to parse primitiveref id of component ID " + componentID;
                    }
                    if (this.primitives[primRef] == null) {
                        return "no such primitive with ID " + primRef + " for component ID " + componentID;
                    }
                    primChildren.push(primRef);
                }
                else
                    this.onXMLMinorError("component children must be componentref or primitiveref");
            }

            this.components[componentID] = new MyComponent(this.scene, componentID, transfMatrix, materials, textureID, compChildren, primChildren, ls, lt);
        }

        if (this.components[this.idRoot] == null) {
            return "root component ID " + this.idRoot + " not defined";
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

    /**
     * Parse a block of translations, scalations and/or rotations and return the resulting transformation matrix
     * @param {basic transformations applied to the matrix} stepList 
     * @param {internal id of the transformation} transformationID 
     */
    parseSingleTransformation(stepList, transformationID) {

        var transfMatrix = mat4.create();

        for (var j = 0; j < stepList.length; j++) {
            switch (stepList[j].nodeName) {
                case 'translate':
                    var coordinates = this.parseCoordinates3D(stepList[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'scale':
                    var coordinates = this.parseCoordinates3D(stepList[j], "scale transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    if (coordinates[0] == 0 || coordinates[1] == 0 || coordinates[2] == 0)
                        this.onXMLMinorError("0 scale has been made on transformation ID " + transformationID + "; objects might disappear");

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'rotate':
                    // axis
                    var axis = this.reader.getString(stepList[j], 'axis');
                    if (!(axis != null && typeof axis === 'string'))
                        return "unable to parse axis of the rotate transformation for ID " + transformationID;

                    // angle
                    var angle = DEGREE_TO_RAD * this.reader.getFloat(stepList[j], 'angle');
                    if (!(angle != null && !isNaN(angle)))
                        return "unable to parse angle of the rotate transformation for ID " + transformationID;

                    switch (axis) {
                        case 'x':
                            transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle);
                            break;
                        case 'y':
                            transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle);
                            break;
                        case 'z':
                            transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle);
                            break;

                    }
                    break;
            }
        }

        return transfMatrix;
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any displaying error, showing an error on the console.
     * @param {string} message
     */
    onDisplayError(message) {
        console.error("Display Error: " + message);
        this.displayOk = false;
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
     * Updates the chosen material for each component of the graph
     */
    updateMaterialIndexes(){
        this.componentIDs.forEach(element => {
            this.components[element].updateMaterialIndex();
        });
    }
    

    /**
     * Processes a node of the scene graph and calls itself recursively on the node's children.
     * Draws primitives and updates transformation matrices, textures and materials applied.
     * @param {string, which represents the id of a node in the graph} component 
     * @param {string, represents the id of the material passed down by the parent component} previousMaterialID
     * @param {string, represents the id of the texture passed down by the parent component} previousTextureID
     * @param {float, length_s value used on textures, passed down by parent component} previousLS
     * @param {float, length_t value used on textures, passed down by parent component} previousLT
     */
    processNode(component, previousMaterialID, previousTextureID, previousLS, previousLT) {        

        //If the component has been visited, then there is a loop on the scene graph
        if (this.components[component].visited) {
            this.onDisplayError("loop on scene graph; component ID " + component + " was already visited");
            return;
        }

        this.components[component].visited = true;

        var componentChildren = this.components[component].compChildren;
        var primitiveChildren = this.components[component].primChildren;

        this.scene.multMatrix(this.components[component].transfMat);

        if(this.components[component].getCurrentMaterialID() == "inherit")
            var currentMaterialID = previousMaterialID;
        else{
            var currentMaterialID =   this.components[component].getCurrentMaterialID(); 
        }

        if(this.components[component].texture == "inherit"){
            var currentTextureID = previousTextureID;
            var currentLS = previousLS;
            var currentLT = previousLT;
        }
        else{
            var currentTextureID =   this.components[component].texture; 
            var currentLS = this.components[component].lengthS;
            var currentLT = this.components[component].lengthT;
        }

        //componentChildren is a list of ID's
        for (var i = 0; i < componentChildren.length; i++) {
            //apply material
            this.materials[currentMaterialID].apply();
            //apply texture
            /*
            if(currentTextureID!= "none")
                this.textures[currentTextureID].bind();
                */
            this.scene.pushMatrix();
            this.processNode(componentChildren[i], currentMaterialID, currentTextureID, currentLS, currentLT);
            if (!this.displayOk) {
                this.onDisplayError("loop component stack: " + component);
                return;
            }
            this.scene.popMatrix();
            /*
            if(currentTextureID!= "none")
                this.textures[currentTextureID].unbind();
                */
        }

        //primitiveChildren is a list of ID's
        for (var i = 0; i < primitiveChildren.length; i++) {
            
            //apply material
            this.materials[currentMaterialID].apply();
            //apply texture
            if(currentTextureID!= "none") {
                this.textures[currentTextureID].bind();
                //length_s and length_t are only used on triangles and rectangles
                if(this.primitives[primitiveChildren[i]] instanceof MyRectangle ||
                    this.primitives[primitiveChildren[i]] instanceof MyTriangle)
                    this.primitives[primitiveChildren[i]].updateTexCoords(currentLS, currentLT);
            }
            this.scene.pushMatrix();
            this.primitives[primitiveChildren[i]].display();
            this.scene.popMatrix();
            if(currentTextureID!= "none")
                this.textures[currentTextureID].unbind();
        }

        this.components[component].visited = false;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.processNode(this.idRoot);
    }
}