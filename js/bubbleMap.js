var bubbleChart;
var height = 1000
var width = 1000


function show()
{
	console.log("Inside show")
	bubbleChart = d3.select('#divContainer').select('#bubbleMap').append('svg').attr("height", height).attr("width", width);
	bubbleMap = bubbleChart.append('g');
	d3.csv('data/bubbleMapCountryData.csv', showBubbleMap);

}



function showBubbleMap(rawdata)
{
	console.log(rawdata[0].X)
   
    var initialScaleDataX =[]
    var initialScaleDataY = []

    for (var i = 0;i<rawdata.length;i++)
    {
    	initialScaleDataX[i] = (rawdata[i].X)*1000
        initialScaleDataY[i] = (rawdata[i].Y)*1000
    }
   

 	var newScaledDataX = [];
 	var newScaledDataY = [];
 	var minDataPointX = d3.min(initialScaleDataX);
 	var maxDataPointX = d3.max(initialScaleDataY);

 	var minDataPointY = d3.min(initialScaleDataY);
 	var maxDataPointY = d3.max(initialScaleDataY);


 	var linearScaleX = d3.scaleLinear()
                            .domain([minDataPointX,maxDataPointX])
                            .range([0,500]);

    var linearScaleY = d3.scaleLinear()
                            .domain([minDataPointY,maxDataPointY])
                            .range([0,500]);


    /*
	for (var i = 0; i < initialScaleDataX.length; i++) {
		newScaledDataX[i] = linearScaleX(initialScaleDataX[i]);
		newScaledDataY[i] = linearScaleY(initialScaleDataY[i]);
	
     }

    rawdata.X = newScaledDataX
    rawdata.Y = newScaledDataY

    console.log(rawdata.X)
    console.log(rawdata.Y)
    console.log(rawdata)
     */
    

   
	bubbleChart.selectAll("circle")
	.data(rawdata)
	.enter()
	.append("circle")
	.style("stroke", "gray")
    .style("fill", "green")
    .attr("r",function(d){return d.Radius})
	.attr("cy",function(d){return 500-linearScaleX((d.X) *1000)})
	.attr("cx",function(d){return linearScaleY((d.Y)*1000)})
	.attr("text",function(d){return d.Country})
	

}

