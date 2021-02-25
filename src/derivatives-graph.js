import {CoordinateSystem} from './coordinate-system.js';
export {DerivativesGraph}

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
		this.h = val;
		console.log("Entering val is:" + val);
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
    			self.moving = false;
				self.coordinateSystem.canvas.style.cursor="default";});
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
		const rect = e.target.getBoundingClientRect();
   		const x = e.clientX - rect.left;
    	const y = e.clientY - rect.top;
		if(this.distance(x,y) < 20){
			this.coordinateSystem.canvas.style.cursor="w-resize";              
		}else{
			if(!this.moving){
				this.coordinateSystem.canvas.style.cursor="default";
			}
		}
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