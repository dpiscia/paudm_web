'use strict';

/* jshint -W117 */
/* jshint -W116 */
createSVG_Zoom = function(scope, element) {
  scope.w = 800;
  scope.h = 600;
  scope.r = 500;

  if (scope.svg == null) {
    return scope.svg = d3.select(element[0]).append("svg").attr("width", scope.w).attr("height", scope.h).append("g").attr("transform", "translate(" + (scope.w -scope.r ) / 2 + "," + (scope.h - scope.r) / 2 + ")");
  }
  
};

update_Zoom_tree = function(newVal, oldVal,  scope) {
	scope.svg.selectAll("legend").remove();
	scope.svg.selectAll("rect").remove();
	scope.svg.selectAll("circle").remove();
	scope.svg.selectAll("text").remove();
	scope.svg.selectAll("g").remove();
var x = d3.scale.linear().range([0, scope.r]),
    y = d3.scale.linear().range([0, scope.r]),
    node,
    root;	
root = tree_dict_from_flatten(scope.data[0],[],scope.data)[0];
var color = d3.scale.category20();	
var pack = d3.layout.pack()
    .size([scope.r, scope.r])
    .value(function(d) { return d.size; });
    
   var nodes = pack.nodes(tree_dict_from_flatten(scope.data[0],[],scope.data)[0]); 
var legend = scope.svg.selectAll('g')
			.data(function() {if (scope.type === 'task' ) return group_task(scope.data); else return group_status(scope.data);})
			.enter().append('g').attr('class', 'legend').attr("transform", "translate(0 ,20 )");
  
  legend.append('rect')
        .attr('x', scope.w - 300)
        .attr('y', function(d, i){ return i *  25;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) { 
          return color(d);
        });

    legend.append('text')
        .attr('x', scope.w - 288)
        .attr('y', function(d, i){ return (i *  25) + 9;})
        .text(function(d){ return d; });
        

  scope.svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("cx", function(d) { 
		return d.x; })
      .attr("cy", function(d) { 
		return d.y; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) {if (scope.type === 'task' ) return color(d.name); else return color(d.status);})
      .on("click", function(d) { return zoom(node === d ? root : d); });

  scope.svg.selectAll("text")
      .data(nodes)
    .enter().append("text")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
      .text(function(d) { return d.id; })
      .attr("class","plot");

  //d3.select(window).on("click", function() { zoom(root); });


function zoom(d) {
  var k = scope.r / d.r / 2;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);

  var t = scope.svg.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  t.selectAll("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", function(d) { return k * d.r; });

  t.selectAll("text.plot")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .style("opacity", function(d) { return k * d.r ; });

  node = d;
  d3.event.stopPropagation();
}	
	
};


