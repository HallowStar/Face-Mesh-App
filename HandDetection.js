// Hand Detection Logic Class

class HandDetection {
  // Hand Detection
  handDetection(hands, targetBuffer) {
    targetBuffer.push();
    targetBuffer.noFill();
    targetBuffer.stroke(255, 0, 255);
    targetBuffer.strokeWeight(3);

    // Get the keypoints of our hand
    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
      for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];

        targetBuffer.point(keypoint.x, keypoint.y);
      }
    }

    targetBuffer.pop();
  }

  // Check for Hand Gestures
  checkGestures(hands) {
    if (hands.length > 0) {
      let hand = hands[0];
      let keypoints = hand.keypoints;

      //  Thumbs Up Gesture
      let isThumbup =
        keypoints[4].y < keypoints[3].y &&
        keypoints[4].y < keypoints[2].y &&
        keypoints[4].y < keypoints[8].y &&
        keypoints[4].y < keypoints[12].y &&
        keypoints[4].y < keypoints[16].y &&
        keypoints[4].y < keypoints[20].y;

      let fingerFolded =
        keypoints[8].y > keypoints[6].y &&
        keypoints[12].y > keypoints[10].y &&
        keypoints[16].y > keypoints[14].y &&
        keypoints[20].y > keypoints[18].y;

      // Thumbs Up Detection
      if (isThumbup & fingerFolded) {
        return "thumbs_up";
      }

      // V pose gesture
      let fingerUp =
        keypoints[8].y < keypoints[6].y &&
        keypoints[12].y < keypoints[10].y &&
        keypoints[8].y < keypoints[16].y &&
        keypoints[8].y < keypoints[20].y &&
        keypoints[8].y < keypoints[4].y &&
        keypoints[12].y < keypoints[16].y &&
        keypoints[12].y < keypoints[20].y &&
        keypoints[12].y < keypoints[4].y;

      let otherFolded =
        keypoints[16].y > keypoints[14].y && keypoints[20].y > keypoints[18].y;

      if (fingerUp && otherFolded) {
        return "v_pose";
      }
    }

    return null;
  }
}
