function startStop(){  
	if(on) {
		clearInterval(runLoop);
	} else {
		runLoop = setInterval(draw, 0);
		lastTime = new Date().getTime();
	}
	
	on = !on;
}

function canvasClick(e) {	
	powerArray.push(new Explosion(mouseX, mouseY));
}

function mouseMove(e) {
	mouseX = e.offsetX;
	mouseY = e.offsetY;
}

function Explosion(initX, initY) {
	this.startTime = new Date().getTime();
	this.timeLimit = 500;
	this.x = initX;
	this.y = initY;
	var dX = x - mouseX;
	var dY = y - mouseY;
	var distance = Math.sqrt(dX*dX + dY*dY);	
	
	// modify ball movement
	Vy = Vy + (powerFactor/distance) * (dY/distance);
	Vx = Vx + (powerFactor/distance) * (dX/distance);
	
	// draw
	this.draw = function() {
		ctx.save();
		var radius = 1.2 * (newTime-this.startTime);
		var opacity = 1 - ( .75 * Math.atan(.01*radius) );
	
		ctx.beginPath();
		ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
		ctx.fillStyle = 'rgba(255,0,0,'+opacity+')';
		ctx.strokeStyle = 'rgba(0,0,0,'+opacity/2+')';
		ctx.lineWidth = 5;
		//ctx.stroke();
		ctx.fill();
		ctx.restore();
	}
}

function StickyPatch(initX, initY) {
	this.startTime = new Date().getTime();
	this.timeLimit = 1000;
	this.x = initX;
	this.y = initY;
	this.initialAx = Ax;
	this.initialAy = Ay;
	this.radius = 50
	this.power = .8;
	
	// draw
	this.draw = function() {
	
		// modify ball movement
		var dX = x - this.x;
		var dY = y - this.y;
		var distance = Math.sqrt(dX*dX + dY*dY);
		if (distance < this.radius) {
			Vy = Vy * this.power;
			Vx = Vx * this.power;
		}
		
		var opacity = .6 - (newTime - this.startTime)/this.timeLimit * .5;

		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.fillStyle = 'rgba(0,100,0,'+opacity+')';
		//ctx.strokeStyle = 'rgba(0,0,0,'+this.opacity/2+')';
		ctx.lineWidth = 5;
		//ctx.stroke();
		ctx.fill();
		ctx.restore();
	}
}

function Magnet(initX, initY) {
	this.startTime = new Date().getTime();
	this.timeLimit = 300;
	this.x = initX;
	this.y = initY;
	var dX = x - mouseX;
	var dY = y - mouseY;
	var distance = Math.sqrt(dX*dX + dY*dY);	
	
	// modify ball movement
	Vy = Vy - (powerFactor/distance) * (dY/distance);
	Vx = Vx - (powerFactor/distance) * (dX/distance);
	
	// draw
	this.draw = function() {
		var radius = 1.2 * (this.startTime + this.timeLimit - newTime);
		var opacity = 1 - ( .75 * Math.atan(.01*radius) );
	
		if(radius > 0) {
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
			ctx.fillStyle = 'rgba(0,0,255,'+opacity+')';
			ctx.strokeStyle = 'rgba(0,0,0,'+opacity/2+')';
			ctx.lineWidth = 5;
			//ctx.stroke();
			ctx.fill();
			ctx.restore();
		}
	}
}

function SlowMagnet(initX, initY) {
	this.startTime = new Date().getTime();
	this.timeLimit = 1500;
	this.power = powerFactor * .0005;
	this.x = initX;
	this.y = initY;
	this.initialAx = Ax;
	this.initialAy = Ay;
	
	// draw
	this.draw = function() {
		//var radius = .4 * (this.startTime + this.timeLimit - newTime);
		//var opacity = 1 - ( .75 * Math.atan(.01*radius) );
		var radius = 5;
		var opacity = .7;
	
		if(newTime - this.startTime < this.timeLimit - 10) {
			// modify ball movement
			var dX = x - mouseX;
			var dY = y - mouseY;
			var distance = Math.sqrt(dX*dX + dY*dY);
		
			Ay = Ay - (this.power/distance) * (dY/distance);
			Ax = Ax - (this.power/distance) * (dX/distance);
		
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
			ctx.fillStyle = 'rgba(0,0,0,'+opacity+')';
			ctx.strokeStyle = 'rgba(0,0,0,'+opacity/2+')';
			ctx.lineWidth = 5;
			//ctx.stroke();
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowColor = 'rgba(0,0,0,1)';
			ctx.shadowBlur = 100;
			ctx.fill();
			ctx.restore();
		} else {
			Ax = this.initialAx;
			Ay = this.initialAy;
		}
	}
}

function keyDown(e) {
	if(mouseX && mouseY) {
		if(e.keyCode == 49) {
			powerArray.push(new Explosion(mouseX, mouseY));
		} else if(e.keyCode == 50) {
			powerArray.push(new Magnet(mouseX, mouseY));
		} else if(e.keyCode == 51) {
			powerArray.push(new SlowMagnet(mouseX, mouseY));
		}	 else if(e.keyCode == 52) {
				powerArray.push(new StickyPatch(mouseX, mouseY));
		}
	}
	//e.preventDefault();
}

function draw() {	
	
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	
	// new time
	newTime = new Date().getTime();
	
	// clear canvas
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	
	// draw powers
	var newPowerArray = [];
	while(power = powerArray.pop())
	{
		power.draw();
		
		if(newTime - power.startTime < power.timeLimit)
			newPowerArray.push(power);
	}
	powerArray = newPowerArray;
	
	// draw ball
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	
	// draw cursor
	/*if(typeof mouseX != 'undefined') {
		ctx.beginPath();
		ctx.arc(mouseX, mouseY, 2, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.stroke();
	}*/

	// increment stuff
	elapsed = newTime - lastTime;
	Vx = Ax * elapsed + Vx;
	x = x + Vx * elapsed;
	Vy = Vy + Ay * elapsed;
	y = y + Vy * elapsed;

	// don't let it get out of bounds
	if (y > (canvasHeight - ballRadius)) y = canvasHeight - ballRadius; // bottom
	if (y < (0 + ballRadius)) y = ballRadius; // top
	if (x < (0 + ballRadius)) x = ballRadius; // left
	if (x > (canvasWidth - ballRadius)) x = canvasWidth - ballRadius; // right

	// calculate bounces
	if ((y == (canvasHeight - ballRadius) && Vy > 0) || (y == ballRadius && Vy < 0)) {
		Vy = -(Vy) * COF;
		Vx = Vx * rollingCOF;
	}
	if ((x == ballRadius && Vx < 0) || (x == (canvasWidth - ballRadius) && Vx > 0)) {
		Vx = -(Vx) * COF;
		Vy = Vy * rollingCOF;
	}
	
	// info
	//xDisplay.value = Math.floor(x);
	//yDisplay.value = Math.floor(y);
	
	lastTime = new Date().getTime();
}

window.addEventListener('load', function() {
	
	on = true;
	speedMultiplier = 1;
	x = 10;
	y = 10;
	Vx = .1;
	Vy = 0;
	Ax = 0;
	Ay = .0015 * speedMultiplier;
	//Ay = .00005;
	COF = .95;
	rollingCOF = .98;
	powerFactor = 10 * speedMultiplier;
	//powerFactor = 10;
	ballRadius = 15;
	powerArray = [];
	level = 1;

	clickX = false;
	clickY = false;
	canvasElement = document.getElementById('canvas');
	//canvasElement.onselectstart = function () { return false; }
	canvasElement.addEventListener('mousedown', canvasClick, false);
	canvasElement.addEventListener('mousemove', mouseMove, false);
	//canvasElement.addEventListener('mouseout', function(){if(on)startStop();}, false);
	//canvasElement.addEventListener('mouseover', function(){if(!on)startStop();}, false);
	document.addEventListener('keydown', keyDown, false);
	ctx = canvasElement.getContext("2d");
	xDisplay = document.getElementById('x');
	yDisplay = document.getElementById('y');
	lastTime = new Date().getTime();

	runLoop = setInterval(draw, 33);

}, false);
