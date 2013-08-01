angular.module('services.breadcrumbs', []);
angular.module('services.breadcrumbs').factory('breadcrumbs', ['$rootScope', '$location', function($rootScope, $location){
 
  var breadcrumbs = [];
  var breadcrumbsService = {};
 
  //we want to update breadcrumbs only when a route is actually changed
  //as $location.path() will get updated imediatelly (even if route change fails!)
  $rootScope.$on('$routeChangeSuccess', function(event, current){
 
    breadcrumbs.push({"path" : "#"+$location.path(), name : $location.path() });
  });
 
  breadcrumbsService.getAll = function() {
    return breadcrumbs;
  };
 
  breadcrumbsService.getFirst = function() {
    return breadcrumbs[0] || {};
  };
 
  return breadcrumbsService;
}]);