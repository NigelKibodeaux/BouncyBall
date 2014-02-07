window.runLoop = null;
window.on = false;
window.canvasElement = document.getElementById('canvas');
window.ctx = canvasElement.getContext("2d");
window.canvasWidth = canvasElement.width;
window.canvasHeight = canvasElement.height;
window.buildingSpacing = 250;
window.buildingWidth = 100;
window.buildings = [];

function startStop(){  
	if(on) {
		clearInterval(runLoop);
	} else {
		runLoop = setInterval(draw, 10);
		lastTime = new Date().getTime();
	}
	
	on = !on;
}

function flap() {
	if (on) {
		// modify ball movement
		Vy = Vy - powerFactor;
	}
}

function lose() {
	startStop();
}

function Building(offset) {
	this.gap = 300;
	this.centerline = 400;
	this.x = canvasElement.width + offset;
}
Building.prototype.isOverlap = function(x, y, radius) {
	// both thingies
	var minX = this.x;
	var maxX = this.x + buildingWidth;
	
	// top thingy
	var maxYTop = this.centerline - this.gap/2;
	
	// bottom thingy
	var minYBottom = this.centerline + this.gap/2;
	
	if (x+radius > minX && x-radius < maxX) {
		if (y-radius < maxYTop) // top
			lose();

		if (y+radius > minYBottom) // bottom
			lose();
	}
}

function draw() {	
	
	// new time
	newTime = new Date().getTime();
	
	// increment stuff
	elapsed = newTime - lastTime;
	Vy = Vy + Ay * elapsed;
	y = y + Vy * elapsed;
	
	// clear canvas
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	
	// draw ball
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	
	// draw buildings
	buildings.forEach(function(b){
		b.x--
		ctx.fillRect(b.x, b.centerline + b.gap/2, buildingWidth, canvasHeight - b.centerline - b.gap/2);
		ctx.fillRect(b.x, 0, buildingWidth, b.centerline - b.gap/2);
		
		// detect collisions
		if (b.isOverlap(x, y, ballRadius))
			lose();
	});
	
	// replace buildings if needed
	if (buildings[0].x + buildingWidth == 0) {
		// get rid of oldest
		buildings.shift();
		
		// add a new one
		var offset = 0; //buildings[buildings.length-1].x + buildingSpacing + buildingWidth;
		buildings.push(new Building(offset));
	}

	// don't let it get out of bounds
	if (y > (canvasHeight - ballRadius)) // bottom
		//y = canvasHeight - ballRadius; 
		lose();
	if (y < (0 + ballRadius)) // top
		//y = (0 + ballRadius); 
		lose();
	
	// info
	//xDisplay.value = Math.floor(x);
	//yDisplay.value = Math.floor(y);
	
	lastTime = new Date().getTime();
}

function resetGame() {
	 
	speedMultiplier = 1;
	x = 400;
	y = 300;
	Vy = 0;
	Ax = 0;
	Ay = .0015 * speedMultiplier;
	//Ay = 0;
	scrollSpeed = 1 * speedMultiplier;
	powerFactor = 1 * speedMultiplier;
	ballRadius = 15;
	lastTime = new Date().getTime();
	
	buildings = [
		new Building(0 * window.buildingSpacing + window.buildingWidth),
		new Building(1 * window.buildingSpacing + window.buildingWidth),
		new Building(2 * window.buildingSpacing + window.buildingWidth)/*,
		new Building(3 * window.buildingSpacing + window.buildingWidth),
		new Building(4 * window.buildingSpacing + window.buildingWidth)*/
	];

	startStop();//runLoop = setInterval(draw, 10);
}

window.addEventListener('load', function() {

	canvasElement.addEventListener('mousedown', flap, false);
	//canvasElement.addEventListener('mouseout', function(){if(on)startStop();}, false);
	//canvasElement.addEventListener('mouseover', function(){if(!on)startStop();}, false);
	document.addEventListener('keydown', flap, false);
	//xDisplay = document.getElementById('x');
	//yDisplay = document.getElementById('y');
	
	resetGame();

}, false);
