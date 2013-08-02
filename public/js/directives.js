'use strict';
/* jshint -W117 */
/* Directives */

angular.module('job.directives', []).directive('scVisualization1', [
  function() {
    return {
      restrict: 'E',
      scope: {
        data: '=data',
		type : '=',
		counter : '=',
      },
		link: function(scope, element) {
		createSVG_pie(scope, element);
		return scope.$watch('data+type+counter',  updateGraph_pie, true);
		}
	};
	}
])
.directive('scVisualization2', [
	function() {
	return {
	restrict: 'E',
	scope: {
	data: '=data',
	type : '=',
	},
	link: function(scope, element) {
	createSVG(scope, element);
	return scope.$watch('data+type', updateGraph, true);
	}
	};
	}
])
.directive('scVisualization3', [
	function() {
	return {
		restrict: 'E',
		scope: {
			data: '=data',
			type : '=',
			counter : '=',
	},
	link: function(scope, element) {
	createSVG_mv_p(scope, element);
	return scope.$watch('data+type+counter', updateGraph_mv_p, true);
	}
	};
	}
])
.directive('scVisualization4', [
  function() {
    return {
      restrict: 'E',
      scope: {
        data: '=data',
        type : '=',
        counter : '=',
 
      },
      link: function(scope, element) {
        createSVG_Zoom(scope, element);
        
        return scope.$watch('data+type+counter', update_Zoom_tree, true);
      }
    };
  }
])
.directive('scVisualization5', [
  function() {
    return {
      restrict: 'E',
      scope: {
        data: '=data',
        type : '=',
        counter : '=',
 
      },
      link: function(scope, element) {
        createSVG_Force(scope, element);
        
        return scope.$watch('data+type+counter', update_force_tree, true);
      }
    };
  }
])
.directive('scVisualization6', [
  function() {
    return {
      restrict: 'E',
      scope: {
        data: '=data',
        type : '=',
        counter : '=',
 
      },
      link: function(scope, element) {
		createSVG_classical_tree(scope, element);
		return scope.$watch('data+type+counter', update_classical_tree, true);
      }
    };
  }
]);
