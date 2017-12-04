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

	//console.log(bubbleSVG instanceof SVGElement);
	//console.log(audioScatterSVGGroup);

	//data = [[51, 20], [55, 50], [56, 90]];
	//setupScatterPlot();
	//updateScatter(data);
}

function updateAudioScatter(hmap){
	//console.log("Updating scatter");

	var audioSVG = d3.select("#audioSVG");
	var audioSVGGroup = audioSVG.selectAll("g");

	var weekValues = []; 
	var xScaleValues = []; 
	var colorScaleValues = [];

	var xScaleSelectedFeature = document.getElementById("xdropdownScatter").value;

	var dataList = []; 

	for(var item in hmap){
		obj = hmap[item];
		if(obj['weeksOnCharts']!=undefined && obj['weeksOnCharts']!=null &&
			obj[xScaleSelectedFeature]!=undefined && obj[xScaleSelectedFeature]!=null){
			weekValues.push(obj['weeksOnCharts'])
			xScaleValues.push(obj[xScaleSelectedFeature]);
			dataList.push(obj);
		}
		
	}

	var circles = audioSVGGroup.selectAll("circle")
					.data(dataList, function(d) { return d ; })


	//let svgWidth = document.getElementById("audioSVG").offsetWidth; 
	//let svgHeight = document.getElementById("audioSVG").offsetHeight; 

	let svgWidth = $("#audioSVG").width();
	let svgHeight = $("#audioSVG").height(); 

	//console.log(svgWidth, svgHeight);
	//return;

	let xPadding = 0.1*svgWidth; 
	let yPadding = 0.1*svgHeight; 

	var xScale = d3.scaleLinear();
		xScale.domain([d3.min(xScaleValues), d3.max(xScaleValues)])
				.range([0+xPadding, svgWidth-xPadding]);

	var yScale = d3.scaleLinear()
					.domain([d3.min(weekValues), d3.max(weekValues)])
					.range([svgHeight-(yPadding), 0+yPadding]);

	circles.enter().append("circle")
				//.transition()
				//.duration(300)
				.style("fill", "orange")
				.attr("cx", function(d){return xScale(d[xScaleSelectedFeature]);})
				.attr("cy", function(d){return yScale(d['weeksOnCharts']);})
				.attr("r", 5)

	circles.exit().remove()

}

function updateScatter(data){

	//let audioScatterSVGGroup = d3.select('#audioFeaturesScatterDiv').selectAll("g");
	var audioSVG = d3.select("#audioSVG");
	var audioSVGGroup = audioSVG.selectAll("g");

	var circles = audioSVGGroup.selectAll("circle")
					.data(data, function(d) { return(d); })

	//circles.style("fill", "red")

	circles.enter().append("circle")
				.transition(100)
				.style("fill", "orange")
				.attr("cx", function(d){return d[0]})
				.attr("cy", function(d){return d[1]})
				.attr("r", 5)

	circles.exit().remove()
}
