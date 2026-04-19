// Handles Face Detection Logic
class FaceDetection {
  constructor() {}

  // Detect & Draw Outline on our Face
  faceDetect(faces, targetBuffer) {
    for (let i = 0; i < faces.length; i++) {
      let face = faces[i].faceOval; // Using faceOval keypoints

      targetBuffer.push();
      targetBuffer.noFill();
      targetBuffer.stroke(0, 255, 0);
      targetBuffer.strokeWeight(2);

      targetBuffer.beginShape();
      for (let j = 0; j < face.keypoints.length; j++) {
        let keypoint = face.keypoints[j];

        // Draw lines using vertex
        targetBuffer.vertex(keypoint.x, keypoint.y);
      }
      targetBuffer.endShape(CLOSE);
      targetBuffer.pop();
    }
  }

  // Grayscale only the face
  grayScaleFace(faces) {
    let out = createImage(faces.width, faces.height);

    faces.loadPixels();
    out.loadPixels();

    // Grayscale Algorithm
    for (let i = 0; i < faces.width; i++) {
      for (let j = 0; j < faces.height; j++) {
        let index = (faces.width * j + i) * 4;

        let r = faces.pixels[index + 0];
        let g = faces.pixels[index + 1];
        let b = faces.pixels[index + 2];

        let avg = (r + g + b) / 3;

        out.pixels[index + 0] = avg;
        out.pixels[index + 1] = avg;
        out.pixels[index + 2] = avg;
        out.pixels[index + 3] = 255;
      }
    }

    out.updatePixels();
    return out;
  }

  // Mirror the face
  flipFace(faces) {
    let out = createImage(faces.width, faces.height);

    faces.loadPixels();
    out.loadPixels();

    // Swap the left and right value for mirror effect
    for (let i = 0; i < faces.height; i++) {
      for (let j = 0; j < faces.width; j++) {
        let index = (faces.width * i + j) * 4;
        let endIndex = (i * faces.width + (faces.width - 1 - j)) * 4;

        out.pixels[endIndex + 0] = faces.pixels[index + 0];
        out.pixels[endIndex + 1] = faces.pixels[index + 1];
        out.pixels[endIndex + 2] = faces.pixels[index + 2];
        out.pixels[endIndex + 3] = faces.pixels[index + 3];
      }
    }

    out.updatePixels();
    return out;
  }

  // Blurred Face using 5x5 Pixel Blocks
  pixelatedFace(faces, targetBuffer, posX, posY) {
    let out = this.grayScaleFace(faces);

    faces.loadPixels();
    out.loadPixels();

    let block = 5;

    targetBuffer.push();
    targetBuffer.noStroke();

    // Calculate over the blocks
    for (let i = 0; i < faces.width; i += block) {
      for (let j = 0; j < faces.height; j += block) {
        let total = 0;
        let count = 0;

        // Calculating the average intensity of each block's pixels
        for (let x = 0; x < block; x++) {
          for (let y = 0; y < block; y++) {
            let pX = i + x;
            let pY = j + y;

            if (pX < faces.width && pY < faces.height) {
              let index = (faces.width * pY + pX) * 4;

              total += out.pixels[index];
              count++;
            }
          }
        }

        // Calculate the average
        let avg = total / count;

        targetBuffer.fill(avg);
        targetBuffer.ellipse(i + posX + block / 2, posY + j + block / 2, 8);
      }
    }

    targetBuffer.pop();
  }

  // Detect if the user is smiling
  checkSmile(faces) {
    if (faces.length > 0) {
      let keypoints = faces[0].keypoints;

      // Calculate face width
      let faceLeft = keypoints[234];
      let faceRight = keypoints[454];
      let faceWidth = dist(faceLeft.x, faceLeft.y, faceRight.x, faceRight.y);

      // Mouth Corners
      let leftMouth = keypoints[61];
      let rightMouth = keypoints[291];

      // Width of the Mouth
      let mouthWidth = dist(
        leftMouth.x,
        leftMouth.y,
        rightMouth.x,
        rightMouth.y
      );

      // Smilling should be around 45-50% of face width
      let smileThreshold = faceWidth * 0.45;

      if (mouthWidth > smileThreshold) {
        return true;
      }
    }

    return false;
  }
}
