// Handles the Photo App Application
class PhotoApp {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // Photo Group
    this.group = null;

    // Set the webcam
    this.camera = new WebCam(160, 120);

    this.snapTaken = false;

    // Set The Ascii Filter (Extension)
    this.asciiVideo = new AsciiVideo();

    // Set the User Interface
    this.ui = new UserInterface();

    // Get the last saved filter
    let savedFilter = localStorage.getItem("activeFilter") || "normal";

    if (savedFilter) {
      this.camera.currentFilter = savedFilter;
    }

    // Load Saved Photo Frames from Local Storage
    if (localStorage.getItem("snapshot")) {
      loadImage(localStorage.getItem("snapshot"), (img) => {
        this.snapShot = img;
        this.snapTaken = true;
        this.group = new PhotoGroup(this.x + 550, this.y + 50, 5, 3, img);
        this.group.setup(this.ui);
        this.group.frames[12].image = this.camera.faceBuffer;
      });
    }
  }

  setup() {
    // Initialize the camera
    this.camera.initializeCam();

    // Initialize user interface
    this.ui.setup(this);

    // Add the frame
    this.cameraFrame = new Frame(this.x + 50, this.y + 50);

    // Ascii Video Setup
    this.asciiVideo.asciiSetup();
  }

  draw() {
    // Draw Snap Button
    this.ui.drawSnapButton(this.x, this.y);
    this.ui.drawInstructions();

    // Draw Web Cam Frame
    this.cameraFrame.draw();

    // Set The Webcam
    this.cameraFrame.drawCamera(this.camera);

    // Detects Face from Webcam
    this.camera.detection();

    // If press snap button
    if (this.snapTaken && this.group) {
      this.group.draw();
      this.ui.drawFrameLabels(this.group.frames);
      this.ui.drawSliderValues(this.group.frames);
      this.group.frames[12].image = this.camera.faceBuffer;
    }

    // ASCII Camera Art
    this.asciiVideo.asciiDetect(this.camera.camera);

    // Detect Gesture & Smile for automatic snap
    if (this.camera.detectGesture() && this.camera.detectSmile()) {
      let currentTime = millis();

      // 2 secons delay after automatic snap
      if (currentTime - this.camera.lastSnap > this.camera.snapStime) {
        this.takeSnap(true);
        this.camera.lastSnap = currentTime; // Update the last snap time
      }
    }

    // Perform auto snap flash
    this.ui.autoSnapFlash();
  }

  // Capture Snap
  takeSnap(auto = false) {
    if (
      (mouseX > this.x + 28 &&
        mouseX < this.x + 128 &&
        mouseY > this.y + 200 &&
        mouseY < this.y + 230) ||
      auto
    ) {
      this.snapTaken = true;

      // Set the opacity and timer for the flash
      if (auto) {
        this.ui.flashAlpha = 500;
      }

      // Snap a Picture
      this.camera.capturePicture();

      // Get the snapshot image
      this.snapShot = this.camera.snapshot;

      // Convert to url so that it can be saved in the local storage
      let tempCanvas = document.createElement("canvas");
      tempCanvas.width = this.snapShot.width;
      tempCanvas.height = this.snapShot.height;

      let ctx = tempCanvas.getContext("2d");
      ctx.drawImage(this.snapShot.canvas, 0, 0);

      let dataURL = tempCanvas.toDataURL("image/png");

      // Save to local storage
      localStorage.setItem("snapshot", dataURL);

      // Set a new PhotoGroup
      this.ui.setup(this);

      // Create a new PhotoGroup
      this.group = new PhotoGroup(
        this.x + 550,
        this.y + 50,
        5,
        3,
        this.snapShot
      );
      this.group.setup(this.ui);

      // Set Webcam for frame 12
      this.group.frames[12].image = this.camera.faceBuffer;
    }
  }

  // Different Face Detection Filters
  processFaceKey() {
    let filter = "";

    if (key === "1") {
      filter = "grayscale";
    } else if (key === "2") {
      filter = "flip";
    } else if (key === "3") {
      filter = "pixelated";
    } else if (key === "0") {
      filter = "normal";
    }

    // Sync The Dropdown with Current Filter
    if (filter !== "") {
      this.camera.setCurrentFilter(filter);
      this.ui.filterSelect.selected(filter);
    }
  }
}
