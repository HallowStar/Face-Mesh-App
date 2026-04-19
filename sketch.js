let photoApp;
let faceMesh;
let handPose;

function preload() {
  let options = {
    maxFaces: 1,
    refineLandmarks: false,
    flipHorizontal: false,
  };

  // Set the face & hand detection
  faceMesh = ml5.faceMesh(options);
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, 1500);
  pixelDensity(1);
  background(0);

  photoApp = new PhotoApp(50, 50);
  photoApp.setup();
}

function draw() {
  background("#3D3B8E");

  // Draw the photo app
  photoApp.draw();
}

function mousePressed() {
  // Take Snap Logic
  photoApp.takeSnap(false);
}

function keyPressed() {
  if (key == "s") {
    photoApp.takeSnap(true);
  }

  // Apply filters using keys (0,1,2,3)
  photoApp.processFaceKey();
}

// COMMENTARY
/**
 * App Walkthrough
The PhotoApp that I developed is an interactive image processing application consisting of different filters, color space manipulation and face and hand detection. During initialization, the webcam is activated and when the snap button is clicked, it triggers the takeSnap() function. This generates a PhotoGroup class grid with 14 frames, each displaying different filters. 

Each image  is processed using nested looping that manipulates pixel values directly through custom methods. Each color channel keeps one RGB component while setting the remaining to zero. Threshold filters apply maximum intensity when pixel values exceed a user-defined value.

For color space conversion, I implemented Luv and Lab algorithm. First, RGB values are normalized and converted to the CIE XYZ, then adjusted against the D65 white points before applying the respective formulas. Threshold is also applied to selected components.

For face detection, I used the ml5 library that provides facial keypoints for smooth performance. Effects are applied to a separate graphics buffer that updates every frame, acting as a webcam. The mirror effect swaps pixels horizontally, while the pixelation effect divides the pixels into 5x5 blocks and applies the average intensity within each block.

Problems
During color space conversion algorithms development, The documentation only provided partial mathematical formulas, making it difficult to directly translate them into code. This required extra research online to fully understand the complete steps. After several trials and debugging, I managed to achieve the accurate result.

Another difficulty was designing an appropriate object-oriented structure. With multiple components, organizing responsibilities into classes was initially overwhelming. I experienced trials and errors, deciding where functions should be placed and how modules should interact. To resolve this, I outlined all components with their roles before structuring them.

Progress
I managed my time effectively by dividing tasks weekly. I allocated three days to research, develop and evaluate approximately three filters or functionalities. This allowed me to complete the requirements on schedule.

Extension
For my extension, I implemented two separate extensions which are an automatic snap system and an ASCII video filter. 

The automatic snap feature uses real-time hand and face keypoints from the ml5 library. Gesture detection is implemented by comparing the fingertip keypoints and lower joints to determine whether fingers are extended or folded. For example, V-pose requires the index and middle finger to be extended. Smile detection calculates the ratio between mouth and face width, requiring it to exceed approximately 45% for proportional detection regardless of camera distance. The ASCII filter converts live webcam frames into text-based art by calculating pixel brightness and mapping it to a research density string from dark to light characters.

Although visually simple, the development required significant research and experiments. I had to carefully analyze and compare different hand and facial keypoints to determine the most accurate conditions for detecting gestures and smiles which involved many trials. These extensions introduce intelligent behavioral interaction, allowing the system to respond dynamically to natural human actions while also adding a creative visual transformation, making the application more interactive and unique.

 */
