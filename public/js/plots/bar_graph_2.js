var createSVG;
/* jshint -W117 */
createSVG = function(scope, element) {
  scope.w = 800;
  scope.h = 400;
  if (scope.svg == null) {
    return scope.svg = d3.select(element[0]).append("svg").attr("width", scope.w + 60).attr("height", scope.h + 60).append("g")
    .attr("transform", "translate(60 ,20 )");
  }
};

var updateGraph;

updateGraph = function(newVal, oldVal, scope) {
newVal = scope.data;
	if (scope.type === "task") {newVal = mod_chart_task(newVal);}
	else {newVal = mod_chart_status(newVal);}
scope.svg.selectAll("g").remove();
scope.svg.selectAll(".bar").remove();


var x = d3.scale.ordinal()
    .rangeRoundBands([0, 800], 0.1 , 0.5);

var y = d3.scale.linear()
    .range([400, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
 var color = d3.scale.category20();   
    
newVal.forEach(function(d) {
    d.data = +d.data;
  });
  
  var legend = scope.svg.selectAll('g').data(newVal).enter().append('g').attr('class', 'legend').attr("transform", "translate(0 ,20 )");
  
  
  legend.append('rect')
        .attr('x', scope.w - 200)
        .attr('y', function(d, i){ return i *  25;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) { 
          return color(d.status);
        });

    legend.append('text')
        .attr('x', scope.w - 188)
        .attr('y', function(d, i){ return (i *  25) + 9;})
        .text(function(d){ return d.status; });
        

 x.domain(newVal.map(function(d) { return d.status; }));
  y.domain([0, d3.max(newVal, function(d) { return d.data; })]);
  
  
  scope.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + 400 + ")")
      .call(xAxis);

  scope.svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .attr("transform", "translate(50,0)")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");
      
      
 
 
  var bars = scope.svg.selectAll(".bar")
      .data(newVal);
      
    bars.exit().remove();  
    
    bars.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.status); })
		.attr("width", x.rangeBand())
		.attr("y", scope.h)
		.attr("height", 0)
		.style("fill", function(d) { 
          return color(d.status);
        });
      

      
   bars.transition()
    .delay(function(d, i) { return i * 50; })
    .attr("y", function(d) { return y(d.data); })
    .attr("height", function(d) { return 400 - y(d.data); });
    

   
   
//.attr("transform", function(d, i) { return "translate(0,0) rotate(-45)"; }); 
     
};


