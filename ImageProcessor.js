// Image Filter Logic Class

class ImageProcessor {
  // Grayscale & -20% brightness
  grayAndBright(image) {
    let imgOut = createImage(image.width, image.height);

    let brightness = 0.2;

    imgOut.loadPixels();
    image.loadPixels();

    // Grayscale Algorithm
    for (let i = 0; i < image.width; i++) {
      for (let j = 0; j < image.height; j++) {
        // Getting the index of each pixel
        let index = (image.width * j + i) * 4;

        let r = image.pixels[index + 0];
        let g = image.pixels[index + 1];
        let b = image.pixels[index + 2];

        let gray = r * 0.299 + g * 0.587 + b * 0.114;

        // To have value between 0-255
        gray = max(gray - 255 * brightness, 0);

        imgOut.pixels[index + 0] = gray;
        imgOut.pixels[index + 1] = gray;
        imgOut.pixels[index + 2] = gray;
        imgOut.pixels[index + 3] = 255;
      }
    }

    imgOut.updatePixels();

    return imgOut;
  }

  // Color Channel (Red, Green, Blue)
  colorChannel(image, color) {
    let imgOut = createImage(image.width, image.height);

    imgOut.loadPixels();
    image.loadPixels();

    for (let i = 0; i < image.width; i++) {
      for (let j = 0; j < image.height; j++) {
        let index = (image.width * j + i) * 4;

        let r = image.pixels[index + 0];
        let g = image.pixels[index + 1];
        let b = image.pixels[index + 2];

        // Checking for the channel
        imgOut.pixels[index + 0] = color == "red" ? r : 0;
        imgOut.pixels[index + 1] = color == "green" ? g : 0;
        imgOut.pixels[index + 2] = color == "blue" ? b : 0;
        imgOut.pixels[index + 3] = 255;
      }
    }

    imgOut.updatePixels();

    return imgOut;
  }

  // Color Channel with Threshold
  colorChannelThreshold(image, color, threshold) {
    let imgOut = createImage(image.width, image.height);

    imgOut.loadPixels();
    image.loadPixels();

    for (let i = 0; i < image.width; i++) {
      for (let j = 0; j < image.height; j++) {
        let index = (image.width * j + i) * 4;

        let r = image.pixels[index + 0];
        let g = image.pixels[index + 1];
        let b = image.pixels[index + 2];

        // Determine the color of the channel
        let currentColor;

        if (color === "red") {
          currentColor = r;
        } else if (color === "green") {
          currentColor = g;
        } else {
          currentColor = b;
        }

        if (currentColor > threshold) currentColor = 255;
        else currentColor = 0;

        imgOut.pixels[index + 0] = color == "red" ? currentColor : 0;
        imgOut.pixels[index + 1] = color == "green" ? currentColor : 0;
        imgOut.pixels[index + 2] = color == "blue" ? currentColor : 0;
        imgOut.pixels[index + 3] = 255;
      }
    }

    imgOut.updatePixels();

    return imgOut;
  }

  // Color Space Algorithm I -> l*u*v Filter
  luvFilter(image) {
    let imgOut = createImage(image.width, image.height);

    imgOut.loadPixels();
    image.loadPixels();

    for (let i = 0; i < image.width; i++) {
      for (let j = 0; j < image.height; j++) {
        let index = (image.width * j + i) * 4;

        // Normalization
        let r = image.pixels[index + 0] / 255;
        let g = image.pixels[index + 1] / 255;
        let b = image.pixels[index + 2] / 255;

        // Convert to XYZ Format
        let x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
        let y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
        let z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;

        // Reference white point constants (D65 illuminant)
        let xN = 0.95047;
        let yN = 1.0;
        let zN = 1.08883;

        // Compute Chromaticity coordinates (u', v')
        let u = (4 * x) / (x + 15 * y + 3 * z);
        let v = (9 * y) / (x + 15 * y + 3 * z);

        // Calculate chromaticity for the reference white point
        let uN = (4 * xN) / (xN + 15 * yN + 3 * zN);
        let vN = (9 * yN) / (xN + 15 * yN + 3 * zN);

        let yNew = y / yN;

        let l;

        // Compute L* (lightness) & check for non-linear behaviour
        if (yNew > 0.008856) {
          l = 116 * Math.pow(yNew, 1 / 3) - 16;
        } else {
          l = 903.3 * yNew;
        }

        // Compute u* & v* chromaticity coordinates
        let uNew = 13 * l * (u - uN);
        let vNew = 13 * l * (v - vN);

        // Mapped to 0-255 for display purposes since it requires in RGB format
        imgOut.pixels[index + 0] = map(l, 0, 100, 0, 255);
        imgOut.pixels[index + 1] = map(uNew, -134, 220, 0, 255);
        imgOut.pixels[index + 2] = map(vNew, -140, 122, 0, 255);
        imgOut.pixels[index + 3] = 255;
      }
    }

    imgOut.updatePixels();

    return imgOut;
  }

  // Color Space Conversion Algorithm II -> l*a*b
  labFilter(image) {
    let imgOut = createImage(image.width, image.height);

    imgOut.loadPixels();
    image.loadPixels();

    for (let i = 0; i < image.width; i++) {
      for (let j = 0; j < image.height; j++) {
        let index = (image.width * j + i) * 4;

        // Normalization
        let r = image.pixels[index + 0] / 255;
        let g = image.pixels[index + 1] / 255;
        let b = image.pixels[index + 2] / 255;

        // Convert to XYZ Format
        let x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
        let y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
        let z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;

        // Normalize XYZ with reference white points (D65 illuminant)
        let xN = x / 0.95047;
        let yN = y / 1.0;
        let zN = z / 1.08883;

        let l;

        // Compute L* using fLab to handle cube roots
        if (yN > 0.008856) {
          l = 116 * this.fLab(yN) - 16;
        } else {
          l = 903.3 * this.fLab(yN);
        }

        // Compute a* (green - red) & b* (blue-yellow) axes
        let aNew = 500 * (this.fLab(xN) - this.fLab(yN));
        let bNew = 200 * (this.fLab(yN) - this.fLab(zN));

        imgOut.pixels[index + 0] = map(l, 0, 100, 0, 255);
        imgOut.pixels[index + 1] = map(aNew, -128, 127, 0, 255);
        imgOut.pixels[index + 2] = map(bNew, -128, 127, 0, 255);
        imgOut.pixels[index + 3] = 255;
      }
    }

    imgOut.updatePixels();

    return imgOut;
  }

  luvFilterThreshold(image, slider) {
    let imgOut = createImage(image.width, image.height);

    imgOut.loadPixels();
    image.loadPixels();

    for (let i = 0; i < image.width; i++) {
      for (let j = 0; j < image.height; j++) {
        let index = (image.width * j + i) * 4;

        // Normalization
        let r = image.pixels[index + 0] / 255;
        let g = image.pixels[index + 1] / 255;
        let b = image.pixels[index + 2] / 255;

        // Convert to XYZ Format
        let x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
        let y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
        let z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;

        // Reference white point constants (D65 illuminant)
        let xN = 0.95047;
        let yN = 1.0;
        let zN = 1.08883;

        // Calculate Chromaticity coordinates (u', v')
        let u = (4 * x) / (x + 15 * y + 3 * z);
        let v = (9 * y) / (x + 15 * y + 3 * z);

        // Calculate Chromaticity for reference white points
        let uN = (4 * xN) / (xN + 15 * yN + 3 * zN);
        let vN = (9 * yN) / (xN + 15 * yN + 3 * zN);

        let yNew = y / yN;

        let l;

        // Compute L* & check for non-linear behaviour
        if (yNew > 0.008856) {
          l = 116 * Math.pow(yNew, 1 / 3) - 16;
        } else {
          l = 903.3 * yNew;
        }

        // Compute u* & v* chromaticity
        let uNew = 13 * l * (u - uN);
        let vNew = 13 * l * (v - vN);

        // Threshold for lightness
        if (l > slider) {
          l = 100;
        } else {
          l = 0;
        }

        imgOut.pixels[index + 0] = map(l, 0, 100, 0, 255);
        imgOut.pixels[index + 1] = map(uNew, -134, 220, 0, 255);
        imgOut.pixels[index + 2] = map(vNew, -140, 122, 0, 255);
        imgOut.pixels[index + 3] = 255;
      }
    }

    imgOut.updatePixels();

    return imgOut;
  }

  labFilterThreshold(image, slider) {
    let imgOut = createImage(image.width, image.height);

    imgOut.loadPixels();
    image.loadPixels();

    for (let i = 0; i < image.width; i++) {
      for (let j = 0; j < image.height; j++) {
        let index = (image.width * j + i) * 4;

        // Normalization
        let r = image.pixels[index + 0] / 255;
        let g = image.pixels[index + 1] / 255;
        let b = image.pixels[index + 2] / 255;

        // Convert to XYZ Format
        let x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
        let y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
        let z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;

        // Normalize using white points reference
        let xN = x / 0.95047;
        let yN = y / 1.0;
        let zN = z / 1.08883;

        let l;

        // Compute L* using fLab to handle cube roots
        if (yN > 0.008856) {
          l = 116 * this.fLab(yN) - 16;
        } else {
          l = 903.3 * this.fLab(yN);
        }

        // Compute a* (green - red) & b* (blue-yellow) axes
        let aNew = 500 * (this.fLab(xN) - this.fLab(yN));
        let bNew = 200 * (this.fLab(yN) - this.fLab(zN));

        if (l > slider) {
          l = 100;
        } else {
          l = 0;
        }

        imgOut.pixels[index + 0] = map(l, 0, 100, 0, 255);
        imgOut.pixels[index + 1] = map(aNew, -128, 127, 0, 255);
        imgOut.pixels[index + 2] = map(bNew, -128, 127, 0, 255);
        imgOut.pixels[index + 3] = 255;
      }
    }

    imgOut.updatePixels();

    return imgOut;
  }

  // Handle non-linear math
  fLab(t) {
    if (t > 0.008856) {
      return Math.pow(t, 1 / 3);
    } else {
      return 7.787 * t + 16 / 116;
    }
  }
}
