var bubbleChartSVGGroup; 
var rawdataGlobal;

function loadSVGInBubbleMap(countryValues, countryValuesList){
	let bubbleChartDiv = document.getElementById("bubbleMap");
	bubbleChartDivHeight = bubbleChartDiv.offsetHeight; 
	bubbleChartDivWidth = bubbleChartDiv.offsetWidth;

	let divPosition = bubbleChartDiv.getBoundingClientRect();

    bubbleChart = d3.select('#bubbleMap')
    			.append('svg')
    			.style("top", bubbleChartDiv.offsetTop+"px")
    			.style("left", bubbleChartDiv.offsetLeft+"px")
    			.attr("id", "bubbleMapSVG")
    			.attr("height", bubbleChartDivHeight)
    			.attr("width", bubbleChartDivWidth);
	bubbleChartSVGGroup = bubbleChart.append('g');

	d3.csv('data/bubbleMapCountryData.csv', function(error, countryLocationData){
		//console.log(countryLocationData.length);
		rawdataGlobal = countryLocationData;
		setupBubblesOnSVG(countryLocationData, countryValues, countryValuesList);
	});
}

function updateBubbleMapData(countryValues, countryValuesList){
	//console.log(countryValues);
	//console.log("Am i here?");

	var selectedFeature = document.getElementById('dropDownAudioFeatures').value;
	let nodeIdx = document.getElementById('dropDownAudioFeatures').selectedIndex;
	//console.log(nodeIdx);

	let selectedFeatureText = document.getElementById('dropDownAudioFeatures')[nodeIdx].innerHTML;
	

	let radiusScale = d3.scaleLinear()
    					.domain([d3.min(countryValuesList),d3.max(countryValuesList)])
    					.range([10, 30]);


    var linearSizeLegend = d3.scaleLinear()
						.domain([d3.min(countryValuesList),d3.max(countryValuesList)])
    					.range([10, 30]);

	var legendSize = d3.legendSize()
	.scale(linearSizeLegend)
	.cells(3)
	.shape('circle')
	.shapePadding(15)
	.labelOffset(20)
	.orient('horizontal');

	var legendOnMap = d3.select(".legendSize").call(legendSize);


    /**/
	if(document.getElementById("bubbleMapTooltipId")==null){
		var tooltip = d3.select('body').append("div")	
		    .attr("class", "bubbleMapTooltip")				
		    .style("opacity", 0)
		    .attr("id", "bubbleMapTooltipId");
	}
	else{
		var tooltip = d3.select("#bubbleMapTooltipId");
	}

	let dots = bubbleChartSVGGroup.selectAll("circle")
	.data(rawdataGlobal)

	//dots.transition()

	dots.transition().duration(500)
	.attr("r",function(d){ 
    	//console.log(d.Code);
    	//console.log(countryValues[d.Code]);
    	//console.log(radiusScale(countryValues[d.Code]));
    	return radiusScale(countryValues[d.Code]);
    })
    //.transition().duration(500);
   
    /*dots.on("mouseover", function(d){
				//console.log("Inside Mouseover");
				d3.select(this).attr('stroke',"orange")
				d3.select(this).attr("fill", "#333333")
				d3.select(this).attr("stroke-width", 3)
				tooltip.transition()
						.duration(200)
						.style("opacity", .9);
				tooltip.html("Country: " + d.Country+
							"<br/>"+selectedFeatureText+": "+(parseFloat(countryValues[d.Code]).toFixed(2)))
				.style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
               })
    .on("mouseout", function(d){
				d3.select(this).attr('stroke',"yellow");
				d3.select(this).attr("fill","#666666")
				d3.select(this).attr("stroke-width", 1)
				tooltip.transition()
               .duration(500)
               .style("opacity", 0)});*/

	dots.on("mouseover", function(d){
				//console.log("Inside Mouseover");
				if(!(this.classList.contains("clicked"))){
					$(this).addClass("bubbleHovered");
				}
				
				tooltip.transition()
						.duration(200)
						.style("opacity", .9);

				//tooltip.attr("id", "bubbleMapTooltipId");

				//let countrySpanPart1 = "Country: ";
				//countrySpanPart1.classList.add("")
				let countrySpan = document.createElement("span");
				countrySpan.innerHTML = d.Country + "<br/>"; 
				countrySpan.classList.add("tooltipTitle");
				//console.log(countrySpan);
				//console.log(tooltip);

				let subtitleSpanPart1 = document.createElement("span");
				subtitleSpanPart1.classList.add("tooltipKey");
				subtitleSpanPart1.innerHTML = "Average "+selectedFeatureText+": ";

				let subtitleSpanPart2 = document.createElement("span");
				subtitleSpanPart2.classList.add("tooltipValue");
				subtitleSpanPart2.innerHTML = parseFloat(countryValues[d.Code]).toFixed(2);

				//subtitleSpanPart1.classList.add("tooltipSubtitle");
				//subtitleSpanPart2.classList.add("tooltipSubtitle");

				let tooltipDOM = document.getElementById("bubbleMapTooltipId");

				while(tooltipDOM.firstChild){
					tooltipDOM.removeChild(tooltipDOM.firstChild);
				}

				tooltipDOM.append(countrySpan);
				tooltipDOM.append(subtitleSpanPart1);
				tooltipDOM.append(subtitleSpanPart2);

				//tooltip.html("Country: " + d.Country+
				//			"<br/>"+selectedFeatureText+": "+(parseFloat(countryValues[d.Code]).toFixed(2)))
				tooltip.style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
	})
	.on("mouseout", function(d){
			//also remove clicked from all other circles
			if(this.classList.contains("bubbleClicked")){
				//do not change stroke attributes

			}
			else{
				$(this).removeClass("bubbleHovered");
			}
			tooltip.transition()
               .duration(500)
               .style("opacity", 0);
	})
	.on('click',function(d,i){
		if(globalCurrentBubbleClickedId!=null){
			//console.log($("#"+globalCurrentBubbleClickedId).classes());
			$("#"+globalCurrentBubbleClickedId).removeClass("bubbleClicked");
			$("#"+globalCurrentBubbleClickedId).removeClass("bubbleHovered");	
		}
		$(this).addClass("bubbleClicked")
		if(!(d.Code==globalCountryCode)){
			//only call if different country is clicked
			document.getElementById("country_selected_area_actual_text").innerHTML = d.Country;
			document.getElementById("audio_features_country").innerHTML = d.Country;
			document.getElementById("charts_country").innerHTML = d.Country;
			$("#limiter_container_text").remove();
			$("#limiter_container_rect").remove();
			$("#limiter_container").remove();

			globalCurrentBubbleClickedId = this.id;
			globalCountryCode = d.Code;
			filterSongsByCountry();
		}
	});

	var legendSVG = d3.select("#legendSVG");
	while(document.getElementById("legendSVG").firstChild){
		document.getElementById("legendSVG").firstChild.remove();
	}

	legendSVG.append("g")
		.attr("id", "legendGroup")
		  .attr("class", "legendSize")
		  .attr("transform", "translate(35, 30)");
	legendSVG.append("circle")
		.attr("fill", "black")
		.attr("r", radiusScale(d3.min(countryValuesList)))
		.attr("cx", function(d, i){
			console.log(document.getElementById("svgLegendContainerId").getBoundingClientRect().left)
			console.log(radiusScale(d3.min(countryValuesList)));

			//parseInt(document.getElementById("svgLegendContainerId").getBoundingClientRect().left)
			return radiusScale(d3.min(countryValuesList)) + 20 ;
		})
		.attr("cy", function(d, i){
			return 50;
		})
	legendSVG.append("text")
			.attr("class", "legendSizeLabelText")
			.attr("transform",
	            "translate(" + (30) + " ," + 
	                           (100) + ")")
		      .style("text-anchor", "middle")
		      .text(parseFloat(d3.min(countryValuesList)).toFixed(2));

	legendSVG.append("circle")
		.attr("fill", "black")
		.attr("r", radiusScale(d3.max(countryValuesList)))
		.attr("cx", function(d, i){
			//console.log(document.getElementById("svgLegendContainerId").getBoundingClientRect().left)
			//console.log(radiusScale(d3.max(countryValuesList)));

			//parseInt(document.getElementById("svgLegendContainerId").getBoundingClientRect().left)
			return 2*radiusScale(d3.min(countryValuesList)) + 80;
		})
		.attr("cy", function(d, i){
			return 50;
		})

	legendSVG.append("text")
			.attr("class", "legendSizeLabelText")
			.attr("transform",
	            "translate(" + (5*20) + " ," + 
	                           (100) + ")")
		      .style("text-anchor", "middle")
		      .text(parseFloat(d3.max(countryValuesList)).toFixed(2));

    var legendMinUpdated
    var legendMaxUpdated
    var legendData

    if (selectedFeature == "loudness")
    {
    	legendMinUpdated = "-60 dB <br > Less Loud"
    	legendMaxUpdated = "0 dB <br > Very Loud"
    	legendData = "Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude)"

    }
    else if(selectedFeature == "energy")
    {
		legendMinUpdated = 0.1
    	legendMaxUpdated = 1.0
    	legendData ="Energy represents a perceptual measure of intensity and activity"
    }
    else if(selectedFeature == "liveness")
    {
		legendMinUpdated = 0.1
    	legendMaxUpdated = 1.0
    	legendData ="Liveness detects the presence of an audience in the recording."
    }
    else if(selectedFeature == "tempo")
    {
		legendMinUpdated = Math.round(d3.min(countryValuesList) * 100) / 100 
    	legendMaxUpdated = Math.round(d3.max(countryValuesList) * 100) / 100 
    	legendData ="Tempo represents the overall estimated tempo of a track in beats per minute (BPM)."
    }
    else if(selectedFeature == "speechiness")
    {
		legendMinUpdated = "0.1 Less speechy"
    	legendMaxUpdated = "1.0 Very speechy"
		legendData="Speechiness detects the presence of spoken words in a track."
	}
	else if(selectedFeature == "acousticness")
	{
      	legendMinUpdated = "0.1"
    	legendMaxUpdated = "1.0"
		legendData="A confidence measure of whether the track is acoustic."
	}
	else if(selectedFeature == "danceability")	
	{
		legendMinUpdated = "0.1 <br> Least Danceable"
    	legendMaxUpdated = "1.0 <br> Most Danceable"
		legendData="Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity."
	}
    	
    let minValueDOM = document.getElementById("minValue");
    let maxValueDOM = document.getElementById("maxValue");
    let legendTextDOM = document.getElementById("legendText");
    if(minValueDOM!=null){
    	minValueDOM.innerHTML=legendMinUpdated;
    }
    if(maxValueDOM!=null)
    {
    	maxValueDOM.innerHTML = legendMaxUpdated;
    }
    if(legendTextDOM!=null){
    	legendTextDOM.innerHTML = legendData;
    }
    /*document.getElementById().innerHTML = legendMinUpdated 
	document.getElementById("maxValue").innerHTML = legendMaxUpdated 
	document.getElementById("legendText").innerHTML = legendData*/

}

function setupBubblesOnSVG(rawdata, countryValues, countryValuesList){
	//console.log(countryValues);

	var selectedFeature = document.getElementById('dropDownAudioFeatures').value;
	//console.log(selectedFeature);
	let nodeIdx = document.getElementById('dropDownAudioFeatures').selectedIndex;
	//console.log(nodeIdx);

	let selectedFeatureText = document.getElementById('dropDownAudioFeatures')[nodeIdx].innerHTML;
	
	//console.log(selectedFeatureText);

	let bubbleChartDiv = document.getElementById("bubbleMap");
	let height = bubbleChartDiv.offsetHeight; 
	let width = bubbleChartDiv.offsetWidth;
	let xpadding = 0.17*height;
   	let ypadding = 0.09*width;

	let continentToDivMapping = {"na":1, "sa":1, "eu":2, "as":3, "oc":3};
    let xCoordinatesContainer = [[],[],[]];
    let yCoordinatesContainer = [[],[],[]];
    for(var i=0; i<rawdata.length; i++){
    	//console.log(rawdata[i]);
    	let continentCode = rawdata[i]['Continent'];
    	xCoordinatesContainer[continentToDivMapping[continentCode]-1].push(rawdata[i]['Y']*1000);
    	yCoordinatesContainer[continentToDivMapping[continentCode]-1].push(rawdata[i]['X']*1000);
    }
    //console.log(xCoordinatesContainer);
    //return; 

    xScales = []; 
    yScales = [[],[],[]]
    let continentDivXPadding = 30; 
    let continentDivYPadding = 10;
    for(var i=0; i<3; i++){
    	let continentDivId = "bubbleMapDiv_"+(i+1);
    	let continentDiv = document.getElementById(continentDivId);
    	let continentDivWidth = continentDiv.clientWidth;
    	//console.log(continentDivWidth);
    	let continentDivHeight = continentDiv.clientHeight;
    	let position = continentDiv.getBoundingClientRect();
    	let continentDivStartXInitial = parseInt(continentDiv.offsetLeft);
    	let continentDivStartX = continentDivStartXInitial + (i*continentDivWidth);
    	let continentDivStartY = parseInt(continentDiv.offsetTop);
    	//console.log(continentDivStartX,continentDivStartX+continentDivWidth-2*continentDivPadding)

    	//console.log("Checking div left:",continentDivStartX); 

    	if(i==2){
    		let continentXScale = d3.scaleLinear()
    						.domain([d3.min(xCoordinatesContainer[i]), d3.max(xCoordinatesContainer[i])])
    						.range([continentDivStartX+ 0.5*continentDivXPadding, 
    							continentDivStartX+continentDivWidth-7*continentDivXPadding]);
    		xScales.push(continentXScale);
    	}
    	else{
    		if(i==0){
    			xFactor = 6;
    			endFactor = -1;
    		}
    		if(i==1){
    			xFactor = 2
    			endFactor = 0;
    		}
    		let continentXScale = d3.scaleLinear()
    						.domain([d3.min(xCoordinatesContainer[i]), d3.max(xCoordinatesContainer[i])])
    						.range([continentDivStartX + xFactor*continentDivXPadding, 
    							continentDivStartX+continentDivWidth - endFactor*continentDivXPadding]);
    		xScales.push(continentXScale);
    	}
    	

    	if(i==1)
    	{
	    	let continentYScale = d3.scaleLinear()
	    						.domain([d3.min(yCoordinatesContainer[i]), d3.max(yCoordinatesContainer[i])])
								.range([ 
    							continentDivStartY+(0.4*continentDivHeight)-continentDivYPadding, 
    							continentDivStartY-30]);

			yScales[i]=continentYScale;
    	}
    	else{
    		let factor = 0.7;
    		let paddingFactor = -1;
    		if(i==2){
    			factor = 0.75;
    			paddingFactor = 6;
    		}
    		let continentYScale = d3.scaleLinear()
	    						.domain([d3.min(yCoordinatesContainer[i]), d3.max(yCoordinatesContainer[i])])
								.range([
    							continentDivStartY+(factor*continentDivHeight)-continentDivYPadding, 
    							continentDivStartY+ paddingFactor*continentDivYPadding]);

			yScales[i]=continentYScale;

    	}
    }
    //return;

    var radiusScale = d3.scaleLinear()
    					.domain([d3.min(countryValuesList),d3.max(countryValuesList)])
    					.range([10, 30]);
    
    /*if(document.getElementById("bubbleMapTooltipId")==null){
		var tooltip = d3.select('body').append("div")	
		    .attr("class", "bubbleMapTooltip")				
		    .style("opacity", 0)
		    .attr("id", "bubbleMapTooltipId");
	}
	else{
		var tooltip = d3.select("#bubbleMapTooltipId");
	}*/

	var tooltip = d3.select('body').append("div")	
		    .attr("class", "bubbleMapTooltip")				
		    .style("opacity", 0)
		    .attr("id", "bubbleMapTooltipId");

	
	/*var linearSizeLegend = d3.scaleLinear()
						.domain([d3.min(countryValuesList),d3.max(countryValuesList)])
    					.range([10, 30]);*/

    var legendSVG = d3.select("#svgLegendContainerId")
	    .append("svg")
	    .attr("id", "legendSVG")
	    .attr("width", document.getElementById("svgLegendContainerId").width)
	    .attr("height", document.getElementById("svgLegendContainerId").height);
	
	legendSVG.append("g")
		.attr("id", "legendGroup")
		  .attr("class", "legendSize")
		  .attr("transform", "translate(35, 30)");
	legendSVG.append("circle")
		.attr("fill", "black")
		.attr("r", radiusScale(d3.min(countryValuesList)))
		.attr("cx", function(d, i){
			//parseInt(document.getElementById("svgLegendContainerId").getBoundingClientRect().left)
			return radiusScale(d3.min(countryValuesList)) + 20 ;
		})
		.attr("cy", function(d, i){
			return 50;
		})
	legendSVG.append("text")
			.attr("class", "legendSizeLabelText")
			.attr("transform",
	            "translate(" + (30) + " ," + 
	                           (100) + ")")
		      .style("text-anchor", "middle")
		      .text(parseFloat(d3.min(countryValuesList)).toFixed(2));

	legendSVG.append("circle")
		.attr("fill", "black")
		.attr("r", radiusScale(d3.max(countryValuesList)))
		.attr("cx", function(d, i){
			//console.log(document.getElementById("svgLegendContainerId").getBoundingClientRect().left)
			//console.log(radiusScale(d3.max(countryValuesList)));

			//parseInt(document.getElementById("svgLegendContainerId").getBoundingClientRect().left)
			return 2*radiusScale(d3.min(countryValuesList)) + 80;
		})
		.attr("cy", function(d, i){
			return 50;
		})

	legendSVG.append("text")
			.attr("class", "legendSizeLabelText")
			.attr("transform",
	            "translate(" + (5*20) + " ," + 
	                           (100) + ")")
		      .style("text-anchor", "middle")
		      .text(parseFloat(d3.max(countryValuesList)).toFixed(2));

	//dataForLegend = [d3.min(countryValuesList), d3.max(countryValuesList)];


	/*var legendSize = d3.legendSize()
	.scale(linearSizeLegend)
	.cells(3)
	.shape('circle')
	.shapePadding(15)
	.labelOffset(20)
	.orient('horizontal');

	var legendOnMap = d3.select(".legendSize").call(legendSize);*/


		    

	bubbleChartSVGGroup.selectAll("circle")
	.data(rawdata)
	.enter()
	.append("circle")
	//.attr("class")
	.attr("class", "bubbleDefault")
    .attr("fill", "#666666")
    .attr("r",function(d){ 
    	//console.log(d.Code);
    	//console.log(countryValues[d.Code]);
    	return radiusScale(countryValues[d.Code]);})
    	/*if (selectedFeature == "valence")
    	{	
    		console.log(d.Valence)
    		return d.Valence;
    	}
    	if (selectedFeature == "energy")
    	{
    		console.log(d.Energy)
			return d.Energy;
		}
		else 
			return 0})*/
	.attr("cy",function(d){
		let continentCode = d.Continent; 
		let scaleNumToUse = continentToDivMapping[continentCode];
		return yScales[scaleNumToUse-1](d.X*1000);
		/*if(scaleNumToUse==2){
			return yScales[scaleNumToUse-1](d.X*1000);
		}
		else{return linearScaleX((d.X) *1000);}*/
		})
	.attr("cx",function(d){
		let continentCode = d.Continent; 
		let scaleNumToUse = continentToDivMapping[continentCode];
		let scaleToUse = xScales[scaleNumToUse-1];
		//console.log(scaleNumToUse);
		/*if(scaleNumToUse==1){
			console.log(xScales[scaleNumToUse-1](d.Y*1000))
		}*/
		//console.log(scaleToUse);
		//console.log(scaleToUse(d.Y * 1000));
		return  xScales[scaleNumToUse-1](d.Y*1000);})
		//linearScaleY((d.Y)*1000)})
	.attr("text",function(d){return d.Country})
	.attr("id", function(d){return d.Code})
	.on("mouseover", function(d){
				//console.log("Inside Mouseover");
				if(!(this.classList.contains("clicked"))){
					if(!(this.classList.contains("bubbleHovered"))){
						$(this).addClass("bubbleHovered");

					}
				}
				
				tooltip.transition()
						.duration(200)
						.style("opacity", .9);

				//tooltip.attr("id", "bubbleMapTooltip_"+d.Code);

				//let countrySpanPart1 = "Country: ";
				//countrySpanPart1.classList.add("")
				let countrySpan = document.createElement("span");
				countrySpan.innerHTML = d.Country + "<br/>"; 
				countrySpan.classList.add("tooltipTitle");
				//console.log(countrySpan);
				//console.log(tooltip);

				let subtitleSpanPart1 = document.createElement("span");
				subtitleSpanPart1.classList.add("tooltipKey");
				subtitleSpanPart1.innerHTML = "Average "+selectedFeatureText+": ";

				let subtitleSpanPart2 = document.createElement("span");
				subtitleSpanPart2.classList.add("tooltipValue");
				subtitleSpanPart2.innerHTML = parseFloat(countryValues[d.Code]).toFixed(2);

				//subtitleSpanPart1.classList.add("tooltipSubtitle");
				//subtitleSpanPart2.classList.add("tooltipSubtitle");

				let tooltipDOM = document.getElementById("bubbleMapTooltipId");

				while(tooltipDOM.firstChild){
					tooltipDOM.removeChild(tooltipDOM.firstChild);
				}

				tooltipDOM.append(countrySpan);
				tooltipDOM.append(subtitleSpanPart1);
				tooltipDOM.append(subtitleSpanPart2);

				//tooltip.html("Country: " + d.Country+
				//			"<br/>"+selectedFeatureText+": "+(parseFloat(countryValues[d.Code]).toFixed(2)))
				tooltip.style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
	})
	.on("mouseout", function(d){
			//also remove clicked from all other circles
			if(this.classList.contains("bubbleClicked")){
				//do not change stroke attributes

			}
			else{
				$(this).removeClass("bubbleHovered");
			}
			tooltip.transition()
               .duration(500)
               .style("opacity", 0);
	})
	.on('click',function(d,i){
		if(globalCurrentBubbleClickedId!=null){
			//console.log(document.getElementById(globalCurrentBubbleClickedId).classList);
			$("#"+globalCurrentBubbleClickedId).removeClass("bubbleClicked");
			$("#"+globalCurrentBubbleClickedId).removeClass("bubbleHovered");	
		}
		if(!(this.classList.contains("bubbleClicked"))){
			$(this).addClass("bubbleClicked")
		}

		if(!(d.Code==globalCountryCode)){
			//only call if different country is clicked
			document.getElementById("country_selected_area_actual_text").innerHTML = d.Country;
			document.getElementById("audio_features_country").innerHTML = d.Country;
			document.getElementById("charts_country").innerHTML = d.Country;

			$("#limiter_container_text").remove();
			$("#limiter_container_rect").remove();
			$("#limiter_container").remove();
			//remove one time div

			globalCurrentBubbleClickedId = this.id;
			globalCountryCode = d.Code;
			filterSongsByCountry();
		}
		
		});

	var legendMinInitial = "0.1 <br > negative" 
	var legendMaxInitial = "1.0 <br > positive"
	/*document.getElementById("minValue").innerHTML = legendMinInitial 
	document.getElementById("maxValue").innerHTML = legendMaxInitial
	document.getElementById("legendText").innerHTML = "Valence measures the musical positiveness conveyed by a track"
	*/
	let minValueDOM = document.getElementById("minValue");
    let maxValueDOM = document.getElementById("maxValue");
    let legendTextDOM = document.getElementById("legendText");
    if(minValueDOM!=null){
    	minValueDOM.innerHTML=legendMinInitial;
    }
    if(maxValueDOM!=null)
    {
    	maxValueDOM.innerHTML = legendMaxInitial;
    }
    if(legendTextDOM!=null){
    	legendTextDOM.innerHTML = "Valence measures the musical positiveness conveyed by a track";
    }

}

