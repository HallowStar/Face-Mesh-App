# Face-Mesh-App
## Description
Face-Mesh-App is an interactive, web-based image processing application built with p5.js and ml5.js. The application utilizes real-time computer vision to detect facial landmarks and hand gestures, allowing users to interact with a variety of digital filters and automatic photo-capturing features.

The app serves as an exploratory platform for graphics programming, demonstrating pixel-level manipulation, color space conversions (Luv and Lab), and intelligent human-computer interaction.

## Features
1. Real-Time Detection
Face Tracking: Uses the ml5.js faceMesh model to identify facial keypoints for real-time filter overlays.

Hand Pose Estimation: Tracks hand joints to enable gesture-based controls.

2. Interactive Photo Booth
Multi-Filter Grid: When a "Snap" is taken, the app generates a 14-frame grid (PhotoGroup), each applying a different filter or transformation to the captured image.

Manual Snap: Users can take a photo by clicking the "Snap" button on the UI or pressing the 'S' key.

Automatic Snap: An "Extension" feature that triggers a photo capture automatically when the system detects a simultaneous V-pose/Thumbs-up gesture and a smile.

3. Image Processing & Filters
Color Channels: Isolation of Red, Green, and Blue channels with adjustable threshold sliders.

Advanced Color Spaces: Custom implementations of CIE Luv and CIE Lab color space algorithms.

Face-Specific Effects:

Grayscale: Desaturates only the detected face area.

Mirroring: Swaps horizontal pixels within the face oval.

Pixelation: Divides the face into 5x5 blocks and applies average intensity for a blurred effect.

4. Extensions
ASCII Video Filter: A live transformation that converts webcam frames into text-based art using a custom brightness-to-character density mapping.

Persistence: Uses localStorage to save the last captured snapshot and current filter settings across sessions.

## Controls
Button/S Key: Capture a manual snapshot.

Key 1: Apply Grayscale face filter.

Key 2: Apply Mirror (Flip) face filter.

Key 3: Apply Pixelated face filter.

Key 0: Reset to normal video.

Sliders: Adjust threshold values for RGB and Luv/Lab filters in the grid view.

## Visual Style
The application uses a specific professional color palette:

Primary: #3D3B8E (Background)

Secondary: #6883BA (UI Elements)

Highlight: #FFD166 (Instructions/Labels)

## Technical Dependencies
p5.js: Core graphics and animation library.

ml5.js: Machine learning models for FaceMesh and HandPose.

D65 Illuminant Standards: Used for accurate XYZ to Luv/Lab conversions.