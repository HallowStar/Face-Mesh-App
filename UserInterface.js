// User Interface Logic
class UserInterface {
  constructor() {
    this.redSlider;
    this.greenSlider;
    this.blueSlider;
    this.luvSlider;
    this.labSlider;

    this.filterSelect;

    this.flashAlpha = 0;

    this.buffer3d;
  }

  setup(appInstance) {
    this.colorChannelSlider();
    this.colorSpaceSlider();

    this.drawDropDown(appInstance);

    this.buffer3d = createGraphics(windowWidth, windowHeight, WEBGL);
  }

  // Initialize the channel sliders
  colorChannelSlider() {
    this.redSlider = createSlider(0, 255, 0);
    this.greenSlider = createSlider(0, 255, 0);
    this.blueSlider = createSlider(0, 255, 0);
  }

  // Initialize the color space sliders
  colorSpaceSlider() {
    this.luvSlider = createSlider(0, 100, 50);
    this.labSlider = createSlider(0, 100, 50);
  }

  // Draw Snap Button
  drawSnapButton(x, y) {
    // Button Shadow
    fill(0, 50);
    rect(x + 31, y + 203, 100, 40, 8);

    // Button Hover Design
    let isHovered =
      mouseX > x + 40 &&
      mouseX < x + 128 &&
      mouseY > y + 200 &&
      mouseY < y + 230;

    if (isHovered) {
      fill("#EF476F");
      cursor("pointer");
    } else {
      fill("#06D6A0");
      cursor("default");
    }

    // Button Design
    push();
    noStroke();
    rect(x + 40, y + 200, 100, 40, 8);
    fill(255);
    textSize(18);
    textStyle(BOLD);
    text("Snap", x + 70, y + 228);
    pop();
  }

  drawInstructions() {
    push();
    // Set text style
    fill(255);
    noStroke();
    textSize(14);
    textFont("Courier New");
    textAlign(LEFT);

    let startX = 80;
    let startY = 350;

    // Instruction Text
    let instructions = [
      "CONTROLS:",
      "- Press 'S' to take a manual Snap",
      "- Auto-Snap: Show Hand + Smile together",
      "- Keys 1-3: Change Face Filters",
      "- Key 0: Reset Face Filter",
      "- ASCII Art (Below)",
    ];

    // Draw each line
    for (let i = 0; i < instructions.length; i++) {
      // Slight shadow
      fill(0, 150);
      text(instructions[i], startX + 1, startY + i * 20 + 1);

      // Main text
      fill(i === 0 ? "#FFD166" : 255);
      text(instructions[i], startX, startY + i * 20);
    }
    pop();
  }

  // Draw the labels for each grid cell
  drawFrameLabels(frames) {
    push();
    fill(255);
    noStroke();
    textSize(15);
    textFont("Courier New");
    textAlign(CENTER);

    // Labels for each Filter
    let labels = [
      "Original Image",
      "Grayscale & Brightness 20%",
      "",
      "Red Channel",
      "Green Channel",
      "Blue Channel",
      "Red Threshold",
      "Green Threshold",
      "Blue Threshold",
      "Original",
      "LUV Filter",
      "LAB Filter",
      "Face Detections",
      "LUV Threshold",
      "LAB Threshold",
    ];

    // Draw the labels
    for (let i = 0; i < frames.length; i++) {
      push();
      fill(0, 150);
      text(labels[i], frames[i].x + 80, frames[i].y - 30);
      fill("#FFD166");
      text(labels[i], frames[i].x + 82, frames[i].y - 28);
      pop();
    }
    pop();
  }

  // Set the position of each sliders respective of their frames
  drawSliderValues(frames) {
    // Draw current slider values next to the sliders
    push();
    fill(255);
    textSize(15);
    text(this.redSlider.value(), frames[6].x + 140, frames[6].y + 150);
    text(this.greenSlider.value(), frames[7].x + 140, frames[7].y + 150);
    text(this.blueSlider.value(), frames[8].x + 140, frames[8].y + 150);
    text(this.luvSlider.value(), frames[13].x + 140, frames[13].y + 150);
    text(this.labSlider.value(), frames[14].x + 140, frames[14].y + 150);
    pop();
  }

  // Initialize and style the dropdown menu for video effects
  drawDropDown(appInstance) {
    this.filterSelect = createSelect();
    this.filterSelect.position(600, 1030);

    this.filterSelect.style("padding", "0.5rem");
    this.filterSelect.style("width", "160px");
    this.filterSelect.style("background-color", "#6883BA");
    this.filterSelect.style("color", "#F9F9F9");

    this.filterSelect.option("normal");
    this.filterSelect.option("grayscale");
    this.filterSelect.option("flip");
    this.filterSelect.option("pixelated");

    this.filterSelect.selected(
      localStorage.getItem("activeFilter") || "normal"
    );

    // Handle the selection changes
    this.filterSelect.changed(() => {
      let selected = this.filterSelect.value();
      appInstance.camera.setCurrentFilter(selected);
    });
  }

  autoSnapFlash() {
    if (this.flashAlpha > 0) {
      // Flash Animation
      push();
      fill(255, this.flashAlpha);
      noStroke();
      rect(0, 0, width, height);
      fill(0, this.flashAlpha);
      textSize(40);
      textAlign(CENTER);
      text("SNAPPED!!", width / 2, height / 2 - 200);
      pop();

      // Fade out the flash
      this.flashAlpha -= 10;
    }
  }
}
