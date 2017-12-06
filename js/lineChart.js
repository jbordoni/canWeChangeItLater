function loadLineChart(){
	let div = d3.select("#lifeOfMusicHitDiv")
	let data = 1;
}

function clearLineChartLines(){

	let svgDOMElement = document.getElementById("lineChartSVGGroup");
	while(svgDOMElement.firstChild){
		svgDOMElement.firstChild.remove();
	}
}

function clearButtonClicked(){
	clearLineChartLines();
}

//$("#clear_music_chart_songs").click(function)

function loadSVGInLineChart(){
	let bubbleChartDiv = document.getElementById("lifeOfMusicHitDiv");

	bubbleChartDivHeight = bubbleChartDiv.offsetHeight; 
	bubbleChartDivWidth = bubbleChartDiv.offsetWidth;

    let bubbleChartSVG = d3.select('#lifeOfMusicHitDiv')
    				.append("svg")
					.attr("height", 0.8 * bubbleChartDivHeight)
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
	let lineChartSVGMain = d3.select("#lineChartSVG");

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

 	//console.log(audioSVGDOM.childNodes);
	if(document.getElementById("#lineChartYAxis")==null && document.getElementById("#lineChartXAxis")==null){

		d3.select("#lineChartSVG").append("g")
		   .attr("class", "axis")
		   .attr("transform", "translate(" + 2*xPaddingForAxis + ",0)")
		   .attr("id", "lineChartYAxis")
		   .call(yAxis);

		d3.select("#lineChartSVG").append("text")
			.attr("class", "axisLabelText")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0)
	      .attr("x",0 - (svgHeight / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .text("Position on Chart"); 

		d3.select("#lineChartSVG").append("g")
		    .attr("class", "axis")
		    .attr("transform", "translate(0," + (svgHeight-1.5*yPaddingForAxis) + ")")
		    .attr("id", "lineChartXAxis")
		    .call(xAxis);

		d3.select("#lineChartSVG").append("text")
			.attr("class", "axisLabelText")
			.attr("transform",
	            "translate(" + (svgWidth/2) + " ," + 
	                           (svgHeight) + ")")
		      .style("text-anchor", "middle")
		      .text("Week");
	}

	dataList = [];
	keysList = [];

	for(var song in hmap){
		if(hmap.hasOwnProperty(song)){
			//let ob
			dataList.push(hmap[song]['positionList']);
			keysList.push(hmap[song]['trackKey']);
			//console.log(hmap[song])
		}
	}
	//console.log(keysList);
	//console.log(dataList);


	var valueline = d3.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(101-d); });

    var lines = audioSVGGroup.selectAll(".lineChartLine")
     				.data(dataList, function(d){ return d.positionList; })

     				//want to retain original songs
     				
    /*var focus = lineChartSVG.append("g") 
    .style("display", "none");*/

    var horizontalHover = d3.select("body").append("div")	
		    .attr("class", "hoverLine")				
		    .style("opacity", 0);

	var tooltip = d3.select('body').append("div")	
		    .attr("class", "lineChartTooltip")				
		    .style("opacity", 0);

    //console.log(tooltip.getBoundingClientRect().height);

	//console.log(horizontalHover);

	var yAxisPositionXPosition = document.getElementById("lineChartXAxis").getBoundingClientRect().left; 
	//console.log(yAxisPositionXPosition);



    lines.enter().append("path")
		.attr("class", "lineChartLine")
		.attr("d", valueline)
		.attr("id", function(d, i){
			//return i;
			//console.log(i);
			//console.log(keysList[i])
			return "lineChart_"+keysList[i];
		})
		.on("mouseover", function(d, i){
			//console.log(d)
			$(this).addClass("lineChartLineHover");
			//console.log(d3.mouse(this))
			//console.log(d);
			//console.log(i);

			$("#songCircle_"+keysList[i]).addClass("songCircleHovered");
			
			horizontalHover
			.attr("id", "tooltipHoverHorizontal_"+i)
			.style("opacity", .9)
			.style("left", (yAxisPositionXPosition) + "px")
			.style("top", (d3.event.pageY) + "px")
			.style("width", (d3.event.pageX - yAxisPositionXPosition) + "px");


			tooltip
			.style("opacity", .9)
			
			tooltip.attr("id", "lineChartTooltip_"+i);

			let tooltipDOM = document.getElementById("lineChartTooltip_"+i)
			let tooltipHeight = tooltipDOM.getBoundingClientRect().height;

			let songSpan = document.createElement("span");
			songSpan.innerHTML = hmap[i]['songName'] + "<br/>"; 
			songSpan.classList.add("tooltipTitle");

			let artistSpan = document.createElement("span");
			artistSpan.innerHTML = hmap[i]['artistName'] + "<br/>";
			artistSpan.classList.add("tooltipSubtitle");
			
			while(tooltipDOM.firstChild){
				tooltipDOM.removeChild(tooltipDOM.firstChild);
			}

			tooltipDOM.append(songSpan);
			tooltipDOM.append(artistSpan);

			tooltip.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - parseInt(tooltipHeight)) + "px")


			//console.log(document.getElementById("tooltipHoverHorizontal_"+i));
		})
		.on("mouseout", function(d, i){
			$(this).removeClass("lineChartLineHover");
			horizontalHover.style("opacity", 0);
			tooltip.style("opacity", 0);


			$("#songCircle_"+keysList[i]).removeClass("songCircleHovered");
		})

	/*focus.enter().append("circle")
        .attr("class", "lineCircle")
        .style("fill", "none")
        .style("stroke", "blue")
        .attr("r", 4);*/

    lines.exit().remove()

}