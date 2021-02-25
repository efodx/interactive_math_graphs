import {DerivativesGraph} from './derivatives-graph.js';

var graph;

function initializeDerivativesGraph(canvas){
	 graph = new DerivativesGraph(canvas);
}

const newDiv = document.createElement("div");
document.body.appendChild(newDiv);
var x = document.createElement("canvas"); 
var range = document.createElement("input");
range.setAttribute("type", "range");
range.setAttribute("value", 1);
range.setAttribute("min", 0.01);
range.setAttribute("max", 2);
range.setAttribute("step", 0.01);
range.addEventListener('input', function () {graph.setH(Number(range.value))})

x.width = 1300
x.height = 800
newDiv.appendChild(x)
newDiv.append(range)
initializeDerivativesGraph(x);

var h_value = document.getElementById("rangevalue");
var h_range_setter = document.getElementById("h");


