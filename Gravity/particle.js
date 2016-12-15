particle = function(lx, ly, lSpawnTime, lvelX, lvelY, llifeTime, lInnerRadius, lOuterRadius, lblinking){

	//console.log("its alive");
	if(typeof lx === 'undefined') {lx = 0};
	if(typeof ly === 'undefined') {ly = 0};

	if(typeof lvelX === 'undefined') {lvelX = 0};
	if(typeof lvelY === 'undefined') {lvelY = 0};

	if(typeof lOuterRadius === 'undefined') {lOuterRadius = 6};
	if(typeof lInnerRadius === 'undefined') {lInnerRadius = 3};

	if(typeof llifeTime === 'undefined') {llifeTime = 6};
	if(typeof lSpawnTime === 'undefined') {lSpawnTime = 0};

	if(typeof lblinking === 'undefined') {lblinking = false};

	var arcDistance = Math.PI * 2;

	this.x = lx;
	this.y = ly;

	this.lifeTime = llifeTime;
	this.spawnTime = lSpawnTime;

	this.originalSpawn = this.spawnTime;

	this.timeAlive = 0;
	this.ageRatio = 1;

	this.vx = lvelX;
	this.vy = lvelY;

	this.alpha = 1;
	this.outerRadius = lOuterRadius;

	this.innerRadius = lInnerRadius;
	this.id = 0

	this.moveDelay = .04;
  	this.lastMoved = 0;

  	this.blinkDelay = .1;
  	this.lastBlinked = 0;

	this.blinking = lblinking;
	this.visible = true;

	this.fadeDelay = 0;
	this.alive = true;

	this.ageAdjustedOuterRadius = lOuterRadius;
	this.ageAdjustedInnerRadius = lInnerRadius;

	this.pulsing = false;
	this.fadeout = false;

	this.lastFadeout = 0;

	this.colorValues = {

		r: Math.floor(Math.random()*255),
		g: Math.floor(Math.random()*255),
		b: Math.floor(Math.random()*255)

	}

	this.color = "CLEAR";

	this.colorString = 'rgba(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + 
					',' + Math.floor(Math.random()*255) + ',' + this.alpha + ')';
	//console.log(this.color + "  ** " + this.alpha);
	this.outerColor = 'rgba(200,200,200,' + this.alpha + ' )';

 this.distance = function(c2){
    var vx = this.x - c2.centerX();
    var vy = this.y - c2.centerY();

    var magnitude = Math.sqrt((vx * vx) + (vy * vy));

    return magnitude;
 }

	this.draw = function(deltaTime){

		if(typeof deltaTime === 'undefined') {deltaTime = 0.02};
			//console.log(this.timeAlive);
			this.timeAlive += deltaTime;

			if(this.fadeout){

				this.alpha -= (deltaTime*.6);
				if(this.alpha < .3){

					this.alpha = 1;

				}
				this.updateAlpha();

			}// END IF fadeOut

			if(this.visible){

			if(this.moveDelay + this.lastMoved < currentTime){
				//console.log(this.spawnTime);

				this.x += this.vx;
		        this.y += this.vy;

			}

				ctx.save();

				ctx.beginPath();
				ctx.arc(this.x, this.y, this.outerRadius*this.ageRatio, 0, arcDistance);

				ctx.closePath();

				var gradient = ctx.createRadialGradient(this.x,this.y, this.innerRadius*this.ageRatio, this.x , this.y, this.outerRadius * this.ageRatio);
				gradient.addColorStop(0, this.colorString);
				gradient.addColorStop(1, this.outerColor);

				ctx.fillStyle = gradient;
				ctx.fill();
				ctx.restore(); 

			}// END IF
		
	}; // END DRAW FUNCTION

		this.drawTail = function () {

			if(this.visible){

			if(this.moveDelay + this.lastMoved < game.currentTime){
				//console.log(this.spawnTime);

				this.x += this.vx;
		        this.y += this.vy;

			}

				game.gameScreen.save();

        		game.gameScreen.translate(-game.camera.x,-game.camera.y);
				game.gameScreen.beginPath();
				game.gameScreen.arc(this.x, this.y, this.outerRadius, 0,arcDistance );

				game.gameScreen.closePath();

				game.gameScreen.fillStyle = this.gradient;
				game.gameScreen.fill();
				game.gameScreen.restore(); 

			}// END IF

	}// END drawTail

	this.drawField = function(){
		if(this.visible){
			game.gameScreen.save();

	        game.gameScreen.translate(-game.camera.x,-game.camera.y);
			game.gameScreen.beginPath();
			game.gameScreen.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2);

			game.gameScreen.closePath();

			var gradient = game.gameScreen.createRadialGradient(this.x,this.y, this.innerRadius, this.x , this.y, this.outerRadius);
			gradient.addColorStop(0, this.outerColor);
			gradient.addColorStop(1, this.colorString);

			game.gameScreen.fillStyle = gradient;
			game.gameScreen.fill();
			game.gameScreen.restore();

		}// END IF
		
	}; // END DRAW FUNCTION

	this.drawEllipse = function(deltaTime){

		if(typeof deltaTime === 'undefined') {deltaTime = .14};

				/*if(this.blinking && (this.lastBlinked + this.blinkDelay < game.currentTime)){

					this.lastBlinked = game.currentTime;
					this.visible = !this.visible;

				}*/

			if(this.visible){

			if(this.moveDelay + this.lastMoved < game.currentTime){

				//console.log(this.spawnTime);

				this.x += this.vx;
		        this.y += this.vy;

			}

				game.gameScreen.save();

        		game.gameScreen.translate(-game.camera.x,-game.camera.y);
				game.gameScreen.beginPath();

				// ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
				game.gameScreen.ellipse(this.x, this.y, this.outerRadius/2,this.outerRadius,90 * (Math.PI/180) , 0, Math.PI * 2);

				game.gameScreen.closePath();

				var gradient = game.gameScreen.createRadialGradient(this.x,this.y, this.innerRadius, this.x , this.y, this.outerRadius);
				gradient.addColorStop(0, this.colorString);
				gradient.addColorStop(1, this.outerColor);

				game.gameScreen.fillStyle = gradient;
				game.gameScreen.fill();
				game.gameScreen.restore(); 

			}// END IF
		
	}; // END DRAWEllipse FUNCTION

	this.randomColor = function(){

		this.colorString = 'rgba(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + 
					',' + Math.floor(Math.random()*255) + this.alpha + ')';

		this.outerColorLessTransparent();

	}

	this.setColor = function(red, green, blue, alpha){

		this.colorString = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

	}

	this.outerColorLessTransparent = function(){

		this.stringToColor();
		this.outerColor = 'rgba(' + this.colorValues.r + ',' + this.colorValues.g + ',' + this.colorValues.b + ',' + .1 + ')';

	}

	this.setSize = function(innerRadius, outerRadius){

		this.innerRadius = innerRadius;
		this.outerRadius = outerRadius;

	}

	this.setColorString = function(color){

		//console.log(color);
		this.color = color;

		if(color === "RED"){

			this.colorString = 'rgba(200,0,0,' + this.alpha + ' )';

		}else if(color === "BLUE"){

			this.colorString = 'rgba(0,0,200,' + this.alpha + ' )';

		}else if(color === "YELLOW"){

			this.colorString = 'rgba(200,200,0,' + this.alpha + ' )';

		}else if(color === "GREEN"){

			this.colorString = 'rgba(0,200,0,' + this.alpha + ' )';

		}else if(color === "ORANGE"){

			this.colorString = 'rgba(200,150,32,' + this.alpha + ' )';

		}else if(color === "CLEAR"){

			this.colorString = 'rgba(200,200,200,' + this.alpha + ' )';

		}else if(color === "PURPLE"){

			this.colorString = 'rgba(200,0,200,' + this.alpha + ' )';

		}else{

			this.colorString = 'rgba(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + 
					',' + Math.floor(Math.random()*255) + ',' + this.alpha + ')';
		}

		this.outerColorLessTransparent();

		//console.log(this.colorString);

	}// END setColorString

	this.init = function(lx, ly, lSpawnTime, lvelX, lvelY, llifeTime, lInnerRadius, lOuterRadius){
		//console.log("locked and loaded");

		if(typeof lx === 'undefined') {lx = 0};
		if(typeof ly === 'undefined') {ly = 0};

		if(typeof lvelX === 'undefined') {lvelX = 0};
		if(typeof lvelY === 'undefined') {lvelY = 0};

		if(typeof lOuterRadius === 'undefined') {lOuterRadius = 20};
		if(typeof lInnerRadius === 'undefined') {lInnerRadius = 0};

		if(typeof llifeTime === 'undefined') {llifeTime = 6};
		if(typeof lSpawnTime === 'undefined') {lSpawnTime = 0};

		if(typeof lblinking === 'undefined') {lblinking = true};

		this.x = lx;
		this.y = ly;

		this.lifeTime = llifeTime;
		this.spawnTime = lSpawnTime;

		this.originalSpawn = this.spawnTime;
		this.ageRatio = 1;

		this.vx = lvelX;
		this.vy = lvelY;

		this.alpha = 1;
		this.outerRadius = lOuterRadius;

		this.innerRadius = lInnerRadius;
		this.id = 0

		this.moveDelay = .04;
	  	this.lastMoved = 0;

	  	this.blinkDelay = .1;
	  	this.lastBlinked = 0;

		this.blinking = lblinking;
		this.visible = true;

		this.fadeDelay = .5;
		this.alive = true;

		this.colorString = 'rgba(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + 
						',' + Math.floor(Math.random()*255) + ',' + this.alpha + ')';

		//console.log(this.color + "  ** " + this.alpha);
		this.outerColor = this.outerColorLessTransparent();

	}

	this.blackWhite = function(){

		var shade = Math.floor(Math.random()*255);

		this.colorString = 'rgba(' + shade + ',' + shade + 
						',' + shade + ',' + this.alpha + ')';

		this.outerColorLessTransparent();

	}

	this.stringToColor = function(){

		var color = this.colorString.split("(");
		var rgb = color[1].trim().split(",");	

		this.colorValues.r = parseInt(rgb[0]);
		this.colorValues.g = parseInt(rgb[1]);
		this.colorValues.b = parseInt(rgb[2]);

		// console.log(color[1]);
		// console.log(rgb[1]);
		// console.log(this.color.r + " " + this.color.g + " " + this.color.b);

	} // END stringToColor

	this.setAlpha = function(alpha){

		this.alpha = alpha;

	} // setAlpha

	this.updateAlpha = function(){

		this.stringToColor();
		this.colorString = 'rgba(' + this.colorValues.r + ',' + this.colorValues.g + ',' + this.colorValues.b + ',' + this.alpha + ')';
		this.outerColor = this.colorString;
	}


	this.boundingSphereHitDetection = function(c2){

		var hit = false;

		var vx = this.x - c2.x;
		var vy = this.y - c2.y;

		var magnitude = Math.sqrt((vx * vx) + (vy * vy));

		var totalRadiWidth = this.outerRadius + (c2.outerRadius);

		  //compares it to the combined widths of the spheres
		  if((magnitude < totalRadiWidth)){

				    hit = true;
		    //console.log(magnitude + " " + totalRadiWidth + " " + this.halfWidthCollision() );
		  }

		  //console.log(magnitude + " " + totalRadiWidth + " " + hit);
		  return hit;

	}// END hit detection

	this.turnPulsingOff = function(){

		this.pulsing = false;

	}// END PULSINGOFF

	this.turnPulsingOn = function(){

		this.pulsing = true;

	} //END PULSINGON

	this.setGradient = function (argument) {

		this.gradient = game.gameScreen.createRadialGradient(this.x,this.y, this.innerRadius, this.x , this.y, this.outerRadius);
		this.gradient.addColorStop(0, this.colorString);
		this.gradient.addColorStop(1, this.outerColor);
		
	}


}