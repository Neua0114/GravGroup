'use strict';

// Global variables needed in the render function
var gl = null, rast = null, programInfo = null;
var needToRender = true;  // draw at least once
var scene, pixels = new Array(), projM;

// Rasterization mode global variables
var needToReRasterize = false;
var rasterizerMode = true;
var slowMoEnabled = false;
var slowMoSpeed = 3;

// Function to run when page is fully loaded
$(document).ready(function() {
  // Handle lost context
  var canvas = document.getElementById('glCanvas');
  canvas.addEventListener(5, function(event) {
      event.preventDefault();
  }, false);

  // Respond to restored context
  canvas.addEventListener('webglcontextrestored', initializeWebGL, false);

  // Setup the GUI event system
  setupEventListeners();

  // Setup initial contex
  initializeWebGL();

  // Set the initial scene list
  updateSceneList();
});

// Initialize the WebGL renderer
function initializeWebGL() {
  // Get a WebGL context and setup basics
  gl = twgl.getWebGLContext($('#glCanvas')[0], { preserveDrawingBuffer: true,
                antialias: true, depth: false });
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Get a Canvas 2D context and setup basics
  var rastCanvas = document.getElementById('rasterizerCanvas');

  rast = rastCanvas.getContext('2d');
  // rast.scale(rastCanvas.width / rastCanvas.clientWidth,
  //            rastCanvas.height / rastCanvas.clientHeight);
  rastCanvas.width = rastCanvas.clientWidth;
  rastCanvas.height = rastCanvas.clientHeight;
  rast.fillStyle = 'black';
  rast.fillRect(0, 0, rastCanvas.width, rastCanvas.height);

  // Create a new shader program and compile and bind our shaders
  programInfo = twgl.createProgramInfo(gl, ['vs', 'fs']);

  // Allocate the scene array object
  scene = new Array();

  // Start the rendering loop
  requestAnimationFrame(checkRender);
}

function addShapeToScene(newShape) {
  // Generate the pixels for this shape
  newShape.rasterize();

  // Add to the scene array
  scene.push(newShape);
}

function setPixel(P, C) {
  pixels.push({point: P, color: C});
}

// Check if the canvas element size has changed and resize GL accordingly
function resizeGLCanvas() {
  if (twgl.resizeCanvasToDisplaySize(gl.canvas)) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Print the two resolutions to the console to help debugging
    console.log('gl Canvas: ' + gl.canvas.width + ' x ' + gl.canvas.height);
    console.log('gl Buffer: ' + gl.drawingBufferWidth + ' x ' +
      gl.drawingBufferHeight);

    // Update the projeciton matrix
    projM = orthoMatrix(0, gl.canvas.height - 1, 0, gl.canvas.width - 1);

    // Indicate that the viewport & canvas were resized
    return true;
  }

  // Indicate that the viewport & canvas were NOT resized
  return false;
}

// Check if the canvas element size has changed and resize GL accordingly
function resizeRastCanvas() {
  if (rast.canvas.width != rast.canvas.clientWidth ||
      rast.canvas.height != rast.canvas.clientHeight) {
    rast.canvas.width = rast.canvas.clientWidth;
    rast.canvas.height = rast.canvas.clientHeight;
    return true;
  }

  return false;
}

// Render only when needed
function checkRender(time) {
  // Rasterizer mode
  if (rasterizerMode) {
    if (resizeRastCanvas() || needToReRasterize) {
      // If we resized, must redraw entire scene
      redrawSceneRast();
      needToReRasterize = false;
    } else if (pixels.length > 0) {
      // Otherwise, only draw if there are pixels in the queue
      renderSceneRast(time);
    }
  } else {
    // Resize canvas and/or render the scene
    if (resizeGLCanvas() || needToRender) {
      needToRender = false;
      renderSceneGL(time);
    }
  }

  // Repeat infinitely at a reasonable framerate
  requestAnimationFrame(checkRender);
}

// Main draw function
function renderSceneGL(time) {
  // Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Use the shader program
  gl.useProgram(programInfo.program);

  // Call renderShape for each shape
  scene.forEach(renderShapeGL);
}

function renderShapeGL(shape, index) {
  // Pass in the uniform values
  var uniforms = { color: [shape.color.r, shape.color.g, shape.color.b],
                   projection: projM };
  twgl.setUniforms(programInfo, uniforms);

  if (!shape.filled && shape.type !== SHAPE_TYPE.LINE) {
    // Draw shape outlines
    twgl.setBuffersAndAttributes(gl, programInfo, shape.lineBufferInfo);
    twgl.drawBufferInfo(gl, gl.LINE_LOOP, shape.lineBufferInfo);
  } else {
    // Draw filled shapes
    switch (shape.type) {
      case SHAPE_TYPE.CIRCLE:
        twgl.setBuffersAndAttributes(gl, programInfo, shape.solidBufferInfo);
        twgl.drawBufferInfo(gl, gl.TRIANGLE_FAN, shape.solidBufferInfo);
      break;

      case SHAPE_TYPE.LINE:
        twgl.setBuffersAndAttributes(gl, programInfo, shape.solidBufferInfo);
        twgl.drawBufferInfo(gl, gl.LINES, shape.solidBufferInfo);
      break;

      case SHAPE_TYPE.TRIANGLE:
        twgl.setBuffersAndAttributes(gl, programInfo, shape.solidBufferInfo);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, shape.solidBufferInfo);
      break;
    }
  }
}

function redrawSceneRast() {
  // Clear the canvas
  rast.fillStyle = 'black';
  rast.fillRect(0, 0, rast.canvas.width, rast.canvas.height);

  // Generate all pixels by re-rasterizing all shapes
  for (var i = 0; i < scene.length; i++) {
    scene[i].rasterize();
  }

  // Need the latest bounding rect to be able to invert Y
  var rect = rast.canvas.getBoundingClientRect();

  // Immediately render all the gathered pixels
  while (pixels.length > 0) {
    rasterizePixel(pixels[0].point.x, rect.height - pixels[0].point.y,
                   pixels[0].color.asStyle());
    pixels.shift();
  }
}

function renderSceneRast(time) {

  // Need the latest bounding rect to be able to invert Y
  var rect = rast.canvas.getBoundingClientRect();

  // Render the gathered pixels up to the speed
  var slowMoCounter = slowMoSpeed * 5;
  while (pixels.length > 0 && (!slowMoEnabled || slowMoCounter > 0)) {
    rasterizePixel(pixels[0].point.x, rect.height - pixels[0].point.y,
                   pixels[0].color.asStyle());
    pixels.shift(); slowMoCounter--;
  }
}

function rasterizePixel(x, y, color) {
  rast.fillStyle = color; //pixels[0].color.asStyle();
  rast.fillRect(x, y, 1, 1);
}
