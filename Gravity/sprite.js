var sprite = function(){

	// name of sprite for debuging
	this.name = "";

	// x and y location of sprite on the image file
	this.sourceX = 2;
	this.sourceY = 2;

	// how much of the image to display
	this.sourceWidth = 64;
	this.sourceHeight = 66;

	// independent collision detection
	this.collisionWidth = 64;
	this.collisionHeight = 64;

	//actual display width and heigth of image
	this.width = 64;
	this.height = 64;

	// current location of the image on the canvas
	this.x = 0;
	this.y = 0;

	// to display the sprite or not to
	this.visible = true;
	this.rotate = 0;

	this.vx = 0;
	this.vy = 0;

	// values for animation to keep track of orig frame to display
	this.originalX = 0;
	this.originalY = 0;

	// for animation the size of each animation frame
	this.size = 66;
	this.columns = 10;

	// for animations keep track of frames
	this.numberFrames = 6;
	this.currentFrame = 0;

	this.lastAnimationUpdate = 0;
	this.animationDelay = .051

  this.lifeTime = .25;
  this.spawnTime = 0;

	// transparency for spite images
	this.alpha = 1;


	// updates animation to the correct framing timing is not incorperated yet
  this.updateAnimation = function(){

    //console.log("firing animation");
    if(this.lastAnimationUpdate + this.animationDelay < game.currentTime){
      this.lastAnimationUpdate = game.currentTime;

      this.currentFrame = this.currentFrame + 1;
      //console.log(this.currentFrame);

      if(this.currentFrame < this.numberFrames && this.currentFrame >= 0){
        //console.log("animationing");

        this.sourceX = (this.size * this.currentFrame) + this.originalX
        this.sourceY = this.originalY;

        if(this.sourceX >= 1322){ // 1322 is size of sprite sheet
          //console.log("to big");

          this.sourceY = (this.sourceY + (Math.floor(this.sourceX / 1322))*this.size);
          this.sourceX = (this.sourceX - 794) + 2

        }// END IF
      }else {
        console.log("broken?");
        this.currentFrame = -1;

      }// END IF FRAMES
    }// END IF TIMING

    //console.log(this.sourceX + " * " + this.sourceY + " = " + this.currentFrame );
  } // END updateAnimation

  // allows you sepcifically set an animation frame to manually change sprites
  this.setFrame = function(t){

      if(t < this.numberFrames){

      this.sourceX = (this.size * this.currentFrame) + this.originalX
      this.sourceY = this.originalY;
      if(this.sourceX >= 794){
        //console.log("to big");
        this.sourceY = (this.sourceY + (Math.floor(this.sourceX / 794))*this.size);
        this.sourceX = (this.sourceX - 794) + 2;

      }
      //console.log(this.currentFrame + "    " + this.sourceX + "       " + this.sourceY)
    }
  }

  // a list of functions to assit with boundary and collision detection
  this.halfWidth = function() {

    return (this.width / 2);

  },

  this.halfHeight = function(){

    return (this.height / 2);

  },
  this.centerX = function() {

    return this.x + (this.width / 2);

  },

  this.centerY = function() {

    return this.y + (this.height / 2);

  },

  this.halfWidthCollision = function() {

    return (this.collisionWidth / 2);

  },

  this.halfHeightCollision = function(){

    return (this.collisionHeight / 2);

  },
  this.centerXCollision = function() {

    return this.x + (this.collisionWidth / 2);

  },

  this.centerYCollision = function() {

    return this.y + (this.collisionHeight / 2);

  }

  // collision detection for sprite image.

  this.boundingSphereHitDetection = function(c2){

  var hit = false;

  // gets difference in x and y to calc distance between them
  var vx = this.centerXCollision() - c2.centerXCollision();
  var vy = this.centerYCollision() - c2.centerYCollision();

  // calculates distance 
  var magnitude = ((vx * vx) + (vy * vy));

  var totalRadiWidth = (this.halfWidthCollision() + c2.halfWidthCollision()) * (this.halfWidthCollision() + c2.halfWidthCollision());

  //compares it to the combined widths of the spheres
  if((magnitude < totalRadiWidth)){

    hit = true;
    //console.log(magnitude + " " + totalRadiWidth + " " + this.halfWidthCollision() );
  }

  //console.log(magnitude + " " + totalRadiWidth + " " + hit);
  return hit;
}

 this.distance = function(c2){
    var vx = this.centerX() - c2.centerX();
    var vy = this.centerY() - c2.centerY();

    var magnitude = Math.sqrt((vx * vx) + (vy * vy));

	 	return magnitude;
 }

 this.distanceField = function(c2){
    var vx = this.centerX() - c2.x;
    var vy = this.centerY() - c2.y;

    var magnitude = Math.sqrt((vx * vx) + (vy * vy));

    return magnitude;
 }
// function each sprite object inherits to prevent edge collision
//   this.boundaryDetection = function(){
//
//     if(this.x + this.width/2 < 0){
//       //this.x = game.width - this.width;
//
//       this.velocity.x = -this.velocity.x;
//     }
//
//     if(this.x + this.width> game.width){
//
//       //this.x = 0 - this.width/3;
//       this.velocity.x = -this.velocity.x;
//
//     }
//
//     if(this.y + this.height/2 < 0){
//
//       //this.y = game.height - this.height;
//       this.velocity.y = -this.velocity.y;
//
//     }
//
//     if(this.y + this.height > game.height){
//       this.velocity.y = -this.velocity.y;
//       //this.y = 0 - this.height/3;
//
//     }
//
// } // END BOUNDARYDETECTION




// OLD BOUNDARY DETECTION

   this.boundaryDetection = function(){

    if(this.x + this.width/2 < 0){
      this.x = game.width - this.width;
    }

    if(this.x + this.width> game.width){

      this.x = 0 - this.width/3;

   }

     if(this.y + this.height/2 < 0){

      this.y = game.height - this.height;

     }

     if(this.y + this.height > game.height){

       this.y = 0 - this.height/3;

    }
	}
		}; // END spriteObject
