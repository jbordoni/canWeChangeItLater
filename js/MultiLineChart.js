



function showLifeOfMusic(){
	var chartConfig = {
  data:[{
    "X": "2000",
    "Y": "200"
    }, {
    "X": "2001",
    "Y": "215"
    }, {
    "X": "2002",
    "Y": "179"
    }, {
    "X": "2003",
    "Y": "150"
    } , {
    "X": "2003",
    "Y": "134"
    }, {
    "X": "2010",
    "Y": "174"
    }]
  };

  var svgConfig = {
  id:"mySvg",
  width:600,
  height:300,
  margin : {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
    }
  };

  var bodySelection = d3.select("body");

  var svgSelection  = bodySelection.append("svg")
        .attr("id", svgConfig.id)
        .attr("width",svgConfig.width)
        .attr("height",svgConfig.height)

  xScale = d3.scaleLinear()
           .range([
               svgConfig.margin.left, svgConfig.width - svgConfig.margin.right
            ])
            .domain([
               d3.min(chartConfig.data, function(d) {return +d.X;}),
               d3.max(chartConfig.data, function(d) {return +d.X;})
            ]);


  yScale = d3.scaleLinear()
           .range([
                 svgConfig.height - svgConfig.margin.top, 
                 svgConfig.margin.bottom
            ])
           .domain([
               d3.min(chartConfig.data, function(d) {return +d.Y;}),
               d3.max(chartConfig.data, function(d) {return +d.Y;})
            ]);

  var xAxis = d3.axisBottom()
    .scale(xScale);

  var yAxis = d3.axisLeft()
    .scale(yScale);

  svgSelection.append("svg:g")
  .attr("id","xAxis")
  .call(xAxis); 

  d3.select("#xAxis")
  .attr("transform", "translate(0," + (svgConfig.height - svgConfig.margin.bottom) + ")");


  svgSelection.append("svg:g")
  .attr("id","yAxis")
  .call(yAxis);

  d3.select("#yAxis")
  .attr("transform", "translate(" + (svgConfig.margin.left) + ",0)")   

  var lineSelection = d3.line()
   .x(function(d){
    return xScale(d.X);
   })
   .y(function(d){
    return yScale(d.Y)
   });

  
  
  svgSelection.append("svg:path")
 .attr('d', lineSelection(chartConfig.data))
 .attr('stroke', 'green')
 .attr('stroke-width', 2)
 .attr('fill', 'none');


}