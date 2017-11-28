var bubbleChart;
var height = 1200;
var width = 1200;
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

    bubbleChart = d3.select('#divContainer').select('#bubbleMap').append('svg').attr("height", height).attr("width", width);
	bubbleMap = bubbleChart.append('g');

	d3.csv('data/bubbleMapCountryData.csv', showBubbleMap);
}



function showBubbleMap(rawdata)
{



	var selectedFeature = document.getElementById('dropDownAudioFeatures').value
	console.log(selectedFeature)
   
    var initialScaleDataX =[]
    var initialScaleDataY = []

    for (var i = 0;i<rawdata.length;i++)
    {
    	initialScaleDataX[i] = (rawdata[i].X)*1000
        initialScaleDataY[i] = (rawdata[i].Y)*1000
    }
   
   	xpadding = 0.01*width;
   	ypadding = 0.01*height;

 	var newScaledDataX = [];
 	var newScaledDataY = [];
 	var minDataPointX = d3.min(initialScaleDataX);
 	var maxDataPointX = d3.max(initialScaleDataY);

 	var minDataPointY = d3.min(initialScaleDataY);
 	var maxDataPointY = d3.max(initialScaleDataY);


 	var linearScaleX = d3.scaleLinear()
                            .domain([minDataPointX,maxDataPointX])
                            .range([0+xpadding,500-xpadding]);

    var linearScaleY = d3.scaleLinear()
                            .domain([minDataPointY,maxDataPointY])
                            .range([0+ypadding,500-ypadding]);
    
    
   

   
	bubbleChart.selectAll("circle")
	.data(rawdata)
	.enter()
	.append("circle")
	.style("stroke", "gray")
    .style("fill", "green")
    .attr("r",function(d){ 
    	if (selectedFeature == "Valence")
    	{	
    		console.log(d.Valence)
    		return d.Valence;
    	}
    	if (selectedFeature == "Energy")
    	{
    		console.log(d.Energy)
			return d.Energy;
		}
		else 
			return 0})
	.attr("cy",function(d){return 500-linearScaleX((d.X) *1000)})
	.attr("cx",function(d){return  linearScaleY((d.Y)*1000)})
	.attr("text",function(d){return d.Country})


	 


}

