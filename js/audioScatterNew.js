//var audioScatterSVGGroup;

function loadSVGInAudioScatter(){
	let bubbleChartDiv = document.getElementById("audioFeaturesScatterDiv");

	bubbleChartDivHeight = bubbleChartDiv.offsetHeight; 
	bubbleChartDivWidth = bubbleChartDiv.offsetWidth;

    let bubbleChartSVG = d3.select('#audioFeaturesScatterDiv')
    				.append("svg")
					.attr("height", 0.65* bubbleChartDivHeight)
    				.attr("width", 0.9*bubbleChartDivWidth)
    				.attr("id", "audioSVG");

    //console.log(bubbleChartSVG);

    //let bubbleSVG = d3.select('#audioFeaturesScatterDiv').selectAll('svg')
	
	let audioScatterSVGGroup = bubbleChartSVG.append('g')
											.attr("id", "audioScatterMainGroup");
}


function updateKeyForAudioScatter(){
	updateAudioScatter(globalDataForAudioScatter);
}
function updateAudioScatter(hmap){
	//console.log("Updating scatter");

	var audioSVG = d3.select("#audioSVG");
	var audioSVGGroup = d3.select("#audioScatterMainGroup");

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

	var dataList = []; 
	var uniqueVals = [];

	for(var item in hmap){
		obj = hmap[item];
		if(!(obj['trackKey'] in uniqueVals)){
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
				uniqueVals.push(obj['trackKey']);
			}
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
    
    //Adding the X - axis 
	var xAxis = d3.axisBottom()
                .scale(xScale).ticks(5);

     var yAxis = d3.axisLeft()
				.scale(yScale)

    let audioSVGDOM = document.getElementById("audioSVG");
    if(audioSVGDOM.firstChild.firstChild==null){

    	audioSVG.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(0," + (svgHeight - yPadding) + ")")
	    .attr("id", "audioScatterXAxis")
	    .call(xAxis); 

	    //Adding the X - label  -- add margin.bottom to svgheight
	    audioSVG.append("text")
	    	.attr("class", "axisLabelText")      
	        .attr("transform", "translate(" + (svgWidth / 2) + " ," + (svgHeight) + ")")
	        .style("text-anchor", "middle")
	        .attr("id", "audioScatterXAxisLabel")
	        .text(xScaleSelectedFeatureText); 
	    
	    //Adding the Y - axis
	    
	                 
	    audioSVG.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + xPadding + ",0)")
	    .attr("id", "audioScatterYAxis")
	    .call(yAxis);

	    //Adding Y - label - Change 5 to margin.left
	    audioSVG.append("text")
	    	.attr("class", "axisLabelText")
	        .attr("transform", "rotate(-90)")
	        .attr("y",0)
	        .attr("x",0 - (svgHeight / 2))
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .text("Weeks On Charts");
    }
    else{
    	d3.select("#audioScatterXAxisLabel").text(xScaleSelectedFeatureText);
    	d3.select("#audioScatterXAxis").call(xAxis);

    	d3.select("#audioScatterYAxis").call(yAxis);
    }


	let colorValues = ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"]
	//let colorValues = ["#fc8d59"];
	let opacityValues = [0.16, 2*0.16, 3*0.16, 4*0.16, 5*0.16];

	if(colorScaleSelectedFeatureText !="None"){
		var colorScale = d3.scaleQuantize()
						.range(colorValues)
						.domain([d3.min(colorScaleValues), d3.max(colorScaleValues)]);

		var opacityColorScale = d3.scaleQuantize()
								.range(opacityValues)
								.domain([d3.min(colorScaleValues), d3.max(colorScaleValues)]);
	}

	circles.enter().append("circle")
				//.transition()
				//.duration(300)
				.attr("id", function(d){
					//console.log(d['trackKey']);
					return "songCircle_"+d['trackKey'];
				})
				.classed("songCircleDefault", true)
				.classed("audioScatterSongClicked", function(d){
					if(globalClickedSongs[d['trackKey']]==1){
						return true;
					}
					else
					{
						return false;
					}
				})
				.style("fill", function(d){
						if(colorScaleSelectedFeatureText !="None"){
						return colorScale(d[colorScaleSelectedFeature]);
						//return colorValues[0];
					}
					else{
						//return "orange";
						return colorValues[2]; //return median color
					}
				})
				.style("opacity", function(d){
					if(colorScaleSelectedFeatureText!="None"){
						//return opacityColorScale(d[colorScaleSelectedFeature])
						return 0.9
					}
					else{
						return 0.9;
					}
				})
				//.transition()
				.attr("cx", function(d){return xScale(d[xScaleSelectedFeature]);})
				.attr("cy", function(d){return yScale(d['weeksOnCharts']);})
				.attr("r", 3)
				.on("mouseover", function(d){

					//d3.select(this).style("fill", "steelblue");
					$(this).addClass("songCircleHovered")

					d3.select(this).attr("r", 4);

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


               		let correspondingLine = document.getElementById("lineChart_"+d.trackKey);
               		if(correspondingLine!=null){
	               		correspondingLine.classList.add("lineChartLineHover");

               		}

               		let otherCountriesMap = d['otherCountriesWeekCount'];
               		for(var countryCodeLocal in otherCountriesMap){
               			if(otherCountriesMap.hasOwnProperty(countryCodeLocal)){
               				if(otherCountriesMap[countryCodeLocal]<d['weeksOnCharts']){
               					//console.log(countryCodeLocal, "False");
               					$("#"+countryCodeLocal).addClass("countryWithRelativeLower");
               				}
               				else if(otherCountriesMap[countryCodeLocal]>d['weeksOnCharts'])
               				{
               					//console.log(countryCodeLocal, "True");
               					$("#"+countryCodeLocal).addClass("countryWithRelativeHigher");
               				}
               				else if(otherCountriesMap[countryCodeLocal]==d['weeksOnCharts'])
               				{
               					$("#"+countryCodeLocal).addClass("countryWithRelativeEqual");

               				}
               			}
               		}

               		$("#scatterplot_hover_legend").css("height",75);
               		//$("#scatterplot_hover_legend").fadeIn("slow");
               		
				})
				.on("mouseout", function(d){

					$(this).removeClass("songCircleHovered");

					d3.select(this).attr("r", 3);

					tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);

	                let correspondingLine = document.getElementById("lineChart_"+d.trackKey);
               		if(correspondingLine!=null){
               			correspondingLine.classList.remove("lineChartLineHover");
           			}

           			let otherCountriesMap = d['otherCountriesWeekCount'];
               		for(var countryCodeLocal in otherCountriesMap){
               			if(otherCountriesMap.hasOwnProperty(countryCodeLocal)){
               				$("#"+countryCodeLocal).removeClass("countryWithRelativeLower")
               				$("#"+countryCodeLocal).removeClass("countryWithRelativeHigher")
               				$("#"+countryCodeLocal).removeClass("countryWithRelativeEqual")

               				//if($())
               				/*if(otherCountriesMap[countryCodeLocal]<d['weeksOnCharts']){
               					//console.log(countryCodeLocal, "False");
               					$("#"+countryCodeLocal).addClass("countryWithRelativeLower");
               				}
               				else if(otherCountriesMap[countryCodeLocal]>d['weeksOnCharts'])
               				{
               					//console.log(countryCodeLocal, "True");
               					$("#"+countryCodeLocal).addClass("countryWithRelativeHigher");
               				}
               				else{
               					$("#"+countryCodeLocal).addClass("countryWithRelativeEqual");

               				}*/
               			}
               		}

               		$("#scatterplot_hover_legend").css("height",0);
               		//$("#scatterplot_hover_legend").fadeOut(2000);
               		//$("#scatterplot_hover_legend").css("height", 0);
               		//console.log($("#scatterplot_hover_legend").style);
				})
				.on("click", function(d, i){
					//console.log("clicked");
					//d3.select(this).style("fill", "steelblue")
					//d3.select(this).style("stroke", "black")
					d3.select(this).attr("class", "audioScatterSongClicked")
					globalClickedSongs[d.trackKey] = 1;
					//console.log(globalClickedSongs);
					if(selectedCircles.indexOf(d)==-1){
						selectedCircles.push(d);
						updateLineChart(selectedCircles);
					}
					//console.log(selectedCircles);
				});

	circles.exit().remove()

}