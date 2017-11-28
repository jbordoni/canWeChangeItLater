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

		let countryCode = "Global";
		//let xAxisProperty = "energy";

		let result = audioFeaturesScatter.getSelectedOption(xAxisSelectorID);
		let xAxisProperty = result[0];
		let xAxisPropertyText = result[1];
		console.log(xAxisProperty);

		if(xAxisProperty=="")
		{
			xAxisProperty = "valence";
			xAxisPropertyText = "Valence";
		}

		let colorResult = audioFeaturesScatter.getSelectedOption(colorSelectorID);
		colorProperty = colorResult[0]
		colorPropertyText =colorResult[1];

		if(colorProperty==""){
			colorProperty = "energy";
			colorPropertyText = "Energy";
		}

		let songs = {}; 

		d3.json("datasets/week-score/weeksOnChart-"+countryCode+"-Last.json", function(error, weeksData){                  
              d3.json("datasets/audioFeaturesHashMap.json", function(error2, audioFeaturesData){
              	//console.log(weeksData==null);
              	//console.log(audioFeaturesData==null);
              	audioFeaturesScatter.populateDiv(divID, weeksData, audioFeaturesData, xAxisProperty, xAxisPropertyText,  colorProperty, colorPropertyText);
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

	audioFeaturesScatter.populateDiv = function(divID, weeksData, audioFeaturesData, xAxisProperty, xAxisPropertyText, colorProperty, colorPropertyText){

		//console.log(audioFeaturesData);
		//console.log("I am here");
		//console.log(weeksData); 
		//console.log(weeksData[0]);
		//console.log(audioFeaturesData[0]);

		//console.log(audioFeaturesData[xAxisProperty])
		//console.log(audioFeaturesScatter[0]);

		let computedData = [];
		let xAxisPropertyValueArr = [];
		let yAxisPropertyValueArr = [];
		let colorPropertyValueArr = [];

		for(var key in weeksData){
			if(weeksData.hasOwnProperty(key)){
				//console.log(key);
				//return
				obj = weeksData[key]
				obj[xAxisProperty] = audioFeaturesData[key][xAxisProperty];
				obj[colorProperty] = audioFeaturesData[key][colorProperty];
				computedData.push(obj);
				xAxisPropertyValueArr.push(audioFeaturesData[key][xAxisProperty]*10000);
				yAxisPropertyValueArr.push(obj["weeksOnChart"]);
				colorPropertyValueArr.push(obj[colorProperty]*1000)
				if(obj["weeksOnChart"]==0){
					console.log(obj);
				}
			}
		}
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

		var xScale = d3.scaleLinear();
		xScale.domain([d3.min(xAxisPropertyValueArr), d3.max(xAxisPropertyValueArr)])
				.range([0+xPadding, divWidth-xPadding]);

		var xAxis = d3.axisBottom();
		xAxis.scale(xScale);

		var yScale = d3.scaleLinear()
					.domain([d3.min(yAxisPropertyValueArr), d3.max(yAxisPropertyValueArr)])
					.range([divHeight-(yPadding), 0+yPadding]);

		var yAxis = d3.axisLeft();
		yAxis.scale(yScale);


		//var colorScale = 
		/*var tooltip = d3.select("#"+divID)
		    .attr("class", "tooltip")
		    .style("opacity", 0);*/

		
		var svg = d3.select("#"+divID)
					.append("svg")
					.attr("width", divWidth)
					.attr("height", divHeight);

		var tooltip = d3.select('body').append("div")	
		    .attr("class", "scatterTooltip")				
		    .style("opacity", 0);

		var colorScale = d3.scaleQuantize()
							.range(["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"])
							.domain([d3.min(colorPropertyValueArr), d3.max(colorPropertyValueArr)]);
		

		/*var colorScale = d3.scaleLinear()
							.domain()*/

		//need to fix scale for decimal values 
		svg.append("g")
		    .attr("class", "axis")
		    .attr("transform", "translate(0," + (divHeight-yPadding) + ")")
		    .call(xAxis);

		svg.append("g")
		   .attr("class", "axis")
		   .attr("transform", "translate(" + xPadding + ",0)")
		   .call(yAxis);

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
				return colorScale(d[colorProperty]*1000);
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