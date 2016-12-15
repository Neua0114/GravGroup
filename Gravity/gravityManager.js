
var canvas = document.getElementById('gravCanvas')
var ctx = canvas.getContext('2d');

 $('.objectPropertyControls').on('input', updateObject);
 $('#selectObject').change(onObjectChanged);

var particlePool = new particlePoolerSpawner();

var assetsToLoad = [];
var assetsLoaded = 0;

var sprites = [];
var influencableObjects = [];

var gravityObjects = [];
var clickList = new Array();

var currentTime = 0;
var startTime = Date.now()/1000.0;

var deltaTime = 0;
var delay = 0;

var prevTime = 0;

var mainImage = new Image();
mainImage.addEventListener("load", loadHandler, false);
mainImage.src = ("planetSpriteSheet.jpg");
assetsToLoad.push(mainImage);

// var testSprite = new sprite;

// testSprite.x = 20;
// testSprite.y = 20;

// testSprite.sourceX = 60;
// testSprite.sourceY = 0;

// testSprite.sourceWidth = 60;
// testSprite.sourceHeight = 60;

// testSprite.gravity = true;
// testSprite.mass = 10;
// testSprite.gravitationalForce = 2

// testSprite.name = 'bigBoy'

// sprites.push(testSprite);
// gravityObjects.push(testSprite);

// var testSprite2 = new sprite;

// testSprite2.x = 400;
// testSprite2.y = 400;

// testSprite2.sourceX = 0;
// testSprite2.sourceY = 0;

// testSprite2.sourceWidth = 60;
// testSprite2.sourceHeight = 60;

// testSprite2.mass = 20;

// influencableObjects.push(testSprite2);

// sprites.push(testSprite2);

// var testSprite3 = new sprite;

// testSprite3.x = 600;
// testSprite3.y = 600;

// testSprite3.sourceX = 0;
// testSprite3.sourceY = 60;

// testSprite3.sourceWidth = 60;
// testSprite3.sourceHeight = 60;

// testSprite3.width = 20;
// testSprite3.height = 20;

// testSprite3.gravity = true;
// testSprite3.mass = 10;

// testSprite3.gravitationalForce = 1;
// testSprite3.name = "littleGuy"

// gravityObjects.push(testSprite3);
// sprites.push(testSprite3);

function render(){
  // if(lastRender + renderDelay < game.currentTime){
  //   lastRender = game.currentTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

     if(sprites.length !== 0){

      for(var i = 0; i < sprites.length; i++){

        //console.log(sprites[i].image);
        if(sprites[i].visible){

          ctx.save();

          ctx.translate(
              Math.floor(sprites[i].x + (sprites[i].width / 2)),
              Math.floor(sprites[i].y + (sprites[i].height / 2)));

          ctx.rotate(sprites[i].rotate * (Math.PI/180));

          ctx.drawImage(mainImage,
          sprites[i].sourceX, sprites[i].sourceY,
          sprites[i].sourceWidth, sprites[i].sourceHeight,
          Math.floor(-sprites[i].width/2), Math.floor(-sprites[i].height/2),
          sprites[i].width, sprites[i].height);

          ctx.restore();

        } // END if(sprite.visible)

      }// END for(var i = 0; i < gameSprites.length; i++)
    //}// IF LASTRENDER
  }

}// END function render()

mainUpdate = function(){

  window.requestAnimationFrame(mainUpdate);

  //console.log("alive");

  	currentTime =  (Date.now() / 1000) - startTime;
    deltaTime = currentTime - prevTime;

    prevTime = currentTime;

	if(gravityObjects.length > 0){

	  	for(var i = 0; i < gravityObjects.length; i++){
	  		//console.log("calling gravity");
	  		blackHoleGravity(gravityObjects[i]);

	  	}// END FOR

	}// END IF

	for(var i = 0; i < influencableObjects.length; i++){

		influencableObjects[i].update();

	}

  render();
  particlePool.update(currentTime);

}// END MAIN

function loadHandler(){

  assetsLoaded++;

  if(assetsLoaded === assetsToLoad.length)
  {
    //console.log("ready");
    particlePool.startSpawnerPooling();
    mainUpdate();

  }
}// END loadHandler


blackHoleGravity = function(gravityObject){
    //console.log("so hungry");
    var dirVector = { x:0, y:0};
    var force;
    var G = gravityObject.gravitationalForce;   //constant to be played with
    var m1 = gravityObject.mass;  //mass of black hole   //mass of particle
    var m2 = 1;
     for(var i = 0; i < influencableObjects.length; ++i){
     	m2 = influencableObjects[i].mass;
      	//console.log("alive");
          var dist = gravityObject.distance(influencableObjects[i]);

        if(dist > 10){
			force = (G *  m1 * m2) / ( dist * dist);

			//console.log(gravityObject.name + " force is: " + force);

			dirVector.x = (gravityObject.x - influencableObjects[i].x);
			dirVector.y = (gravityObject.y - influencableObjects[i].y );

			//TODO seems to work fine without normalizeing vector, when normalize the force is to weak for
			//flocking particles but works great for single particles
			//gravityObject.normalize(dirVector);

			dirVector.x *= force;
			dirVector.y *= force;

			//console.log(  dirVector.x + " " + dirVector.y);

			influencableObjects[i].accleration.x += dirVector.x;
			influencableObjects[i].accleration.y += dirVector.y;

			//console.log(influencableObjects[i].accleration.x + " " + influencableObjects[i].accleration.y);

     	 }

        if(gravityObject.boundingSphereHitDetection(influencableObjects[i])){

           //console.log("nom nom nom");
           var destroyer =  $('#destroyer').prop('checked');
           
           //console.log(destroyer);
           
           if(destroyer){

           		particlePool.spawnRandomParticlesBlackWhite(10,gravityObject.x + gravityObject.halfWidth(), gravityObject.y + gravityObject.halfHeight(), currentTime);

           		var index = sprites.indexOf(influencableObjects[i]);
           		influencableObjects.splice(i,1);
           		sprites.splice(index,1);
           		//console.log(index);

           }

        }// END PRELIMINARY DISTANCE CHECK



    }// END FOR

}// END blackHole

$('#gravCanvas').click(onClickCanvas);


function onClickCanvas(e) {
  // Compute point in pixel coordinates (note the inverted Y value due to OpenGL mode)
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = (e.clientY - rect.top);
  var lastClickPos = new Point(x, y);

  // Print to the javascript console for debugging/verificaiton
  //console.log('click at (' + lastClickPos.x + ',' + lastClickPos.y + ')');

  // Add the point to the list
  clickList.push(lastClickPos);

  // Check if we have enough points to make the current shape
  var shapeAdded = false;
  switch ($('#object')[0].selectedIndex) {
      case 0: // Circle
        //console.log("Ball");
        shapeAdded = true;
        createBall(lastClickPos);
      break;

      case 1: // Line
       		
       	//console.log("Gravity Well");
        shapeAdded = true;
        createGravityWell(lastClickPos);
        
      break;

      case 2: // triangle
        console.log("Broken");
        shapeAdded = true;
        createBall();
        
      break;

      default:
      	console.log("Broken");
      	break;
  }

  // // Things to do every time a shape is added
  if (shapeAdded) {
    updateObjectList();
  }
}


function Point(X, Y, Z) {
  // X, Y (and optionally a Z) component
  this.x = X; this.y = Y;
  this.z = ((typeof Z !== 'undefined') ? Z : 0);

  // Round this point to the nearest integer dimensions
  this.round = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
  };
}// END POINT


createGravityWell = function(center){

	//console.log("createGravityWell");
	var tempSprite = new sprite();

	tempSprite.x = center.x - tempSprite.width/2;
	tempSprite.y = center.y - tempSprite.height/2;

	var tempGravitationalForce = parseFloat($('#gravForce').val());
	var tempMass = parseFloat($('#mass').val());
	var tempName = $('#objectName').val();

	console.log(tempName + " " + tempMass);

	if(tempGravitationalForce <=0) {tempGravitationalForce = 1};
	if(tempMass <= 0) {tempMass = 1};
	if(tempName === "") {tempName = "gravityWell"};

	//console.log(tempName + " " + tempMass);

	tempSprite.sourceX = 60;
	tempSprite.sourceY = 0;

	tempSprite.sourceWidth = 60;
	tempSprite.sourceHeight = 60;

	tempSprite.gravity = true;
	tempSprite.mass = tempMass;
	tempSprite.gravitationalForce = tempGravitationalForce

	tempSprite.name = tempName;
	tempSprite.objectType = "gravityWell";

	sprites.push(tempSprite);
	gravityObjects.push(tempSprite);


}// END createGravityWell = function(center){

createBall = function(center){

	//console.log("createBall");
	var tempSprite = new sprite();

	tempSprite.x = center.x - tempSprite.width/2;
	tempSprite.y = center.y - tempSprite.height/2;

	var tempGravitationalForce = 0;
	var tempMass = parseFloat($('#mass').val());
	var tempName = $('#objectName').val();

	if(tempMass <=0) {tempMass = 1};
	if(tempName === "") {tempName = "ball"};

	tempSprite.sourceX = 0;
	tempSprite.sourceY = 0;

	tempSprite.sourceWidth = 60;
	tempSprite.sourceHeight = 60;

	tempSprite.mass = tempMass;
	tempSprite.objectType = "ball";

	tempSprite.name = tempName;
	influencableObjects.push(tempSprite);

	sprites.push(tempSprite);

}// END createBall = function(center){

function updateObjectList() {

console.log("gravityManager");
  var select = $('#selectObject')[0];
  select.selectedIndex = -1;
  for (var i = select.length - 1; i >= 0; i--) {
    select.remove(i);
  }

  sprites.forEach(function(object, index) {
    var newOption = document.createElement('option');
    newOption.text = object.name + " " + index;
    select.add(newOption);
  });

}// END function updateObjectList() {

function updateObject() {
  // Check index and retrieve relevant shape
  
  var index = $('#selectObject')[0].selectedIndex;

  //console.log("updating: " + index);
  if (index >= 0 && index < sprites.length) {

  	//console.log("winner winner");
  	var object = sprites[$('#selectObject')[0].selectedIndex];

  	if(object.objectType === "gravityWell"){

	  	object.gravitationalForce = parseFloat($('#gravForce').val());
	  	object.mass = parseFloat($("#mass").val());
	  	object.name = $('#objectName').val();


  	}else if(object.objectType === "ball"){

  		object.mass = parseFloat($('#mass').val());
  		object.name = $('#objectName').val();

  	}// END if(object.objectType === "gravityWell"){

  		//updateObjectList();
  	
  }// END if (index >= 0 && index < sprites.length) {

}// END function updateObject() {


function onObjectChanged() {
  // Check index and retrieve relevant shape
	var index = $('#selectObject')[0].selectedIndex;

	console.log(index);
	if (index >= 0 && index < sprite.length) {

		var object = sprites[$('#selectObject')[0].selectedIndex];

		console.log(index + " " + object.gravitationalForce);

		// Copy object properties into the GUI
		$('#gravForce').val(sanitizeValue(object.gravitationalForce, 0));
		$('#mass').val(sanitizeValue(object.mass, 1));
		$('#objectName').val(sanitizeValue(object.name, 'nan'));

	}// END IF 
}


function sanitizeValue(value, fallback) {

  return ((typeof value !== 'undefined') ? value : fallback);

}


