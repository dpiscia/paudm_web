/* jshint -W117 */

createSVG_Force = function(scope, element) {
  scope.w = 800;
  scope.h = 500;
  scope.force = d3.layout.force()
  .charge(function(d) { return d._children ? -d.size / 100 : -30; })
    .linkDistance(function(d) { return d.target._children ? 80 : 30; })
    .size([scope.w, scope.h - 160]);
 
  if (scope.svg == null) {
    return scope.svg = d3.select(element[0]).append("svg:svg").attr("width", scope.w).attr("height", scope.h);
    
  }

};

update_force_tree = function(newVal, oldVal,  scope) {      
		scope.svg.selectAll("legend").remove();
	scope.svg.selectAll("rect").remove();
	scope.svg.selectAll("circle").remove();
	scope.svg.selectAll("text").remove();
	scope.svg.selectAll("g").remove();      
var node,
    link,
    root;
var color = d3.scale.category20();    
    
  root = tree_dict_from_flatten(scope.data[0],[],scope.data)[0];
  root.fixed = true;
  root.x = scope.w / 2;
  root.y = scope.h / 2 - 80;  
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);
  var legend = scope.svg.selectAll('g')
			.data(function() {if (scope.type === 'task' ) {return group_task(scope.data);}
			else {return group_status(scope.data);}})
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
  // Restart the force layout.
  scope.force
      .nodes(nodes)
      .links(links)
      .start();
        
  // Update the links…
  link = scope.svg.selectAll("line.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links.
  link.enter().insert("svg:line", ".node")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
                .style('stroke-width', 3)
          .attr("marker-end", "url(#end)");

  // Exit any old links.
  link.exit().remove();

  // Update the nodes…
  node = scope.svg.selectAll("circle.node")
      .data(nodes, function(d) { return d.id; })
      .style("fill", function(d) {if (scope.type === 'task' ) 
      {return color(d.name);} else {return color(d.status);}})
      .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 5)
      .style("fill", function(d) {if (scope.type === 'task' ) {return color(d.name);} else {return color(d.status);}})
      .on("click", function(d){
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update_force_tree(newVal,oldVal,scope);
})
      .call(scope.force.drag);

      node.append('svg:title')
          .text(function(d) { return d.name; });
      node.append("text")
            .text(function(d) { return d.name; })
            .style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

  // Exit any old nodes.
  //node.exit().remove();
  
  scope.force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
};



/*function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}*/


// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) {node.children.forEach(recurse);}
    if (!node.id) {node.id = ++i;}
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}



/*function mouseover() {
  d3.select(this).transition()
      .duration(750)
      .attr("r", 10);
}

function mouseout() {
  d3.select(this).transition()
      .duration(750)
      .attr("r", 5);
}*/