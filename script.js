class LineSegment{
	constructor(x1,y1,x2,y2) {
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
	}

	setStartPoint(x1,y1){
		this.x1 = x1;
		this.y1 = y1;
	}

	setEndPoint(x2,y2){
		this.x2 = x2;
		this.y2 = y2;
	}
}

class Line {
	constructor(k,n){
		this.k = k;
		this.n = n;
	}

	setK(k){
		this.k = k;
	}

	setN(n){
		this.n=n;
	}
}

class Point{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}

	setX(x){
		this.x=x;
	}

	setY(y){
		this.y=y;
	}
}

//Coordinate System with elements.
class CoordinateSystem {
	constructor(canvas){
		this.canvas = canvas;

		this.scaleFont = "12px Arial";
		this.minScale = 20;

		this.center = {x: canvas.width/2, y:canvas.height/2};

		this.lineSegments = [];
		this.lines = [];
		this.points = [];
		this.functions = [];

		this.xScale = 80;
		this.yScale = 80;

		this.mousePressed = false;
		this.mousePanStartX = 0;
		this.mousePanStartY = 0;
		this.pannable = true;

		var self = this;
		this.canvas.addEventListener("mousedown",
			function(e) {
    			self.startPanning(e)});
		this.canvas.addEventListener("mouseup",
			function(e) {
    			self.mousePressed = false;});
		this.canvas.addEventListener("wheel",
			function(e) {
    			self.zoom(e)});
		this.canvas.addEventListener("mousemove",
			function(e) {
    			self.pan(e)});
	}

	convertCanvasXToCoordinateX(canvasX){
		return (canvasX - this.center.x)/this.xScale;
	}

	convertCanvasYToCoordinateY(canvasY){
		return -(canvasY - this.center.y)/this.yScale;
	}

	convertCoordinateXToCanvasX(x){
		return x * this.xScale + this.center.x;
	}

	convertCoordinateYToCanvasY(y){
		return -y * this.yScale + this.center.y;
	}

	startPanning(e) {
		const rect = e.target.getBoundingClientRect();
   		const x = e.clientX - rect.left;
    	const y = e.clientY - rect.top;
    	this.mousePressed = true;
    	this.mousePanStartX = x;
    	this.mousePanStartY = y;
	}

	setPannable(boolean){
		this.pannable = boolean;
	}

	zoom(e){
		e.preventDefault();
		this.xScale = Math.max(this.xScale-e.deltaY * 0.5, this.minScale);
		this.yScale = Math.max(this.yScale-e.deltaY * 0.5, this.minScale);
		this.draw();
	}

	pan(e){
		if(this.mousePressed && this.pannable){
			const rect = e.target.getBoundingClientRect();
   			const x = e.clientX - rect.left;
    		const y = e.clientY - rect.top;
    		var xdelta = x - this.mousePanStartX;
    		var ydelta = y - this.mousePanStartY;
			this.center.x +=xdelta;
			this.mousePanStartX += xdelta;
			this.center.y +=ydelta;
			this.mousePanStartY += ydelta;
			this.draw();
		}
	}

	drawBorder(){
		const canvas = this.canvas;
		const ctx = this.canvas.getContext('2d');
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(canvas.width, 0);
		ctx.lineTo(canvas.width, canvas.height);
		ctx.lineTo(0, canvas.height);
		ctx.closePath();
		ctx.stroke();
	}

	drawAxis(){
		const canvas = this.canvas;
		const ctx = canvas.getContext('2d');
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.center.x, 0);
		ctx.lineTo(this.center.x, canvas.height);
		ctx.moveTo(0, this.center.y);
		ctx.lineTo(canvas.width, this.center.y);
		ctx.closePath();
		ctx.stroke();
	}

	drawScale(){
		const canvas = this.canvas;
		const ctx = this.canvas.getContext('2d');
		//left
		var x = this.center.x - this.xScale;
		var c = 1;
		while(x > 0){
			ctx.beginPath();
			ctx.moveTo(x, this.center.y+5);
			ctx.lineTo(x,  this.center.y-5);
			ctx.font = this.scaleFont;
			ctx.fillText(-c, x - 8, this.center.y+20);
			ctx.closePath();
			ctx.stroke();
			x-=this.xScale;
			c+=1;
		}
		c = 1;
		var x = this.center.x + this.xScale;
		while(x < canvas.width){
			ctx.beginPath();
			ctx.moveTo(x, this.center.y+5);
			ctx.lineTo(x, this.center.y-5);
			ctx.font = this.scaleFont;
			ctx.fillText(c, x -4, this.center.y+20);
			ctx.closePath();
			ctx.stroke();
			c+=1;
			x+=this.xScale;
		}
		c = 1;
		var y = this.center.y-this.yScale;
		while(y > 0){
			ctx.beginPath();
			ctx.moveTo(this.center.x+5, y);
			ctx.lineTo(this.center.x-5, y);
			ctx.font = this.scaleFont;
			ctx.fillText(c, this.center.x + 8, y+4);
			ctx.closePath();
			ctx.stroke();
			c+=1;
			y-=this.yScale;
		}
		c = 1;
		var y = this.center.y + this.yScale;
		while(y < canvas.height){
			ctx.beginPath();
			ctx.moveTo(this.center.x+5, y);
			ctx.lineTo(this.center.x-5, y);
			ctx.font = this.scaleFont;
			ctx.fillText(-c, this.center.x + 8, y+4);
			ctx.closePath();
			ctx.stroke();
			c+=1;
			y+=this.yScale;
		}
	}

	drawFunction(fx) {
		var x,y,i,j,step;
		const ctx = this.canvas.getContext('2d');
		step = 5;
		ctx.beginPath();
		var notStarted = true;
		for(i = 0; i < this.canvas.width; i+=step){
			x = this.convertCanvasXToCoordinateX(i);
			y = fx(x);
			j = this.convertCoordinateYToCanvasY(y);
			if(notStarted){
				ctx.moveTo(i,j);
				notStarted = false;
			}
			else{
				ctx.lineTo(i,j)
			}
		};
		ctx.stroke();
	}

	drawLineSegment(lineSegment){
		var x1 = this.convertCoordinateXToCanvasX(lineSegment.x1);
		var y1 = this.convertCoordinateYToCanvasY(lineSegment.y1);

		var x2 = this.convertCoordinateXToCanvasX(lineSegment.x2);
		var y2 = this.convertCoordinateYToCanvasY(lineSegment.y2);

		const ctx = this.canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.closePath();
		ctx.stroke();
	}

	drawLine(line){
		var x1 = this.convertCanvasXToCoordinateX(this.canvas.width);
		var x2 = this.convertCanvasXToCoordinateX(0);

		var y1 = line.k*x1 + line.n;
		var y2 = line.k*x2 + line.n;

		const ctx = this.canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(this.canvas.width, this.convertCoordinateYToCanvasY(y1));
		ctx.lineTo(0, this.convertCoordinateYToCanvasY(y2));
		ctx.closePath();
		ctx.stroke();
	}

	drawPoint(point) {
		const ctx = this.canvas.getContext('2d');
		var x = this.convertCoordinateXToCanvasX(point.x);
		var y = this.convertCoordinateYToCanvasY(point.y);
		var b4 = ctx.strokeStyle;
		ctx.beginPath();
		ctx.strokeStyle = "#FF0000";
  		ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
  		ctx.stroke();
		ctx.strokeStyle = b4;
	}

	addLineSegment(x1,y1,x2,y2){
		this.lineSegments.push(new LineSegment(x1,y1,x2,y2));
	}

	addLineSegmentWithEndpoints(x1,y1,x2,y2) {
		this.addLineSegment(x1,y1,x2,y2);
		this.addPoint(x1,y1);
		this.addPoint(x2,y2);
	}

	addLine(k,n){
		var line = new Line(k,n);
		this.lines.push(line);
		return line;
	}

	addPoint(x,y){
		var point = new Point(x,y);
		this.points.push(point);
		return point;
	}

	addFunction(fx){
		this.functions.push(fx)
		return fx;
	}

	addLineThroughPoints(x1,y1,x2,y2){
		var k = (y2-y1)/(x2-x1);
		var n = y1-k*x1;
		var line = new Line(k,n);
		this.lines.push(line);
		return line;
	}

	draw(){
		this.clear();
    	this.drawBorder();
    	this.drawAxis();
    	this.drawScale();
		this.lineSegments.forEach(lineSegment => this.drawLineSegment(lineSegment));
		this.lines.forEach(line => this.drawLine(line));
		this.points.forEach(point => this.drawPoint(point));
		this.functions.forEach(fx => this.drawFunction(fx));
	}

	clear(){
		var ctx = this.canvas.getContext("2d");
    	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

class DerivativesGraph {
	constructor(canvas){
		this.coordinateSystem = new CoordinateSystem(canvas);
		this.x = 1;
		this.h = 0.2;
		this.fx = (x => Math.sin(x));

		var x1 = this.x;
		var x2 = this.x + this.h;
		var y1 = this.fx(x1);
		var y2 = this.fx(x2);

		this.line = this.coordinateSystem.addLineThroughPoints(x1,y1,x2,y2);
		this.startPoint = this.coordinateSystem.addPoint(x1,y1);
		this.movablePoint = new MovablePoint(this.coordinateSystem, this.startPoint);

		var self = this;
		this.movablePoint.addCallBack((point => self.setX(point.x)));

		this.endPoint = this.coordinateSystem.addPoint(x2,y2);
		this.fn = this.coordinateSystem.addFunction(this.fx)

		this.coordinateSystem.setPannable(false);
		this.coordinateSystem.draw();
	}

	setH(val){
		this.h = val
		this.draw();
	}

	setX(val){
		this.x = val;
		this.draw();
	}

	draw(){
		var x1 = this.x;
		var x2 = this.x + this.h;
		var y1 = this.fx(x1);
		var y2 = this.fx(x2);

		this.startPoint.setX(x1);
		this.startPoint.setY(y1);

		this.endPoint.setX(x2);
		this.endPoint.setY(y2);

		var k = (y2-y1)/(x2-x1);
		var n = y1-k*x1;

		this.line.setK(k);
		this.line.setN(n);

		this.coordinateSystem.draw();
	}
}

class MovablePoint{
	constructor(coordinateSystem, point){
		this.coordinateSystem = coordinateSystem;
		this.point = point;

		this.mousePressed = false;
		this.pointSelected = false;
		this.moving = false;

		this.callBacks = [];
		
		var self = this;
		this.coordinateSystem.canvas.addEventListener("mousedown",
			function(e) {
    			self.mousePress(e)});
		this.coordinateSystem.canvas.addEventListener("mouseup",
			function(e) {
    			self.mousePressed = false;
    			self.moving = false;});
		this.coordinateSystem.canvas.addEventListener("mousemove",
			function(e) {
    			self.mouseMove(e)});
	}

	distance(x,y){ // x and y are canvas coordinates
		var canvasX = this.coordinateSystem.convertCoordinateXToCanvasX(this.point.x);
		var canvasY = this.coordinateSystem.convertCoordinateYToCanvasY(this.point.y);
		return Math.sqrt((x-canvasX)**2 + (y-canvasY)**2);
	}

	mousePress(e){
    	this.mousePressed = true;
		const rect = e.target.getBoundingClientRect();
   		const x = e.clientX - rect.left;
    	const y = e.clientY - rect.top;
		if(this.distance(x,y) < 20){
    		this.moving = true;
		}
	}

	mouseMove(e){
		if(this.moving){
			const rect = e.target.getBoundingClientRect();
   			const x = e.clientX - rect.left;
    		const y = e.clientY - rect.top;

    		this.point.setX(this.coordinateSystem.convertCanvasXToCoordinateX(x));
    		this.point.setY(this.coordinateSystem.convertCanvasYToCoordinateY(y));

    		this.update();
		}
	}

	addCallBack(callBack){
		this.callBacks.push(callBack);
	}

	update(){
		this.callBacks.forEach(callback => callback(this.point)); // point has moved callback
	}
}


var graph;

function setH(val){
	val = val/100;
	graph.setH(val);
}

function setX(val){
	graph.setX(val);
}

function initializeDerivativesGraph(canvas){
	 graph = new DerivativesGraph(canvas);
}
