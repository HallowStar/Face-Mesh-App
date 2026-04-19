class AsciiVideo {
  constructor() {
    this.asciiDiv;
  }

  // Set up the ASCII style
  asciiSetup() {
    this.asciiDiv = createDiv();

    this.asciiDiv.style("font-family", "monospace");
    this.asciiDiv.style("white-space", "pre");
    this.asciiDiv.style("color", "white");
    this.asciiDiv.style("background", "black");
    this.asciiDiv.style("font-size", "12px");
    this.asciiDiv.style("line-height", "6px");
  }

  // ASCII Drawing Logic
  asciiDetect(video) {
    // ASCII Text
    push();
    textSize(50);
    text("ASCII Video Filter", 50, height - 100);
    pop();

    // Darker to Lighter from the left
    const density = "Ñ@#W$9876543210?!abc;:+=-,._                          ";

    video.loadPixels();

    let image = "";

    // The detail (The higher the step the higher the performance)
    let step = 1;

    for (let j = 0; j < video.height; j += step) {
      for (let i = 0; i < video.width; i += step) {
        let index = (i + j * video.width) * 4;

        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];

        // Calculate the average brightness for the pixel
        let avg = (r + g + b) / 3;

        // Map the brightness to the density
        let len = density.length;
        let charIndex = floor(map(avg, 0, 255, 0, len - 1));

        let c = density.charAt(charIndex);

        // Row by row addition
        image += c;
      }

      image += "<br/>";
    }

    // Update the Div with the string
    this.asciiDiv.html(image);
  }
}
