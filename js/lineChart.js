function loadLineChart(){
	let div = d3.select("#lifeOfMusicHitDiv")
	let data = 1;
}

function loadSVGInLineChart(){
	let bubbleChartDiv = document.getElementById("lifeOfMusicHitDiv");

	bubbleChartDivHeight = bubbleChartDiv.offsetHeight; 
	bubbleChartDivWidth = bubbleChartDiv.offsetWidth;

    let bubbleChartSVG = d3.select('#lifeOfMusicHitDiv')
    				.append("svg")
					.attr("height", bubbleChartDivHeight)
    				.attr("width", 0.95 * bubbleChartDivWidth)
    				.attr("id", "lineChartSVG");

    //console.log(bubbleChartSVG);

    //let bubbleSVG = d3.select('#audioFeaturesScatterDiv').selectAll('svg')
	
	let audioScatterSVGGroup = bubbleChartSVG.append('g');
}

function updateLineChart(hmap){

	console.log("updating lineChart");

	let startMonthNo = startMonthNoGlobal; 
	let endMonthNo = endMonthNoGlobal;

	let startMonthNoChart = globalWeekMap[startMonthNo];
	let endMonthNoChart = globalWeekMap[endMonthNo];

	let weekStringStart = globalWeekStringMap[startMonthNoChart];
	let weekStringEnd = globalWeekStringMap[endMonthNoChart];

	var audioSVG = d3.select("#lifeOfMusicHitDiv");
	var audioSVGGroup = audioSVG.selectAll("g");

	let svgWidth = $("#lineChartSVG").width();
	let svgHeight = $("#lineChartSVG").height(); 

	//console.log(weekStringStart, weekStringEnd);

	let parseWeek = d3.timeParse("%Y-%m-%d");

	let weekList = globalWeekStringMap.slice(startMonthNoChart, endMonthNoChart+1);

	let xPaddingForAxis = 30; 

	var xScale = d3.scaleLinear()
				.range([0+xPaddingForAxis, svgWidth])
				.domain([0, weekList.length]);

	
	var yScale = d3.scaleLinear()
			.range([svgHeight, 10])
			.domain([0, 101]);

	var yScaleForDisplay = d3.scaleLinear()
			.range([svgHeight, 10])
			.domain([101, 1])

	let yAxis = d3.axisLeft();
	yAxis.scale(yScaleForDisplay)
		.tickFormat();

	audioSVGGroup.append("g")
	   .attr("class", "axis")
	   .attr("transform", "translate(" + xPaddingForAxis + ",0)")
	   .call(yAxis);
	
	//console.

	//let listOfWeeks = d3.range(parseWeek(weekStringStart), parseWeek(weekStringEnd))

	//console.log(listOfWeeks);
	//return;


	dataList = [];

	for(var song in hmap){
		if(hmap.hasOwnProperty(song)){
			dataList.push(hmap[song]['positionList'])
		}
	}

	// xValues = d3.range(1, 11);
	// console.log(xValues);
	// yValues = [3, 7, 5, 9];

	// let data = [{"month":1, "position":3}, {"month":2, "position":7}, {"month":5, "position":2}, {"month":9, "position":9}]

	
	//var parseTime = d3.timeParse("%m");

							//.domain(d3.extent(data, function(d) { return parseTime(d.month); }));

	/*var xScale = d3.scaleLinear()
			.range([0, svgWidth])
			.domain([d3.min(xValues), d3.max(xValues)]);*/

								//.domain([d3.min(yValues), d3.max(yValues)]);

	var valueline = d3.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(101-d); });


    //xScale.domain(d3.extent(data, function(d) { return parseTime(d.month); }))
    //yScale.domain([d3.min(yValues), d3.max(yValues)]);

	/*audioSVGGroup.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);*/
    var lines = audioSVGGroup.selectAll(".line")
     				.data(dataList, function(d){return d;})
     				
    lines.enter().append("path")
		.attr("class", "line")
		.attr("d", valueline)
		.on("mouseover", function(d){
			console.log(d)
		})

    lines.exit().remove()

}