class WebCam {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.camera;
    this.buffer;

    // Store faces & hand keypoints
    this.faces = [];
    this.hands = [];

    // Initialize face & hand detection
    this.faceDetection = new FaceDetection();
    this.handDetection = new HandDetection();

    // Automatic Snap Delay
    this.lastSnap = 0;
    this.snapStime = 3000;

    // Main Buffer
    this.buffer = createGraphics(this.w, this.h);

    // Face Buffer (only face)
    this.faceBuffer = createGraphics(this.w, this.h);

    // The current filter of the video
    this.currentFilter = "normal";

    this.snapshot;
  }

  initializeCam() {
    this.camera = createCapture(VIDEO);
    this.camera.size(this.w, this.h);
    this.camera.hide();

    // Perform the face & hand detection
    faceMesh.detectStart(this.camera, (results) => {
      this.gotFaces(results);
    });

    handPose.detectStart(this.camera, (results) => {
      this.gotHands(results);
    });

    console.log("initialized");
  }

  // Capture the current camera state into p5.Image
  capturePicture() {
    this.buffer.image(this.camera, 0, 0, this.w, this.h);

    // take the snapshot from the webcam
    push();
    this.snapshot = createImage(this.w, this.h);
    this.snapshot.copy(this.buffer, 0, 0, this.w, this.h, 0, 0, this.w, this.h);
    pop();
  }

  detection() {
    // Refresh the buffer for each frame
    this.buffer.clear();

    // Draw the fresh camera to the buffer
    this.buffer.image(this.camera, 0, 0, this.w, this.h);

    // Draw the hand detection only on the original cam
    if (this.hands.length > 0) {
      this.handDetection.handDetection(this.hands, this.buffer);
    }

    // Create seperate faceBuffer
    this.faceBuffer.clear();
    this.faceBuffer.image(this.camera, 0, 0, this.w, this.h);

    // Get the detected face image
    let faceProcess = this.getFaceImage();

    // Apply Filters based on user
    if (faceProcess) {
      if (this.currentFilter == "grayscale") {
        this.getGrayScaleVideo(faceProcess);
      } else if (this.currentFilter == "flip") {
        this.getFlipVideo(faceProcess);
      } else if (this.currentFilter == "pixelated") {
        this.getPixelatedVideo(faceProcess);
      } else if (this.currentFilter == "normal") {
        this.faceDetection.faceDetect(this.faces, this.faceBuffer);
      }
    }
  }

  gotFaces(results) {
    this.faces = results;
    // console.log(this.faces);
  }

  gotHands(results) {
    this.hands = results;
  }

  // Detect the face & capture the image (for the buffer)
  getFaceImage() {
    if (this.faces.length > 0) {
      let faces = this.faces[0].faceOval.keypoints;

      let minX = Math.min(...faces.map((p) => p.x));
      let maxX = Math.max(...faces.map((p) => p.x));
      let minY = Math.min(...faces.map((p) => p.y));
      let maxY = Math.max(...faces.map((p) => p.y));

      // Create the position of the image
      let img = createImage(floor(maxX - minX), floor(maxY - minY));

      img.copy(
        this.camera,
        minX,
        minY,
        img.width,
        img.height,
        0,
        0,
        img.width,
        img.height
      );

      return { img: img, x: minX, y: minY };
    }
  }

  getGrayScaleVideo(faceProcess) {
    let grayFace = this.faceDetection.grayScaleFace(faceProcess.img);
    this.faceBuffer.image(grayFace, faceProcess.x, faceProcess.y);
  }

  setCurrentFilter(filter) {
    this.currentFilter = filter;

    // Save into local storage
    localStorage.setItem("activeFilter", filter);
  }

  getFlipVideo(faceProcess) {
    // let flipVideo = this.faceDetection.flipFace(this.camera);
    let flipVideo = this.faceDetection.flipFace(faceProcess.img);

    // this.buffer.image(flipVideo, 0, 0, this.w, this.h);
    this.faceBuffer.image(flipVideo, faceProcess.x, faceProcess.y);
  }

  getPixelatedVideo(faceProcess) {
    this.faceDetection.pixelatedFace(
      faceProcess.img,
      this.faceBuffer,
      faceProcess.x,
      faceProcess.y
    );
  }

  detectGesture() {
    return this.handDetection.checkGestures(this.hands) ? true : false;
  }

  detectSmile() {
    return this.faceDetection.checkSmile(this.faces) ? true : false;
  }
}
