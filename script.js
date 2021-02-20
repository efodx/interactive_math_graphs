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
}

class Point{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}


//Coordinate System with elements.
class CoordinateSystem {
	constructor(canvas){
		this.canvas = canvas;

		this.scaleFont = "12px Arial";

		this.center = {x: canvas.width/2, y:canvas.height/2};

		this.lineSegments = [];
		this.lines = [];
		this.points = [];
		this.functions = [];

		this.xScale = 40;
		this.yScale = 40;

		this.mousePressed = false;
		this.mousePanStartX = 0;
		this.mousePanStartY = 0;

		var self = this;
		this.canvas.addEventListener("mousedown",
			function(e) {
    			self.drawPointOnClick(e)});
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

	drawPointOnClick(e) {
		const rect = e.target.getBoundingClientRect()
   		const x = e.clientX - rect.left
    	const y = e.clientY - rect.top
    	//this.addPoint((x-this.center.x)/this.xScale, -(y-this.center.y)/this.yScale)

    	//var segment = self.lineSegments[0];
    	//segment.setEndPoint((x-self.center.x)/self.xScale,-(y-self.center.y)/self.yScale)
    	//this.draw();

    	this.mousePressed = true;
    	this.mousePanStartX = x;
    	this.mousePanStartY = y;
	}

	zoom(e){
		e.preventDefault();
		this.xScale += -e.deltaY * 0.5;
		this.yScale += -e.deltaY * 0.5; // if i create getters and setters for this class i can have max/min checks there
		this.draw();
	}

	pan(e){
		if(this.mousePressed){
			const rect = e.target.getBoundingClientRect()
   			const x = e.clientX - rect.left
    		const y = e.clientY - rect.top
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
		ctx.moveTo(0,  this.center.y);
		ctx.lineTo(canvas.width, this.center.y);
		ctx.closePath();
		ctx.stroke();
	}

	drawScale(){
		const canvas = this.canvas;
		const ctx = this.canvas.getContext('2d');
		//left
		var x = this.center.x-this.xScale;
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
		const canvas = this.canvas;
		const ctx = this.canvas.getContext('2d');
		step = 5;
		ctx.beginPath();
		var notStarted = true;
		for(i = 0; i < this.canvas.width; i+=step){
			x = (i-this.center.x)/this.xScale;
			y = -fx(x); // canvas is upside down
			j = y*this.yScale + this.center.y;
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
		var y1 = -lineSegment.y1;
		var y2 = -lineSegment.y2;
		var x1 = lineSegment.x1;
		var x2 = lineSegment.x2;

		x1*=this.xScale
		x1+=this.center.x

		y1*=this.yScale
		y1+=this.center.y

		x2*=this.xScale
		x2+=this.center.x

		y2*=this.yScale
		y2+=this.center.y

		const ctx = this.canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.closePath();
		ctx.stroke();
	}

	drawLine(line){
		var n = this.yScale*line.n - this.center.y;
		var k = line.k*this.yScale/this.xScale;


		const ctx = this.canvas.getContext('2d');
		ctx.beginPath();
		var h = this.canvas.width - this.center.x;
		ctx.moveTo(this.canvas.width, -(n + k*h));

		var h = -this.center.x;
		ctx.lineTo(0, -(n + k*h));
		ctx.closePath();
		ctx.stroke();
	}

	drawPoint(point) {
		const ctx = this.canvas.getContext('2d');
		var x = this.center.x + point.x*this.xScale;
		var y = this.center.y + -point.y*this.yScale;
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
		this.lines.push(new Line(k,n));
	}

	addPoint(x,y){
		this.points.push(new Point(x,y));
	}

	addFunction(fx){
		this.functions.push(fx)
	}

	addLineThroughPoints(x1,y1,x2,y2){
		var k = (y2-y1)/(x2-x1);
		var n = y1-k*x1;
		this.points.push(new Point(x1,y1));
		this.points.push(new Point(x2,y2));
		this.lines.push(new Line(k,n));
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

var h = 0.2;
var fx = (x=> Math.sin(x))
var x = 1;
var chartuu;

function setH(val){
	h = val/100;
	chartuu.points.pop();
	chartuu.points.pop();
	chartuu.lines.pop();
	chartuu.addLineThroughPoints(x,fx(x), x+h,fx(x+h));
	chartuu.draw();
}

function setX(val){
	x = val-chartuu.center.x;
	x = x/chartuu.xScale;
	chartuu.points.pop();
	chartuu.points.pop();
	chartuu.lines.pop();
	chartuu.addLineThroughPoints(x,fx(x), x+h,fx(x+h));
	chartuu.draw();
}

function initial(canvas){
	chartuu = new CoordinateSystem(canvas);
	//chartuu.addLineSegmentWithEndpoints(-3,-3,5,3);
	//chartuu.addLineSegment(-6,-3,1,4);
	//chartuu.addLine(2,-2);
	//chartuu.addPoint(2,1);
	chartuu.addFunction(fx)
	chartuu.addLineThroughPoints(x,fx(x), x+h,fx(x+h));
	chartuu.draw();
	setH(100);
}

