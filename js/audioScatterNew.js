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

	var tooltip = d3.select('body').append("div")	
		    .attr("class", "scatterTooltip")				
		    .style("opacity", 0);

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
				.on("mouseover", function(d){
					tooltip.transition()
						.duration(200)
						.style("opacity", .9);

					tooltip.attr("id", "audioScatter_"+d.trackKey);

					let songTitleSpan = document.createElement("span");
					songTitleSpan.innerHTML = d.songName + "<br/>";
					songTitleSpan.classList.add("tooltipTitle");

					let artistSpan = document.createElement("span");
					artistSpan.innerHTML = d.artistName + "<br/>"; 
					artistSpan.classList.add("tooltipSubtitle");

					let value1SpanPart1 = document.createElement("span");
					value1SpanPart1.innerHTML = xScaleSelectedFeatureText + ": ";
					value1SpanPart1.classList.add("tooltipKey");

					let value1SpanPart2 = document.createElement("span");
					value1SpanPart2.innerHTML = d[xScaleSelectedFeature] + "<br/>";
					value1SpanPart2.classList.add("tooltipValue");

					let value2SpanPart1 = document.createElement("span");
					let value2SpanPart2 = document.createElement("span");

					if(colorScaleSelectedFeatureText!="None"){
						value2SpanPart1.innerHTML = colorScaleSelectedFeatureText + ": ";
						value2SpanPart1.classList.add("tooltipKey");

						value2SpanPart2.innerHTML = d[colorScaleSelectedFeature] + "<br/>";
						value2SpanPart2.classList.add("tooltipValue");
					}
					let tooltipDOM = document.getElementById("audioScatter_"+d.trackKey);

					while(tooltipDOM.firstChild){
						tooltipDOM.removeChild(tooltipDOM.firstChild);
					}

					tooltipDOM.append(songTitleSpan);
					tooltipDOM.append(artistSpan);
					tooltipDOM.append(value1SpanPart1);
					tooltipDOM.append(value1SpanPart2);
					if(colorScaleSelectedFeatureText!="None"){
						tooltipDOM.append(value2SpanPart1);
						tooltipDOM.append(value2SpanPart2);
					}

					tooltip.style("left", (d3.event.pageX + 5) + "px")
               				.style("top", (d3.event.pageY - 28) + "px");
				})
				.on("mouseout", function(d){
					tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);
				})
				.on("click", function(d, i){
					//console.log("clicked");
					//d3.select(this).style("fill", "steelblue")
					d3.select(this).style("stroke", "black")
					d3.select(this).attr("class", "clicked")
					selectedCircles.push(d);
					updateLineChart(selectedCircles);
					//console.log(selectedCircles);
				});

	circles.exit().remove()

}