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


