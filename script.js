window.runLoop = null;
window.on = false;
window.canvasElement = document.getElementById('canvas');
window.ctx = canvasElement.getContext("2d");
window.canvasWidth = canvasElement.width;
window.canvasHeight = canvasElement.height;
window.buildingSpacing = 250;
window.buildingWidth = 100;
window.ballRadius = 15;
window.buildings = [];
window.pointsCounter = document.getElementById('points');


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
	else {
		resetGame();
	}
}

function lose() {
	startStop();
}

function Building(offset) {
	function randomIntFromInterval(min,max) {
    	return Math.floor(Math.random()*(max-min+1)+min);
	}
	
	this.gap = randomIntFromInterval(150, 300);
	this.centerline = randomIntFromInterval(150, canvasHeight - 150);
	this.x = offset;
	this.conquered = false;
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
	else if (x-radius > maxX) {
		if (!this.conquered)
			pointsCounter.value = parseInt(pointsCounter.value) + 1;
		this.conquered = true;
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
		b.x = b.x - scrollSpeed;
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
		var offset = buildings[buildings.length-1].x + buildingSpacing;
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
	x = canvasWidth / 2;
	y = canvasHeight / 2;
	Vy = 0;
	Ay = .0015;
	//Ay = 0;
	scrollSpeed = 1 * speedMultiplier;
	powerFactor = 1 * speedMultiplier;
	lastTime = new Date().getTime();
	
	buildings = [
		new Building(canvasElement.width + 0 * window.buildingSpacing + window.buildingWidth),
		new Building(canvasElement.width + 1 * window.buildingSpacing + window.buildingWidth),
		new Building(canvasElement.width + 2 * window.buildingSpacing + window.buildingWidth)
	];

	startStop();//runLoop = setInterval(draw, 10);
}

window.addEventListener('load', function() {

	var clickHandler = ('ontouchstart' in document.documentElement ? "touchstart" : "mousedown");
	canvasElement.addEventListener(clickHandler, flap, false);
	//canvasElement.addEventListener('mouseout', function(){if(on)startStop();}, false);
	//canvasElement.addEventListener('mouseover', function(){if(!on)startStop();}, false);
	document.addEventListener('keydown', flap, false);
	//xDisplay = document.getElementById('x');
	//yDisplay = document.getElementById('y');	
	
	// draw ball
	ctx.beginPath();
	ctx.arc(canvasWidth/2, canvasHeight/2, ballRadius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	
}, false);
