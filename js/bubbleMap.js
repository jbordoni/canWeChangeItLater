var bubbleChart;
var bubbleChartSVGGroup;
//var height = 1200;
//var width = 1200;
var flag = 0

function show(flag)
{
	
	console.log("Inside show")
	if(flag==1)
	{
		let div = document.getElementById('bubbleMap');
		let childNodes = div.childNodes; 

		//clear existing SVG element if any 
		for(var i=0; i<childNodes.length; i++)
		{
			let el = childNodes[i];
			if(el instanceof SVGElement){
				$(el).remove();
			}
		}
	}

	let bubbleChartDiv = document.getElementById("bubbleMap");
	bubbleChartDivHeight = bubbleChartDiv.offsetHeight; 
	bubbleChartDivWidth = bubbleChartDiv.offsetWidth;

    bubbleChart = d3.select('#bubbleMap')
    			.append('svg')
    			.attr("height", bubbleChartDivHeight)
    			.attr("width", bubbleChartDivWidth);
	bubbleChartSVGGroup = bubbleChart.append('g');

	d3.csv('data/bubbleMapCountryData.csv', initiateShowBubbleMap);
}

function initiateShowBubbleMap(rawdata)
{

	d3.json("datasets/songs-country/songListPerCountry-Last.json", function(error, songsListData){                  
              d3.json("datasets/audioFeaturesHashMap.json", function(error2, audioFeaturesData){
              	//console.log(weeksData==null);
              	//console.log(audioFeaturesData==null);
              	//audioFeaturesScatter.populateDiv(divID, weeksData, audioFeaturesData, xAxisProperty, xAxisPropertyText,  colorProperty, colorPropertyText);
              	showBubbleMap(rawdata, songsListData, audioFeaturesData);
              })
        });
}

function showBubbleMap(rawdata, songsListData, audioFeaturesData){
	var selectedFeature = document.getElementById('dropDownAudioFeatures').value;
	//console.log(selectedFeature);

	let nodeIdx = document.getElementById('dropDownAudioFeatures').selectedIndex;
	console.log(nodeIdx);
	let selectedFeatureText = document.getElementById('dropDownAudioFeatures')[nodeIdx].innerHTML;

	let bubbleChartDiv = document.getElementById("bubbleMap");
	let height = bubbleChartDiv.offsetHeight; 
	let width = bubbleChartDiv.offsetWidth;

	console.log(height, width);
	//let height = 

	//console.log()

	countryValues = {};
	countryValuesList = [];

	for(var key in songsListData){
		if(songsListData.hasOwnProperty(key)){
			//console.log(key);
			//return
			let songsList = songsListData[key];
			console.log(songsList.length);
			let values = [];
			let valueSum = 0;
			for(var i=0; i<songsList.length; i++){
				let songId = songsList[i];
				if(songId!=null && songId!=undefined && songId in audioFeaturesData){
					//console.log(songId);
					if(audioFeaturesData[songId][selectedFeature]!=null){
						values.push(audioFeaturesData[songId][selectedFeature]);
						valueSum+=audioFeaturesData[songId][selectedFeature];
					}
				}
				
			}
			let valueMean = valueSum/values.length; 

			countryValues[key] = 1000*valueMean;
			countryValuesList.push(1000*valueMean);

		}
	}
   
    var initialScaleDataX =[]
    var initialScaleDataY = []

    for (var i = 0;i<rawdata.length;i++)
    {
    	initialScaleDataX[i] = (rawdata[i].X)*1000
        initialScaleDataY[i] = (rawdata[i].Y)*1000
    }
   
   	xpadding = 0.17*height;
   	ypadding = 0.09*width;

 	var newScaledDataX = [];
 	var newScaledDataY = [];
 	var minDataPointX = d3.min(initialScaleDataX);
 	var maxDataPointX = d3.max(initialScaleDataX);

 	var minDataPointY = d3.min(initialScaleDataY);
 	var maxDataPointY = d3.max(initialScaleDataY);


 	var linearScaleX = d3.scaleLinear()
                            .domain([minDataPointX,maxDataPointX])
                            .range([height-xpadding, 0 + xpadding]);

    var linearScaleY = d3.scaleLinear()
                            .domain([minDataPointY,maxDataPointY])
                            .range([0 + ypadding,width-ypadding]);

    var radiusScale = d3.scaleLinear()
    					.domain([d3.min(countryValuesList),d3.max(countryValuesList)])
    					.range([5, 30]);
    
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
	.attr("cy",function(d){return linearScaleX((d.X) *1000)})
	.attr("cx",function(d){return  linearScaleY((d.Y)*1000)})
	.attr("text",function(d){return d.Country})
	.attr("id", "hello")
	.on("mouseover", function(d){
				console.log("Inside Mouseover");
				d3.select(this).attr('stroke',"orange")
				d3.select(this).attr("fill", "#333333")
				tooltip.transition()
						.duration(200)
						.style("opacity", .9);
				tooltip.html("Country : " + d.Country+
							"<br/>"+selectedFeatureText+": "+(parseFloat(countryValues[d.Code]/1000.0).toFixed(2)))
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
		});
}

