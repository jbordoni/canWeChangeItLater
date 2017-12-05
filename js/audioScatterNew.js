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

	let xPadding = 0.1*svgWidth; 
	let yPadding = 0.1*svgHeight; 

	let selectedCircles = [];

	var xScale = d3.scaleLinear();
		xScale.domain([d3.min(xScaleValues), d3.max(xScaleValues)])
				.range([0+xPadding, svgWidth-xPadding]);

	var yScale = d3.scaleLinear()
					.domain([d3.min(weekValues), d3.max(weekValues)])
					.range([svgHeight-(yPadding), 0+yPadding]);
    
    //Adding the X - axis 
	var xAxis = d3.axisBottom()
                   .scale(xScale);

    audioSVG.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (svgHeight - yPadding) + ")")
    .call(xAxis); 

    //Adding the X - label  -- add margin.bottom to svgheight
    audioSVG.append("text")      
        .attr("transform", "translate(" + (svgWidth / 2) + " ," + (svgHeight) + ")")
        .style("text-anchor", "middle")
        .text(xScaleSelectedFeature); 
    
    //Adding the Y - axis
    var yAxis = d3.axisLeft()
    				.scale(yScale)
                 
    audioSVG.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + xPadding + ",0)")
    .call(yAxis);

    //Adding Y - label - Change 5 to margin.left
    audioSVG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y",0 - 5)
        .attr("x",0 - (svgHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Weeks On Charts");



	circles.enter().append("circle")
				//.transition()
				//.duration(300)
				.style("fill", "orange")
				.attr("cx", function(d){return xScale(d[xScaleSelectedFeature]);})
				.attr("cy", function(d){return yScale(d['weeksOnCharts']);})
				.attr("r", 5)
				.on("click", function(d, i){
					//console.log("clicked");
					d3.select(this).style("fill", "steelblue")
					selectedCircles.push(d);
					updateLineChart(selectedCircles);
					//console.log(selectedCircles);
				});

	circles.exit().remove()

}