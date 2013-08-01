var createSVG;

createSVG_pie = function(scope, element) {
  scope.w = 800;
  scope.h = 400;
  var legend = d3.select("body").append("svg")
  if (scope.svg == null) {
    return scope.svg = d3.select(element[0]).append("svg").attr("width", scope.w).attr("height", scope.h);
  }
  
};

var updateBarAttr, updateGraph, updateTextAttr;

updateGraph_pie = function(newVal, oldVal,  scope) {
	scope.svg.selectAll('g.legend').remove();
	scope.svg.selectAll('g.state').remove();
	scope.svg.selectAll(".arc").remove(); 
	console.log("pie chart");
	  var radius  =200;
	  console.log(newVal.length);
	
	if (scope.type == "task") {newVal = mod_chart_task(scope.data);}
	else {newVal = mod_chart_status(scope.data);}
	    
	var radius = Math.min(scope.w, scope.h) / 2;
	var color = d3.scale.category20();


var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.data; });


  
      
newVal.forEach(function(d) {
    d.data = +d.data;
    
  });
  
  var legend = scope.svg.selectAll('g').data(pie(newVal)).enter().append('g').attr('class', 'legend').attr("transform", "translate(0 ,20 )");
  
  legend.append('rect')
        .attr('x', scope.w - 200)
        .attr('y', function(d, i){ return i *  25;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) { 
          return color(d.data.status);
        });

    legend.append('text')
        .attr('x', scope.w - 188)
        .attr('y', function(d, i){ return (i *  25) + 9;})
        .text(function(d){ return d.data.status; });
        
        
    var g = scope.svg.selectAll(".arc")
      .data(pie(newVal));
    
     g.exit().remove();
     
    g.enter().append("g")
    .attr("transform", "translate(400 ,200 )")
      .attr("class", "arc");

  var path = g.append("path")
      .attr("d", arc)
      .style("fill",  function(d) { 
          return color(d.data.status);
        })
      .each(function(d) { this._current = d; }); // redraw the arcs
   
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.status; });
      

     
};



