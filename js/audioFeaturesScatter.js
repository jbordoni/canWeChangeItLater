(function(){

	audioFeaturesScatter = {};

	audioFeaturesScatter.initiate = function(divID, yAxisSelectorID, xAxisSelectorID, colorSelectorID, updateButtonID){
		
		let div = document.getElementById(divID);
		let childNodes = div.childNodes; 

		//clear existing SVG element if any 
		for(var i=0; i<childNodes.length; i++)
		{
			let el = childNodes[i];
			if(el instanceof SVGElement){
				$(el).remove();
			}
		}

		/*8let countryCode="";
		if(countryCodeGiven==null){
			globalCountryCode = "Global";
		}
		else{
			globalCountryCode = countryCodeGiven;
		}*/
		
		//let xAxisProperty = "energy";

		let result = audioFeaturesScatter.getSelectedOption(xAxisSelectorID);
		let xAxisProperty = result[0];
		let xAxisPropertyText = result[1];
		console.log(xAxisProperty);

		//set default
		if(xAxisProperty=="")
		{
			xAxisProperty = "valence";
			xAxisPropertyText = "Valence";
		}

		let colorResult = audioFeaturesScatter.getSelectedOption(colorSelectorID);
		colorProperty = colorResult[0]
		colorPropertyText =colorResult[1];

		//set default
		if(colorProperty==""){
			colorProperty = "none";
			colorPropertyText = "None";
		}

		let songs = {}; 

		d3.json("datasets/week-score/weeksOnChart-"+globalCountryCode+"-Last.json", function(error, weeksData){                  
              d3.json("datasets/audioFeaturesHashMap.json", function(error2, audioFeaturesData){
              	//console.log(weeksData==null);
              	//console.log(audioFeaturesData==null);
              	d3.json("datasets/countryCodes.json", function(error3, countryCodeData){
              		audioFeaturesScatter.populateDiv(divID, weeksData, audioFeaturesData, xAxisProperty, xAxisPropertyText,  
              			colorProperty, colorPropertyText, countryCodeData);

              	})
              })
        });

	}

	audioFeaturesScatter.getSelectedOption = function(selectorID){
		//console.log(selectorID);
		var node = d3.select('#'+selectorID).node();
		var i = node.selectedIndex;
		//console.log("I am here");
		//console.log("value is" + node[i].innerHTML);
		return [node[i].value, node[i].innerHTML];
	}

	audioFeaturesScatter.populateDiv = function(divID, weeksData, audioFeaturesData, xAxisProperty, xAxisPropertyText, colorProperty, colorPropertyText, countryCodeData){

		//console.log(audioFeaturesData);
		//console.log("I am here");
		//console.log(weeksData); 
		//console.log(weeksData[0]);
		//console.log(audioFeaturesData[0]);

		//console.log(audioFeaturesData[xAxisProperty])
		//console.log(audioFeaturesScatter[0]);

		let countrySelectedText="";
		if(globalCountryCode=="Global"){
			countrySelectedText = globalCountryCode
		}
		else
		{
			countrySelectedText = countryCodeData[globalCountryCode];
	
		}
		console.log(countrySelectedText);

		let computedData = [];
		let xAxisPropertyValueArr = [];
		let yAxisPropertyValueArr = [];
		let colorPropertyValueArr = [];

		let xAxisPropertyValueArrNotMultiplied = [];




		//iterate through complete json object
		for(var key in weeksData){
			if(weeksData.hasOwnProperty(key)){
				//console.log(key);
				//return
				obj = weeksData[key]
				if(key in audioFeaturesData && key!=undefined && key!=null){
					if(audioFeaturesData[key][xAxisProperty]!=null){
						obj[xAxisProperty] = audioFeaturesData[key][xAxisProperty];
						if(colorPropertyText!="None"){
							obj[colorProperty] = audioFeaturesData[key][colorProperty];

						}
						computedData.push(obj);
						xAxisPropertyValueArr.push(audioFeaturesData[key][xAxisProperty]*10000);
						xAxisPropertyValueArrNotMultiplied.push(audioFeaturesData[key][xAxisProperty]);
						yAxisPropertyValueArr.push(obj["weeksOnChart"]);
						if(colorPropertyText!="None"){
							colorPropertyValueArr.push(obj[colorProperty]*1000)
						}
						
						if(obj["weeksOnChart"]==0){
							console.log(obj);
						}
					}
					
				}
				
			}
		}

		//console.log("Check error");

		/*console.log(xAxisPropertyValueArr.length);
		console.log(xAxisPropertyValueArrNotMultiplied.length);
		console.log(computedData.length);*/	


		let div = document.getElementById(divID);
		let divWidth = div.offsetWidth; 
		//console.log(divWidth);
		let divHeight = div.offsetHeight;
		//console.log(divHeight);


		/*console.log(computedData.length);
		console.log(yAxisPropertyValueArr.length);
		console.log(xAxisPropertyValueArr.length);
		console.log(d3.min(xAxisPropertyValueArr), d3.max(xAxisPropertyValueArr));*/

		let xPadding = 0.1*divWidth; 
		let yPadding = 0.1*divHeight; 

		let svgWidth = divWidth - 0.2*divWidth; 
		let svgHeight = divHeight - 0.25*divHeight; 


		var xScale = d3.scaleLinear();
		xScale.domain([d3.min(xAxisPropertyValueArr), d3.max(xAxisPropertyValueArr)])
				.range([0+xPadding, svgWidth-xPadding]);

		var xScaleForDisplay = d3.scaleLinear();
		xScaleForDisplay.domain([d3.min(xAxisPropertyValueArrNotMultiplied), d3.max(xAxisPropertyValueArrNotMultiplied)])
						.range([0+xPadding, svgWidth-xPadding])
						.tickFormat(d3.format(",.2f"));

		var xAxis = d3.axisBottom();
		xAxis.scale(xScaleForDisplay);
				//.tickFormat(d3.format(",.2f"));

		var yScale = d3.scaleLinear()
					.domain([d3.min(yAxisPropertyValueArr), d3.max(yAxisPropertyValueArr)])
					.range([svgHeight-(yPadding), 0+yPadding]);

		var yAxis = d3.axisLeft();
		yAxis.scale(yScale);


		//var colorScale = 
		/*var tooltip = d3.select("#"+divID)
		    .attr("class", "tooltip")
		    .style("opacity", 0);*/

		//svgPadding = {"top":}

		
		
		var svg = d3.select("#"+divID)
					.append("svg")
					.attr("width", svgWidth)
					.attr("height", svgHeight);

		var tooltip = d3.select('body').append("div")	
		    .attr("class", "scatterTooltip")				
		    .style("opacity", 0);

		if(colorPropertyText!="None"){
			var colorScale = d3.scaleQuantize()
							.range(["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"])
							.domain([d3.min(colorPropertyValueArr), d3.max(colorPropertyValueArr)]);
		

		}
		
		/*var colorScale = d3.scaleLinear()
							.domain()*/

		svg.append("g")
		    .attr("class", "axis")
		    .attr("transform", "translate(0," + (svgHeight-yPadding) + ")")
		    .call(xAxis);

		svg.append("text")
			.attr("class", "axisLabelScatter")
			.attr("transform",
	            "translate(" + (svgWidth/2) + " ," + 
	                           (svgHeight) + ")")
		      .style("text-anchor", "middle")
		      .text(xAxisPropertyText);


		svg.append("g")
		   .attr("class", "axis")
		   .attr("transform", "translate(" + xPadding + ",0)")
		   .call(yAxis);

		svg.append("text")
			.attr("class", "axisLabelScatter")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0)
	      .attr("x",0 - (svgHeight / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .text("Weeks on Charts");   

		svg.selectAll("circle")
			.data(computedData)
			.enter()
			.append("circle")
			.attr("cx", function(d){
				return xScale(d[xAxisProperty]*10000);
			})
			.attr("cy", function(d){
				return yScale(d["weeksOnChart"]);
			})
			.attr("r", 5)
			.style("fill", function(d){
				if(colorPropertyText!="None"){
					return colorScale(d[colorProperty]*1000);
				}
				else{
					return "orange";
				}
				
			})
			.on("mouseover", function(d){
				//console.log("Mouseover");
				tooltip.transition()
						.duration(200)
						.style("opacity", .9);
				tooltip.html(d["songName"]+"<br/>"+"Weeks On Charts: "+d["weeksOnChart"]+
					"<br/>"+xAxisPropertyText+": "+d[xAxisProperty]+
					"<br/>"+colorPropertyText+": "+d[colorProperty])
				.style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d){
				tooltip.transition()
               .duration(500)
               .style("opacity", 0);
			});


	}

})(); 