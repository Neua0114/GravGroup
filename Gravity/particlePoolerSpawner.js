particlePoolerSpawner = function( lMax, lDelay){

	slidePart = document.getElementById("slideParticle");

	if(typeof lMax === 'undefined') {lMax = 400};
	if(typeof lSpawnDelay === 'undefined') {lSpawnDelay = 1};

	this.maxSpawn = lMax;
	this.currentSpawn = 0;

	this.spawnPool = [];
	this.spawnTime = 0;

	this.particleCount = 0;
	this.spawnDelay = lSpawnDelay;

	this.deadParticle = null;

	this.startSpawnerPooling = function(){
		//console.log("the brood is alive");
		for(var i = 0; i < this.maxSpawn; ++i){

			this.spawnPool[i] = (new particle());
			this.spawnPool.alive = false;
			this.spawnPool.visible = false;
		}

	}

	// lx, ly, lSpawnTime, lvelX, lvelY, llifeTime, lInnerRadius, lOuterRadius, lblinking
	this.spawnParticles = function(quantity, lx, ly, lSpawnTime, lvelX, lvelY, llifeTime, lInnerRadius, lOuterRadius, lblinking){
		//console.log("spawning more particles");

		if(this.maxSpawn - this.particleCount > quantity){

			for(var i = 0; i < quantity; ++i){

				this.spawnPool[this.particleCount].init(lx, ly, lSpawnTime, lvelX, lvelY, llifeTime, lInnerRadius, lOuterRadius, lblinking);
				this.spawnPool[this.particleCount].id = this.particleCount;
				++this.particleCount;
			}// END for(int i = this.particleCount; i < quantity; ++i)

		}// END if(this.particleCount > quantity)

	}

	this.spawnRandomParticles = function(quantity, lx, ly, lSpawnTime){
		//console.log("spawning more particles");

		if(this.maxSpawn - this.particleCount > quantity){

			for(var i = 0; i < quantity; ++i){

				this.spawnPool[this.particleCount].init(lx, ly, lSpawnTime, this.randomNumber(1,4), 
              				this.randomNumber(1,4), this.randomNumberNoNegative(3,7) , 4 , 10, true );

				this.spawnPool[this.particleCount].id = this.particleCount;
				++this.particleCount;
			}// END for(int i = this.particleCount; i < quantity; ++i)

		}// END if(this.particleCount > quantity)

	}

	this.despawnParticle = function(lid){
		
		if(typeof lid === 'undefined') {lid = -1};
		//console.log(this.deadParticle);

		if(lid > 0){

			this.deadParticle = this.spawnPool[lid];

			this.spawnPool[lid] = this.spawnPool[this.particleCount-1];
			this.spawnPool[lid].id = lid;

			this.spawnPool[this.particleCount-1] = this.deadParticle;

			this.deadParticle.visible = false;
			this.deadParticle.alive = false;

			--this.particleCount;

		}



	}// END despawnParticle

	this.update = function(currentTime){
		//console.log(currentTime);

		for(var i = 0; i < this.particleCount; ++i){
			if(this.spawnPool[i].alive){			
				if(this.spawnPool[i].originalSpawn + this.spawnPool[i].lifeTime > currentTime){

					this.spawnPool[i].draw(deltaTime);

			}else{

				this.despawnParticle(this.spawnPool[i].id);

				}// END IF
			}// END IF ALIVE
			
		}// END FOR


	}// END update

		this.updateTail = function(currentTime){
		//console.log(currentTime);

		for(var i = 0; i < this.particleCount; ++i){
			if(this.spawnPool[i].alive){			
				if(this.spawnPool[i].originalSpawn + this.spawnPool[i].lifeTime > currentTime){

					this.spawnPool[i].drawTail(deltaTime);

			}else{

				this.despawnParticle(this.spawnPool[i].id);

				}// END IF
			}// END IF ALIVE
			
		}// END FOR


	}// END update

		this.spawnParticlesBlackWhite = function(quantity, lx, ly, lSpawnTime, lvelX, lvelY, llifeTime, lInnerRadius, lOuterRadius, lblinking){
		//console.log("spawning more particles");

		if(this.maxSpawn - this.particleCount > quantity){

			for(var i = 0; i < quantity; ++i){

				this.spawnPool[this.particleCount].init(lx, ly, lSpawnTime, lvelX, lvelY, llifeTime, lInnerRadius, lOuterRadius, lblinking);
				this.spawnPool[this.particleCount].id = this.particleCount;
				this.spawnPool[this.particleCount].blackWhite();
				++this.particleCount;
			}// END for(int i = this.particleCount; i < quantity; ++i)

		}// END if(this.particleCount > quantity)

	}

	this.spawnRandomParticlesBlackWhite = function(quantity, lx, ly, lSpawnTime){
		//console.log("spawning more particles");

		if(this.maxSpawn - this.particleCount > quantity){

			for(var i = 0; i < quantity; ++i){

				console.log("dead");

				this.spawnPool[this.particleCount].init(lx, ly, lSpawnTime, this.randomNumber(1,4), 
          				this.randomNumber(1,4), this.randomNumberNoNegative(3,7) , 3 , 6, true );

				this.spawnPool[this.particleCount].id = this.particleCount;
				this.spawnPool[this.particleCount].blackWhite();
				++this.particleCount;
		}// END for(int i = this.particleCount; i < quantity; ++i)

	}// END if(this.particleCount > quantity)

	}// spawnRandomParticlesBlackWhite


	this.spawnSingleParticleTail = function(lx, ly, lSpawnTime, lvelX, lvelY, color){

		//lx, ly, lSpawnTime, lvelX, lvelY, llifeTime, lInnerRadius, lOuterRadius,lblinking

		if(this.particleCount < this.maxSpawn){
			
			//console.log(lvelX + "  " + lvelY);

			this.spawnPool[this.particleCount].init(lx, ly, lSpawnTime, 0, 0, .7, 2, 4,false);
			this.spawnPool[this.particleCount].id = this.particleCount;

			this.spawnPool[this.particleCount].setColorString(color);
			this.spawnPool[this.particleCount].setGradient();
			//console.log("spawned tail " + " " + this.spawnPool[this.particleCount].x + " " + this.spawnPool[this.particleCount].y );
			//console.log("player cords " + " " + player1.x + " " + player1.y );

			this.particleCount++;
		}



	}// END SPAWNSINGLEPARTICLE

	this.randomNumber = function(min, max){
    	var negPos = Math.round(Math.random()) * 2 - 1;
      return Math.floor((Math.random() * max) + min) * negPos;
  }

  	this.randomNumberNoNegative = function(min, max){
      	return Math.floor((Math.random() * max) + min);
 	}



}// END particleSpawner