// Frame Design & Camera / Image initialization
class Frame {
  constructor(x, y, image = null) {
    this.x = x;
    this.y = y;
    this.image = image;
  }

  draw() {
    if (this.image) {
      push();

      // Shadow Effect
      fill(0, 0, 0, 50);
      rect(this.x - 15, this.y - 10, 164, 124, 5);

      // Frame Border
      stroke("#6883BA");
      strokeWeight(3);
      fill("#1E1E2E");
      rect(this.x - 2, this.y - 2, 164, 124, 2);
      pop();
      push();
      image(this.image, this.x, this.y, 160, 120);
      pop();
    }
  }

  drawCamera(camera) {
    push();
    // Neon Glow for the active camera
    noFill();
    strokeWeight(4);
    stroke(0, 255, 100, 150);
    rect(this.x - 5, this.y - 5, 170, 130, 5);

    // Draw the actual buffer
    image(camera.buffer, this.x, this.y, 160, 120);

    // Recording Circle
    fill(255, 0, 0);
    noStroke();
    if (frameCount % 60 < 30) {
      circle(this.x + 10, this.y + 10, 8);
    }
    pop();
  }
}
