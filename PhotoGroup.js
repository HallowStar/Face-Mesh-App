// Handles the Photo Group grid (14 frames)

class PhotoGroup {
  constructor(x, y, row, col, image) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.col = col;

    this.ui;

    this.image = image;

    // Get the image filters
    this.filter = new ImageProcessor();

    // Store all frames
    this.frames = [];
  }

  setup(ui) {
    this.ui = ui;

    // Initialize the frames
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        let cell = new Frame(this.x + j * 250, this.y + i * 200, this.image);

        this.frames.push(cell);
      }
    }

    console.log(ui);

    // Set the sliders for threshold channels
    this.ui.redSlider.position(this.frames[6].x, this.frames[6].y + 135);
    this.ui.greenSlider.position(this.frames[7].x, this.frames[7].y + 135);
    this.ui.blueSlider.position(this.frames[8].x, this.frames[8].y + 135);

    this.ui.luvSlider.position(this.frames[13].x, this.frames[13].y + 135);
    this.ui.labSlider.position(this.frames[14].x, this.frames[14].y + 135);
  }

  draw() {
    // Set the filter for each frame
    this.frames[1].image = this.filter.grayAndBright(this.image);

    this.frames[2].image = null;

    this.frames[3].image = this.filter.colorChannel(this.image, "red");
    this.frames[4].image = this.filter.colorChannel(this.image, "green");
    this.frames[5].image = this.filter.colorChannel(this.image, "blue");

    this.frames[6].image = this.filter.colorChannelThreshold(
      this.image,
      "red",
      this.ui.redSlider.value()
    );

    this.frames[7].image = this.filter.colorChannelThreshold(
      this.image,
      "green",
      this.ui.greenSlider.value()
    );

    this.frames[8].image = this.filter.colorChannelThreshold(
      this.image,
      "blue",
      this.ui.blueSlider.value()
    );

    this.frames[10].image = this.filter.luvFilter(this.image);
    this.frames[11].image = this.filter.labFilter(this.image);

    this.frames[13].image = this.filter.luvFilterThreshold(
      this.image,
      this.ui.luvSlider.value()
    );

    this.frames[14].image = this.filter.labFilterThreshold(
      this.image,
      this.ui.labSlider.value()
    );

    // Draw every frame
    for (let i = 0; i < this.frames.length; i++) {
      this.frames[i].draw();
    }
  }
}
