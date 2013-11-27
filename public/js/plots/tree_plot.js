'use strict';

/* jshint -W117 */

var createSVG_classical_tree;
createSVG_classical_tree = function(scope, element) {
  scope.w = 260;
  scope.h = 900;

  if (scope.svg == null) {
    return scope.svg = d3.select(element[0]).append("svg").attr("width", scope.w).attr("height", scope.h).append("g").attr("transform", "translate(0,30)");
  }
  
};

update_classical_tree = function(newVal, oldVal,  scope) {
	scope.svg.selectAll("legend").remove();
	scope.svg.selectAll("rect").remove();
	scope.svg.selectAll("circle").remove();
	scope.svg.selectAll("text").remove();
	scope.svg.selectAll("g").remove();
	var     i = 0,
    barHeight = 20,
    barWidth = scope.w * 0.8,
    duration = 400,

    source = tree_dict_from_flatten(scope.data[0],[],scope.data)[0];
source.x0 = 0;
source.y0 = 0;
	var color = d3.scale.category20();	
	var tree = d3.layout.tree()
    .size([scope.h, 50]);
    var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });
	var nodes = tree.nodes(tree_dict_from_flatten(scope.data[0],[],scope.data)[0]);

    nodes.forEach(function(n, i) {
      n.x = i * barHeight;
    });
      // Update the nodes…
  var node = scope.svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });
  
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function() { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 1e-6);

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("svg:rect")
      .attr("y", -barHeight / 2)
      .attr("height", barHeight)
      .attr("width", barWidth)
      .style("fill", color)
      .on("click", click);
  
  nodeEnter.append("svg:text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text(function(d) { return d.name + " " + d.id + " " + d.status; });
      // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);
  
  node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
    .select("rect")
      .style("fill", color);
  
  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("transform", function() { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 1e-6)
      .remove();
  
  // Update the links…
  var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });
  
  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function() {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);
  
  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);
      

     
  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function() {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();
  
  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
	

};