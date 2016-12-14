'use strict';

function setupEventListeners() {
  // Set event handlers for the scene import/export buttons
  $('#saveImage').click(saveImage);

  // Set event handlers for the canvas and select elements
  $('#glCanvas').click(onClickCanvas);
  $('#rasterizerCanvas').click(onClickCanvas);
  $('#shapeType').change(onTypeChanged);
  $('#shapeSelect').change(onActiveChanged);

  // Set event handlers for the rendering mode input elements
  $('#renderingMode').change(onModeChanged);
  $('#slowMoCheckbox').change(updateSlowMo);
  $('#slowMoSpeed').on('input', updateSlowMo);

  // Set event handlers for all shape property input elements
  $('.shape-prop-control').on('input', updateShapeProperties);
  $('#filled').change(updateShapeProperties);

  // Set event handlers for the shape transformation input elements
  $('.shape-trans-control').on('input', updateShapeTransformation);
  $('#pivotCentroid').change(updateShapeTransformation);
}

// Convert the canvas to an image and open it
function saveImage(e) {
  if (rasterizerMode) {
    window.open($('#rasterizerCanvas')[0].toDataURL());
  } else {
    window.open($('#glCanvas')[0].toDataURL());
  }
}

// Global array to store locations of previous clicks.  Needs to be
// global so that its state lasts between function calls.
var clickList = new Array();
function onClickCanvas(e) {
  // Compute point in pixel coordinates (note the inverted Y value due to OpenGL mode)
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = rect.height - (e.clientY - rect.top);
  var lastClickPos = new Point(x, y);

  // Print to the javascript console for debugging/verificaiton
  console.log('click at (' + lastClickPos.x + ',' + lastClickPos.y + ')');

  // Add the point to the list
  clickList.push(lastClickPos);

  // Check if we have enough points to make the current shape
  var shapeAdded = false;
  switch ($('#shapeType')[0].selectedIndex) {
      case 0: // Circle
        addShapeToScene(new Circle(gl, clickList[0], GUIRadius(),
                        GUIColor(), GUIFilled()));
        shapeAdded = true;
      break;

      case 1: // Line
        if (clickList.length >= 2) {
          addShapeToScene(new Line(gl, clickList[0], clickList[1],
                          GUIColor(), GUIFilled()));
          shapeAdded = true;
        }
      break;

      case 2: // triangle
        if (clickList.length >= 3) {
          addShapeToScene(new Triangle(gl, clickList[0], clickList[1], clickList[2],
                          GUIColor(), GUIFilled()));
          shapeAdded = true;
        }
      break;
  }

  // Things to do every time a shape is added
  if (shapeAdded) {
    updateSceneList();
    needToRender = true;
    clickList = new Array();
  }
}

function onModeChanged() {
  // Clear out old clicks
  clickList = new Array();

  if ($('#renderingMode')[0].selectedIndex == 0) {
    rasterizerMode = true;
    $('#glCanvas')[0].hidden = true;
    $('#rasterizerCanvas')[0].hidden = false;
  } else {
    rasterizerMode = false;
    $('#glCanvas')[0].hidden = false;
    $('#rasterizerCanvas')[0].hidden = true;
  }
}

function updateSlowMo() {
  slowMoEnabled = $('#slowMoCheckbox')[0].checked;
  slowMoSpeed = parseInt($('#slowMoSpeed').val());

  if (slowMoEnabled) {
    $('#slowMoSpeed')[0].disabled = false;
  } else {
    $('#slowMoSpeed')[0].disabled = true;
  }
}

function onTypeChanged() {
  // Clear out old clicks and start fresh
  clickList = new Array();

  // Make sure radius never stays 0 when a circle is selected
  if ($('#shapeType')[0].selectedIndex == 0) {
    if ($('#radius').val() == 0) {
      $('#radius').val(10);
    }
  }

  // Deselect any scene shape and disable transformation controls
  $('#shapeSelect')[0].selectedIndex = -1;
  $('#transformSet').prop('disabled', true);
}

var blockUpdate = true;
function onActiveChanged() {
  // Check index and retrieve relevant shape
  var index = $('#shapeSelect')[0].selectedIndex;
  if (index >= 0 && index < scene.length) {
    var shape = scene[$('#shapeSelect')[0].selectedIndex];

    // Copy shape properties into the GUI
    $('#redColor').val(sanitizeValue(shape.color.r, 0) * 255.0);
    $('#greenColor').val(sanitizeValue(shape.color.g, 0) * 255.0);
    $('#blueColor').val(sanitizeValue(shape.color.b, 0) * 255.0);
    $('#radius').val(sanitizeValue(shape.radius, 0));
    $('#filled')[0].checked = sanitizeValue(shape.filled, true);

    // Copy transformation properties into the GUI
    $('#xTranslate').val(sanitizeValue(shape.tx, 0));
    $('#yTranslate').val(sanitizeValue(shape.ty, 0));
    $('#xScale').val(sanitizeValue(shape.sx, 1));
    $('#yScale').val(sanitizeValue(shape.sy, 1));
    $('#rotAngle').val(sanitizeValue(shape.rotAngle, 0));
    $('#pivotCentroid')[0].checked = sanitizeValue(shape.rotPivot, true);

    // Enable the transformation controls
    $('#transformSet').prop('disabled', false);
  } else if (index < 0) {
    $('#transformSet').prop('disabled', true);
  }
}

// Copy GUI values for shape properties back to current shape
function updateShapeProperties() {
  // Check index and retrieve relevant shape
  var index = $('#shapeSelect')[0].selectedIndex;
  if (index >= 0 && index < scene.length) {
    var shape = scene[$('#shapeSelect')[0].selectedIndex];

    // Copy GUI values to shape properties
    shape.color = GUIColor();
    shape.filled = GUIFilled();

    var oldRadius = shape.radius;
    shape.radius = GUIRadius();

    // If the radius changed then the shape needs to rebuild
    if (shape.radius !== oldRadius) {
      shape.updateBuffers(gl);
    }

    // Re-render the scene to show changes
    needToReRasterize = needToRender = true;
  }
}

// Copy GUI values for shape transformation back to current shape
function updateShapeTransformation() {
  // Check index and retrieve relevant shape
  var index = $('#shapeSelect')[0].selectedIndex;
  if (index >= 0 && index < scene.length) {
    var shape = scene[$('#shapeSelect')[0].selectedIndex];

      // Copy values from all transformation controls
      shape.tx = parseFloat($('#xTranslate').val());
      shape.ty = parseFloat($('#yTranslate').val());
      shape.sx = parseFloat($('#xScale').val());
      shape.sy = parseFloat($('#yScale').val());
      shape.rotAngle = parseFloat($('#rotAngle').val());
      shape.rotPivot = $('#pivotCentroid')[0].checked;

      // Rebuild the transformation matrix and buffer
      rebuildTransformationMatrix(shape);
      shape.updateBuffers(gl);

      // Re-render the scene to show changes
      needToReRasterize = needToRender = true;
  }
}

// Rebuild the list of shapes in the GUI
function updateSceneList() {
  var select = $('#shapeSelect')[0];
  select.selectedIndex = -1;
  for (var i = select.length - 1; i >= 0; i--) {
    select.remove(i);
  }

  scene.forEach(function(shape, index) {
    var newOption = document.createElement('option');
    newOption.text = SHAPE_TYPE.strings[shape.type] + ' ' + shape.id;
    select.add(newOption);
  });
}

// Extract and parse the GUI color input value
function GUIColor() {
  return new Color(parseFloat($('#redColor').val()) / 255,
                   parseFloat($('#greenColor').val()) / 255,
                   parseFloat($('#blueColor').val()) / 255);
}

// Extract and parse the GUI radius input value
function GUIRadius() {
  return parseFloat($('#radius').val());
}

// Extract and parse the GUI filled input value
function GUIFilled() {
  return $('#filled')[0].checked;
}

// check that a value is defined or fall back to default
function sanitizeValue(value, fallback) {
  return ((typeof value !== 'undefined') ? value : fallback);
}
