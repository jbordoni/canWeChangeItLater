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
	
	let audioScatterSVGGroup = bubbleChartSVG.append('g').attr("id", "lineChartSVGGroup");
}

function updateLineChart(hmap){

	console.log("updating lineChart");
	console.log(hmap);

	let startMonthNo = startMonthNoGlobal; 
	let endMonthNo = endMonthNoGlobal;

	let startMonthNoChart = globalWeekMap[startMonthNo];
	let endMonthNoChart = globalWeekMap[endMonthNo];

	let weekStringStart = globalWeekStringMap[startMonthNoChart];
	let weekStringEnd = globalWeekStringMap[endMonthNoChart];

	var audioSVG = d3.select("#lifeOfMusicHitDiv");
	//var audioSVGGroup = audioSVG.selectAll("g");
	let audioSVGGroup = d3.select("#lineChartSVGGroup")

	let audioSVGDOM = document.getElementById("lineChartSVG");

	let svgWidth = $("#lineChartSVG").width();
	let svgHeight = $("#lineChartSVG").height(); 

	let parseWeek = d3.timeParse("%Y-%m-%d");

	let weekList = globalWeekStringMap.slice(startMonthNoChart, endMonthNoChart+1);

	let xPaddingForAxis = 30;
	let yPaddingForAxis = 30 

	let marginRight = 20;
	let marginTop = 20;

	var xScale = d3.scaleLinear()
				.range([0+2*xPaddingForAxis, svgWidth-marginRight])
				.domain([0, weekList.length]);

	
	var yScale = d3.scaleLinear()
			.range([svgHeight-1.5*yPaddingForAxis, marginTop])
			.domain([0, 101]);

	var yScaleForDisplay = d3.scaleLinear()
			.range([svgHeight-1.5*yPaddingForAxis, marginTop])
			.domain([101, 0])

	let yAxis = d3.axisLeft();
	yAxis.scale(yScaleForDisplay)
		.tickValues([1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])

 	let xAxis = d3.axisBottom()
 	xAxis.scale(xScale);

 	console.log(audioSVGDOM.childNodes);
	if(audioSVGDOM.firstChild.firstChild == null){

		d3.select("#lineChartSVG").append("g")
		   .attr("class", "axis")
		   .attr("transform", "translate(" + 2*xPaddingForAxis + ",0)")
		   .call(yAxis);

		d3.select("#lineChartSVG").append("text")
			.attr("class", "axisLabelScatter")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0)
	      .attr("x",0 - (svgHeight / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .text("Position on Chart"); 

		d3.select("#lineChartSVG").append("g")
		    .attr("class", "axis")
		    .attr("transform", "translate(0," + (svgHeight-1.5*yPaddingForAxis) + ")")
		    .call(xAxis);

		d3.select("#lineChartSVG").append("text")
			.attr("class", "axisLabelScatter")
			.attr("transform",
	            "translate(" + (svgWidth/2) + " ," + 
	                           (svgHeight) + ")")
		      .style("text-anchor", "middle")
		      .text("Week");


	}

	dataList = [];

	for(var song in hmap){
		if(hmap.hasOwnProperty(song)){
			dataList.push(hmap[song]['positionList'])
		}
	}

	console.log(dataList);


	var valueline = d3.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(101-d); });

    var lines = audioSVGGroup.selectAll(".lineChartLine")
     				.data(dataList, function(d){ return d; })

     				//want to retain original songs
     				
    lines.enter().append("path")
		.attr("class", "lineChartLine")
		.attr("d", valueline)
		.on("mouseover", function(d){
			console.log(d)
		})

    lines.exit().remove()

}