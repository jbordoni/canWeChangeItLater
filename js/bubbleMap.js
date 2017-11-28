var bubbleChart;
var height = 500
var width = 500


function show()
{
	console.log("Inside show")
	bubbleChart = d3.select('#divContainer').select('#bubbleMap').append('svg').attr("height", height).attr("width", width);
	bubbleMap = bubbleChart.append('g');
	d3.csv('data/bubbleMapData.csv', showBubbleMap);

}



function showBubbleMap(rawdata)
{
   
	bubbleChart.selectAll("circle")
	.data(rawdata)
	.enter()
	.append("circle")
	.style("stroke", "gray")
    .style("fill", "black")
    .attr("r",function(d){return d.Radius})
	.attr("cx",function(d){return d.X})
	.attr("cy",function(d){return d.Y})


	d3.json("readme-world.json", function(error, world) {
  	var countries = topojson.feature(world, world.objects.countries).features;
  	})
	

}




