var createSVG;

createSVG_mv_p = function(scope, element) {
	var margin = {top: 20, right: 80, bottom: 30, left: 50};
    scope.w = 960 - margin.left - margin.right,
    scope.h = 400 - margin.top - margin.bottom;

  
  if (scope.svg == null) {
// 	var legend = d3.select("body").append("svg")
    return scope.svg = d3.select(element[0]).append("svg").attr("width", scope.w + margin.left + margin.right ).attr("height", scope.h + margin.top + margin.bottom).append("g")
    .attr("transform", "translate(50 ,20 )");
  }
  
};

var updateBarAttr;

updateGraph_mv_p = function(newVal, oldVal,  scope) {
	//without console.log does not work, why?
	scope.svg.selectAll("path").remove();
	scope.svg.selectAll('g.legend').remove();
	scope.svg.selectAll('g.state').remove();
	
	scope.svg.selectAll(".y.axis").remove();
    scope.svg.selectAll(".x.axis").remove();
	//scope.svg.selectAll(".legend").remove();
	
	console.log("change graph",scope.data.length);
	if (scope.type == "task") {var data = mod_plot_task(scope.data);}
	else {data = mod_plot_status(scope.data);} 
	//var data = mod_plot(scope.data);
	
	//var data = mod_plot_task(scope.data);
var x = d3.time.scale()
    .range([0, scope.w]);

var y = d3.scale.linear()
    .range([scope.h, 0]);

var color = d3.scale.category10();


    
var formatyAxis = d3.format('.0f');



var line = d3.svg.line()
    .interpolate("step-after")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.counts); });

//color.domain(["CREATED","QUEUED", "STARTED", "FAILED", "DONE"]);
 color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));


data.forEach(function(d) {
    d.date = d.date;
    
  });
var status = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, counts: +d[name]};
      })
    };
  });
    x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(status, function(c) { return d3.min(c.values, function(v) { return v.counts; }); }),
    d3.max(status, function(c) { return d3.max(c.values, function(v) { return v.counts; }); })
  ]);
    var y_max = y.domain().slice(-1)[0]
    var x_max = x.domain().slice(-1)[0]
   // scope.svg.selectAll('g').exit().remove();
   // scope.svg.selectAll("rect").remove();
   // scope.svg.selectAll("text").remove();
 var legend = scope.svg.selectAll('g')
        .data(status)
        .enter()
        .append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', scope.w - 20)
        .attr('y', function(d, i){ return i *  20;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) { 
          return color(d.name);
        });

    legend.append('text')
        .attr('x', scope.w - 8)
        .attr('y', function(d, i){ return (i *  20) + 9;})
        .text(function(d){ return d.name; });
     

     
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.time.format("%X"))
    .orient("bottom"); 
    
       
    scope.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + scope.h + ")")
      .call(xAxis);
       
  scope.svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");
      
      
      var state = scope.svg.selectAll(".state")
      .data(status)
      
      
      
      
      state.enter().append("g")
      .attr("class", "state");

		
		
  state.append("path")
      .attr("class", "line")
      .attr("d", function(d) { 
      	return line(d.values); })

      .style("stroke", function(d) { return color(d.name); })
      .style("stroke-width", 2);


     
      

};

