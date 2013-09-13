'use strict';
/* jshint -W117 */
// Declare app level module which depends on filters, and services

angular.module('jobcat', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'ui.bootstrap',
  'job.directives',
  'ngBreadcrumbs',
  'ngSanitize',
]).
config(function ($routeProvider) {
  $routeProvider.
    when('/general_view', {
      templateUrl: '/partials/job-list.jade',
      controller: 'MyCtrl1'
    }).
    when('/detailed_view/:jobId', {
      templateUrl: '/partials/job-detail.jade',
      controller: 'MyCtrl2'
    }).
    when('/detailed_view/:jobId/:All', {
      templateUrl: '/partials/job-detail.jade',
      controller: 'MyCtrl2'
    }).
    when('/single_view/:jobId', {
      templateUrl: '/partials/job-single.jade',
      controller: 'MyCtrl3'
    }).
    otherwise({
      redirectTo: '/general_view'
    });

 // $locationProvider.html5Mode(true);
});



/*angular.module('jobcat', ['jobServices','job.directives' ,"angular-table", "angular-tabs", 'ui.bootstrap','ui.filters',])
  .config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/jobs', {templateUrl: '/static/pages/job-list.html',   controller: JobListCtrl}).
      when('/jobs/:jobId', {templateUrl: '/static/pages/job-detail.html', controller: JobDetailCtrl}).
      otherwise({redirectTo: '/jobs'});
}])
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
}).
filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
*/