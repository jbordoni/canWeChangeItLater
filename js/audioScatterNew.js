//var audioScatterSVGGroup;

function loadSVGInAudioScatter(){
	let bubbleChartDiv = document.getElementById("audioFeaturesScatterDiv");

	bubbleChartDivHeight = bubbleChartDiv.offsetHeight; 
	bubbleChartDivWidth = bubbleChartDiv.offsetWidth;

    let bubbleChartSVG = d3.select('#audioFeaturesScatterDiv')
    				.append("svg")
					.attr("height", bubbleChartDivHeight)
    				.attr("width", bubbleChartDivWidth)
    				.attr("id", "audioSVG");

    //console.log(bubbleChartSVG);

    //let bubbleSVG = d3.select('#audioFeaturesScatterDiv').selectAll('svg')
	
	let audioScatterSVGGroup = bubbleChartSVG.append('g');
}


function updateKeyForAudioScatter(){
	updateAudioScatter(globalDataForAudioScatter);
}
function updateAudioScatter(hmap){
	//console.log("Updating scatter");

	var audioSVG = d3.select("#audioSVG");
	var audioSVGGroup = audioSVG.selectAll("g");

	var weekValues = []; 
	var xScaleValues = []; 
	var colorScaleValues = [];

	let selectedNodeX = d3.select("#xdropdownScatter").node()
	let selectedNodeXIndex = selectedNodeX.selectedIndex;
	//console.log(selectedNodeXIndex);

	let xScaleSelectedFeature = selectedNodeX[selectedNodeXIndex].value; 
	let xScaleSelectedFeatureText = selectedNodeX[selectedNodeXIndex].innerHTML; 

	let selectedNodeColor = d3.select("#colordropdownScatter").node()
	let selectedNodeColorIndex = selectedNodeColor.selectedIndex;
	//console.log(selectedNodeXIndex);

	let colorScaleSelectedFeature = selectedNodeColor[selectedNodeColorIndex].value; 
	let colorScaleSelectedFeatureText = selectedNodeColor[selectedNodeColorIndex].innerHTML; 

	//console.log(xScaleSelectedFeature, xScaleSelectedFeatureText);

	//var xScaleSelectedFeature = document.getElementById("xdropdownScatter").value;
	//var xScaleSelectedFeatureText = document.getElementById("xdropdownScatter").selectedIndex.innerHTML;

	//var colorScaleSelectedFeature = document.getElementById("colordropdownScatter").value; 
	//var colorScaleSelectedFeatureText = document.getElementById("colordropdownScatter").selectedIndex.innerHTML;
	//console.log(colorScaleSelectedFeature);

	var dataList = []; 

	for(var item in hmap){
		obj = hmap[item];
		if(obj['weeksOnCharts']!=undefined && obj['weeksOnCharts']!=null &&
			obj[xScaleSelectedFeature]!=undefined && obj[xScaleSelectedFeature]!=null){
			weekValues.push(obj['weeksOnCharts'])
			xScaleValues.push(obj[xScaleSelectedFeature]);
			if(colorScaleSelectedFeature!="none"){
				if(obj[colorScaleSelectedFeature]!=undefined && obj[colorScaleSelectedFeature]!=null){
					colorScaleValues.push(obj[colorScaleSelectedFeature])
				}
			}
			dataList.push(obj);
		}
		
	}

	var circles = audioSVGGroup.selectAll("circle")
					.data(dataList, function(d) { return d ; })


	//let svgWidth = document.getElementById("audioSVG").offsetWidth; 
	//let svgHeight = document.getElementById("audioSVG").offsetHeight; 

	let svgWidth = $("#audioSVG").width();
	let svgHeight = $("#audioSVG").height(); 

	let xPadding = 0.1*svgWidth; 
	let yPadding = 0.1*svgHeight; 

	let selectedCircles = [];

	var xScale = d3.scaleLinear();
		xScale.domain([d3.min(xScaleValues), d3.max(xScaleValues)])
				.range([0+xPadding, svgWidth-xPadding]);

	var yScale = d3.scaleLinear()
					.domain([d3.min(weekValues), d3.max(weekValues)])
					.range([svgHeight-(yPadding), 0+yPadding]);

	let colorValues = ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"]

	if(colorScaleSelectedFeatureText !="None"){
		var colorScale = d3.scaleQuantize()
						.range(colorValues)
						.domain([d3.min(colorScaleValues), d3.max(colorScaleValues)]);
	

	}

	circles.enter().append("circle")
				//.transition()
				//.duration(300)
				.style("fill", function(d){
						if(colorScaleSelectedFeatureText !="None"){
						return colorScale(d[colorScaleSelectedFeature]);
					}
					else{
						//return "orange";
						return colorValues[2]; //return median color
					}
				})
				.attr("cx", function(d){return xScale(d[xScaleSelectedFeature]);})
				.attr("cy", function(d){return yScale(d['weeksOnCharts']);})
				.attr("r", 5)
				.on("click", function(d, i){
					//console.log("clicked");
					//d3.select(this).style("fill", "steelblue")
					d3.select(this).style("stroke", "black")
					selectedCircles.push(d);
					updateLineChart(selectedCircles);
					//console.log(selectedCircles);
				});

	circles.exit().remove()

}