

// First example is how my black hole worked

// The main part we are interested in is the variables at the top and in the first if statement in the for loop
// First I do a distance calculation between the object which I will show in code next but is only the basic distance formula
// Inside the if(dist < this.attractParticlesDistance){ is where the work is done to apply the gravitation effect

// force =  ( G * m1*m2 / ( dist * dist)); calculates the force between the object
// which is then applied in the direction of the black hole by take a difference in their position to get a vector between them

this.blackHoleEatParticles = function(){
	//console.log("so hungry");
	var dirVector = { x:0, y:0};
	var force;
	var G = 20;   //constant to be played with
	var m1 = 10;  //mass of black hole
	var m2 = 1;   //mass of particle

    for(var i = 0; i < game.totalEnemyList.length; ++i){

		if(game.totalEnemyList[i].alive){

				var dist = this.distance(game.totalEnemyList[i]);

			if(dist < this.attractParticlesDistance){

				force =  ( G * m1*m2 / ( dist * dist));

				dirVector.x = this.x - game.totalEnemyList[i].x;
				dirVector.y = this.y - game.totalEnemyList[i].y;

			//TODO seems to work fine without normalizeing vector, when normalize the force is to weak for
			//flocking particles but works great for single particles
			//	this.normalize(dirVector);

				dirVector.x *= force;
				dirVector.y *= force;

				game.totalEnemyList[i].accleration.x += dirVector.x;
				game.totalEnemyList[i].accleration.y += dirVector.y;

			}

			if(this.boundingSphereHitDetection(game.totalEnemyList[i])){

				if(game.totalEnemyList[i].flock){
					console.log("nom nom nom");

					enemyPooler.despawnEnemy(game.totalEnemyList[i].id);
					++this.particleEatenCount;

				}else{

					enemyPooler.despawnEnemyNonFlocking(game.totalEnemyList[i].id);
					++this.particleEatenNoFlockincount;

				}// END IF FLOCKING


			}// END PRELIMINARY DISTANCE CHECK


		}// END IF ALIVE

	}// END FOR


}// END blackHole

// Next is the distance equation I used

 this.distance = function(c2){
    var vx = this.centerX() - c2.centerX();
    var vy = this.centerY() - c2.centerY();

    var magnitude = Math.sqrt((vx * vx) + (vy * vy));

	 	return magnitude;
 }

// This is the code for collision detection using sphere colliders

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


// This is part of that animation loop the rest is just uneeded code for flocking


mainUpdate = function(){

  window.requestAnimationFrame(mainUpdate);

  if(!game.gamePaused){

    game.currentTime =  (Date.now() / 1000) - game.startTime;
    game.deltaTime = game.currentTime - game.prevTime;

    if(game.deltaTime >= game.delay){

      game.camera.update(player1.x, player1.y);

      game.prevTime = game.currentTime;
      player1.update();

      if(showNotify == true && game.currentTime - lastNotify > notifyTime)
      {
        showNotify = false;
        gameMenuTest.style.visibility = 'hidden';
      }

      playerField.update(player1.x + player1.width/2, player1.y+ player1.height/2);
      //console.log("player " + player1.x + " " + player1.y);
      // console.log("camera " + game.camera.x + " " + game.camera.y);

      game.scoreField.x = game.camera.x + game.camera.width -140;
      game.scoreField.y = game.camera.y + 90;
      // DISPLAY PARTICLES

      game.colorIndicator.update();
      render();
      //player1.drawTail();

      //particlePooler.update(game.currentTime);
    }

    // Then finally this is the render function I was using to render sprite images
    // It will need to slightely changed to do shapes but the gernal idea is there
    // Ours will also be qutie a bit easier since we will not have to take into account into account any scrolling effects unless we want to

    function render(){
  // if(lastRender + renderDelay < game.currentTime){
  //   lastRender = game.currentTime;
    game.gameScreen.clearRect(0, 0, game.canvas.width, game.canvas.height);
    drawBackground();
    game.greenZoneAbility.update();
    //tree.drawTree();
    game.drawAurora();
    game.theDiscoveries.update();
    if(gameState == STATE_GAME)
    {
      drawColorIndicator();

    }

     if(game.gameSprites.length !== 0){

      for(var i = 0; i < game.gameSprites.length; i++)
      {

        //console.log(game.gameSprites[i].image);
        if(game.gameSprites[i].visible){

          game.gameScreen.save();

          game.gameScreen.translate(
              Math.floor(game.gameSprites[i].x + (game.gameSprites[i].width / 2) -game.camera.x),
              Math.floor(game.gameSprites[i].y + (game.gameSprites[i].height / 2)) -game.camera.y);

          game.gameScreen.rotate(game.gameSprites[i].rotate * (Math.PI/180));

          game.gameScreen.drawImage(
          mainImage,
          game.gameSprites[i].sourceX, game.gameSprites[i].sourceY,
          game.gameSprites[i].sourceWidth, game.gameSprites[i].sourceHeight,
          Math.floor(-game.gameSprites[i].width/2), Math.floor(-game.gameSprites[i].height/2),
          game.gameSprites[i].width, game.gameSprites[i].height);

          game.gameScreen.restore();

        } // END if(sprite.visible)

      }// END for(var i = 0; i < gameSprites.length; i++)
    //}// IF LASTRENDER
  }

  player1.tailParticles.update();
  game.renderFieldParticles();
  game.portalAnimation.update();
  game.blackHole.update();
  game.rainbowPortal.update();

}// END function render()
