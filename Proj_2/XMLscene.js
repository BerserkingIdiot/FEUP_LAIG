var DEGREE_TO_RAD = Math.PI / 180;
var FPS_60 = 1000 / 60;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
  /**
   * @constructor
   * @param {MyInterface} myinterface
   */
  constructor(myinterface) {
    super();

    this.interface = myinterface;
  }

  /**
   * Initializes the scene, setting some WebGL defaults, initializing the camera
   * and the axis.
   * @param {CGFApplication} application
   */
  init(application) {
    super.init(application);

    this.sceneInited = false;

    this.initCameras();

    this.enableTextures(true);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);
    this.setUpdatePeriod(FPS_60);

    // Camera interface related variables
    this.cameraIDs = [];
    this.securityIDs = [];
    this.selectedCamera = null;
    this.selectedSecurityCamera = null;
    // Light interface variable. Holds key value pairs as light_id -> index
    this.lightIDs = new Object();
    // Texture for render to texture
    this.rttTexture = new CGFtextureRTT(this, window.innerWidth, window.innerHeight);
    this.securityUI = new MySecurityCamera(this, this.rttTexture);
  }

  /**
   * Initializes the scene camera
   */
  initCameras() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
  }

  /**
   * Initializes the scene cameras according to graph information.
   */
  initGraphCameras() {
    // Every id is saved so cameras can be manipulated on the interface
    for (var key in this.graph.views) {
      // Checking if the camera does not have security in its id
      if(key.search(/security/i) == -1)
        this.cameraIDs.push(key); // This array will contain all normal cameras' ids
      else
        this.securityIDs.push(key); // This array will contain all security cameras' ids
    }

    // Currently active camera is set to the default camera
    this.selectedCamera = this.graph.defaultCameraId;
    this.selectedSecurityCamera = this.selectedCamera;
  }
  /**
   * Initializes the scene lights with the values read from the XML file.
   */
  initLights() {
    var i = 0;
    // Lights index.

    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
      if (i >= 8) break;  // Only eight lights allowed by WebGL.

      // Adds the light id and index to an object to be manipulated by the
      // interface
      this.lightIDs[key] = i;

      if (this.graph.lights.hasOwnProperty(key)) {
        var light = this.graph.lights[key];

        this.lights[i].setPosition(
            light[2][0], light[2][1], light[2][2], light[2][3]);
        this.lights[i].setAmbient(
            light[3][0], light[3][1], light[3][2], light[3][3]);
        this.lights[i].setDiffuse(
            light[4][0], light[4][1], light[4][2], light[4][3]);
        this.lights[i].setSpecular(
            light[5][0], light[5][1], light[5][2], light[5][3]);
        this.lights[i].setConstantAttenuation(light[6]);
        this.lights[i].setLinearAttenuation(light[7]);
        this.lights[i].setQuadraticAttenuation(light[8]);

        if (light[1] == 'spot') {
          this.lights[i].setSpotCutOff(light[9]);
          this.lights[i].setSpotExponent(light[10]);
          this.lights[i].setSpotDirection(
              light[11][0], light[11][1], light[11][2]);
        }

        // Uncomment following line to see the light sources in the scene
        // this.lights[i].setVisible(true);
        if (light[0])
          this.lights[i].enable();
        else
          this.lights[i].disable();

        this.lights[i].update();

        i++;
      }
    }
  }

  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }
  /**
   * Handler called when the graph is finally loaded.
   * As loading is asynchronous, this may be called already after the
   * application has started the run loop
   */
  onGraphLoaded() {
    this.axis = new CGFaxis(this, this.graph.referenceLength);

    this.gl.clearColor(
        this.graph.background[0], this.graph.background[1],
        this.graph.background[2], this.graph.background[3]);

    this.setGlobalAmbientLight(
        this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2],
        this.graph.ambient[3]);

    this.initGraphCameras();
    this.initLights();

    // Updating the interface with the new options
    this.interface.initInterface();

    this.sceneInited = true;
  }

  /**
   * Update's the materials if key M has been pressed
   * @param {update period set on scene's initialization} t
   */
  update(t) {
    if (this.sceneInited) {
      if (this.interface.isKeyPressed('KeyM')) {
        this.graph.updateMaterialIndexes();
      }
      this.graph.updateKeyframeAnimations(t - this.startTime);
      this.securityUI.updateShader(t - this.startTime);
    } else
      this.startTime = t; // Only when the scene is initiated we start to count the elapsed time
  }

  /**
   * Renders the scene.
   *
   * @param  {camera used as view point} camera
   */
  render(currentCamera) {
    // ---- BEGIN Background, camera and axis setup

    // The following line enables camera movement and zoom on the scene
    this.camera = this.graph.views[currentCamera];
    this.interface.setActiveCamera(this.camera);

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to
    // the origin
    this.applyViewMatrix();

    this.pushMatrix();
    this.setDefaultAppearance();
    this.axis.display();

    // Updating lights to enable and disable them
    for (var i = 0; i < this.lights.length; i++) {
      this.lights[i].update();
    }

    if (this.graph.displayOk) {
      // Draw axis
      this.setDefaultAppearance();

      // Displays the scene (MySceneGraph function).
      this.graph.displayScene();
    }

    this.popMatrix();
    // ---- END Background, camera and axis setup
  }
  /**
   * Displays the scene
   */
  display() {
    if(this.sceneInited){
      // Renders the scene to a texture using the security camera
      this.rttTexture.attachToFrameBuffer();
      this.render(this.selectedSecurityCamera);
      this.rttTexture.detachFromFrameBuffer();

      // Renders the scene using the currently selected camera
      this.render(this.selectedCamera);

      // Displaying the security camera UI
      // Depth test has to be disable because the UI overlaps the scene
      this.gl.disable(this.gl.DEPTH_TEST);
      this.securityUI.display();
      this.gl.enable(this.gl.DEPTH_TEST);
    }
  }
}