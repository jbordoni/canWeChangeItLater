(function(){

	audioFeaturesScatter = {};

	audioFeaturesScatter.initiate = function(divID){
		let countryCode = "Global";
		let xAxisProperty = "energy";
		let songs = {}; 

		d3.json("datasets/week-score/weeksOnChart-"+countryCode+"-Last.json", function(error, weeksData){                  
              d3.json("datasets/audioFeaturesHashMap.json", function(error2, audioFeaturesData){
              	//console.log(weeksData==null);
              	//console.log(audioFeaturesData==null);
              	audioFeaturesScatter.populateDiv(divID, weeksData, audioFeaturesData, xAxisProperty);
              })
          });

	}

	audioFeaturesScatter.populateDiv = function(divID, weeksData, audioFeaturesData, xAxisProperty){

		//console.log(audioFeaturesData);
		//console.log("I am here");
		//console.log(weeksData); 
		//console.log(weeksData[0]);
		//console.log(audioFeaturesData[0]);

		let computedData = [];
		let xAxisPropertyValueArr = [];
		let yAxisPropertyValueArr = [];

		for(var key in weeksData){
			if(weeksData.hasOwnProperty(key)){
				//console.log(key);
				//return
				obj = weeksData[key]
				obj[xAxisProperty] = audioFeaturesData[key][xAxisProperty];
				computedData.push(obj);
				xAxisPropertyValueArr.push(audioFeaturesData[key][xAxisProperty]*10000);
				yAxisPropertyValueArr.push(obj["weeksOnChart"]);
			}
		}



		console.log(divID);
		let div = document.getElementById(divID);
		console.log(div.id);

		let divWidth = div.offsetWidth; 
		console.log(divWidth);
		let divHeight = div.offsetHeight;
		console.log(divHeight);


		console.log(computedData.length);
		console.log(yAxisPropertyValueArr.length);
		console.log(xAxisPropertyValueArr.length);
		console.log(d3.min(xAxisPropertyValueArr), d3.max(xAxisPropertyValueArr));

		let xPadding = 0.1*divWidth; 
		let yPadding = 0.1*divHeight; 

		var xScale = d3.scaleLinear();
		xScale.domain([d3.min(xAxisPropertyValueArr), d3.max(xAxisPropertyValueArr)])
				.range([0+xPadding, divWidth-xPadding]);

		var yScale = d3.scaleLinear()
					.domain([d3.min(yAxisPropertyValueArr), d3.max(yAxisPropertyValueArr)])
					.range([0+yPadding, divHeight-yPadding]);

		var svg = d3.select("#"+divID)
					.append("svg")
					.attr("width", divWidth)
					.attr("height", divHeight);

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
			.attr("r", 5);


	}

})(); 