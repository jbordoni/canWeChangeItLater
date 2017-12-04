var bubbleChartSVGGroup; 
var rawdataGlobal;

function loadSVGInBubbleMap(countryValues, countryValuesList){
	let bubbleChartDiv = document.getElementById("bubbleMap");
	bubbleChartDivHeight = bubbleChartDiv.offsetHeight; 
	bubbleChartDivWidth = bubbleChartDiv.offsetWidth;

    bubbleChart = d3.select('#bubbleMap')
    			.append('svg')
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

	let radiusScale = d3.scaleLinear()
    					.domain([d3.min(countryValuesList),d3.max(countryValuesList)])
    					.range([10, 30]);

	bubbleChartSVGGroup.selectAll("circle")
	.data(rawdataGlobal)
	.transition()
	.duration(500)
	.attr("r",function(d){ 
    	//console.log(d.Code);
    	//console.log(countryValues[d.Code]);
    	//console.log(radiusScale(countryValues[d.Code]));
    	return radiusScale(countryValues[d.Code]);
    });

}

function setupBubblesOnSVG(rawdata, countryValues, countryValuesList){
	//console.log(countryValues);

	var selectedFeature = document.getElementById('dropDownAudioFeatures').value;
	//console.log(selectedFeature);

	let nodeIdx = document.getElementById('dropDownAudioFeatures').selectedIndex;
	//console.log(nodeIdx);

	let selectedFeatureText = document.getElementById('dropDownAudioFeatures')[nodeIdx].innerHTML;
	
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
    	let continentDivStartX = parseInt(continentDiv.offsetLeft);
    	let continentDivStartY = parseInt(continentDiv.offsetTop);
    	//console.log(continentDivStartX,continentDivStartX+continentDivWidth-2*continentDivPadding)

    	//console.log("Checking div left:",continentDivStartX); 

    	let continentXScale = d3.scaleLinear()
    						.domain([d3.min(xCoordinatesContainer[i]), d3.max(xCoordinatesContainer[i])])
    						.range([continentDivStartX+continentDivXPadding, 
    							continentDivStartX+continentDivWidth-continentDivXPadding]);
    	xScales.push(continentXScale);

    	if(i==1)
    	{
	    	let continentYScale = d3.scaleLinear()
	    						.domain([d3.min(yCoordinatesContainer[i]), d3.max(yCoordinatesContainer[i])])
								.range([ 
    							continentDivStartY+(0.4*continentDivHeight)-continentDivYPadding, 
    							continentDivStartY]);

			yScales[i]=continentYScale;
    	}
    	else{

    		let continentYScale = d3.scaleLinear()
	    						.domain([d3.min(yCoordinatesContainer[i]), d3.max(yCoordinatesContainer[i])])
								.range([
    							continentDivStartY+(0.7*continentDivHeight)-continentDivYPadding, 
    							continentDivStartY]);

			yScales[i]=continentYScale;

    	}
    }
    //return;

    var radiusScale = d3.scaleLinear()
    					.domain([d3.min(countryValuesList),d3.max(countryValuesList)])
    					.range([10, 30]);
    
    var tooltip = d3.select('body').append("div")	
		    .attr("class", "bubbleMapTooltip")				
		    .style("opacity", 0);

	bubbleChartSVGGroup.selectAll("circle")
	.data(rawdata)
	.enter()
	.append("circle")
	.attr("stroke", "yellow")
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
	.attr("id", function(d){return d.Country})
	.on("mouseover", function(d){
				//console.log("Inside Mouseover");
				d3.select(this).attr('stroke',"orange")
				d3.select(this).attr("fill", "#333333")
				tooltip.transition()
						.duration(200)
						.style("opacity", .9);
				tooltip.html("Country : " + d.Country+
							"<br/>"+selectedFeatureText+": "+(parseFloat(countryValues[d.Code]).toFixed(2)))
				.style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
	})
	.on("mouseout", function(d){
				d3.select(this).attr('stroke',"yellow");
				d3.select(this).attr("fill","#666666")
				tooltip.transition()
               .duration(500)
               .style("opacity", 0);
	})
	.on('click',function(d,i){
		//call scatterplot
		globalCountryCode = d.Code;
		filterSongsByCountry();
		//audioFeaturesScatter.initiate("audioFeaturesScatterDiv", "ydropdownScatter", 
    	//	"xdropdownScatter", "colordropdownScatter", "updateAudioFeatScatter");
		});

}