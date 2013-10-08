'use strict';
/* jshint -W117 */
/* jshint -W098 */
/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function () {
}).
	controller('MyCtrl1', JobListCtrl).
	controller('MyCtrl2', JobDetailCtrl).
	controller('MyCtrl3', JobSingleCtrl);
function JobListCtrl($scope, $filter, $timeout,  Job, socket, $location, BreadCrumbsService) {
	BreadCrumbsService.push("home",
	{
	href: '#/',
	label: 'General view'
	});
	$scope.task_filter = "";
	$scope.status_filter = "";
	$scope.counter = 0;
	Job.query({}, function(data){
	//1.callback on d3.plot, in the future implement on promise
	//2. implement callback on failure
	$scope.jobs = data;
	
	console.log('success, got data: ');
	sync_filter();
	});
// dynamic selection of chart type /content
	$scope.items = ['pie_chart', 'bar_chart', 'other'];
	$scope.selection = $scope.items[0];
	$scope.type_tasks = ["task",'status'];
	$scope.type_task = $scope.type_tasks[1];
	$scope.$watch("query.$", function(query){
	$scope.filteredData = $filter("filter")($scope.jobs, query);
	});	 
//used in table pagination and ordering and filtering
	//$scope.watch to be substitued by watch-collection in the future
	$scope.numberOfPages=function() {
		return Math.ceil($scope.filteredData.length/$scope.pageSize);                
	};
	$scope.orderProp = '-id';
    $scope.currentPage = 0;
	$scope.pageSize = 15;
	$scope.setPage = function () {
		$scope.currentPage = this.n;
	};
	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};
	$scope.nextPage = function () {
		if ($scope.currentPage < $scope.numberOfPages() - 1) {
			$scope.currentPage++;
		}
	};     
	socket.on('onJobDeleted', function(data) {
		$scope.handleDeletedJob(data);
		sync_filter();
	});
	socket.on('onJobCreated', function(data) {
	$scope.counter = 0;
	if (data.super_id == null) {$scope.jobs.push(data);
		sync_filter();
	}	
	});
	socket.on('onJobModified', function(data) {
    $scope.handleModifiedJob(data);
	console.log("modified data");
	++$scope.counter;
	
	sync_filter();
	});
	$scope.handleDeletedJob = function(id) {
	var selected ;
	for (var i=0; i<$scope.jobs.length; i++)
		{ 
		console.log(i);
		if ($scope.jobs[i].id === parseInt(id,radix)) {selected=i;}
		}
		if(selected) { $scope.jobs.splice(selected,1);}
	};
	$scope.handleModifiedJob = function(data) {
	var selected ;
	for (var i=0; i<$scope.jobs.length; i++)
		{ 
		if ($scope.jobs[i].id === parseInt(data.id,radix)) {selected=i;}
		}
		if(selected) { 
			$scope.jobs[selected] = data;
			}
	};
	var sync_filter = function(){
		$scope.$watch("status_filter", function(){
		$scope.filteredData = $filter("filter")($filter("filter")($scope.jobs, $scope.task_filter), $scope.status_filter);
		});
		$scope.$watch("task_filter", function(){
		$scope.filteredData = $filter("filter")($filter("filter")($scope.jobs, $scope.task_filter), $scope.status_filter);     
		});
	};
}
function JobDetailCtrl($scope, $routeParams,  Job, socket, $location, BreadCrumbsService) {
	Job.query({id :$routeParams.jobId, all: $routeParams.All}, function(data) {
    $scope.job_list = data;
	BreadCrumbsService.push("home",
	{
	href: '#/detailed_view/'+$routeParams.jobId,
	label: data[0].task+"-"+$routeParams.jobId
    });
	});
	$scope.items = ['pie_chart', 'bar_chart', 'evolution'];
	$scope.selection = $scope.items[0];
	$scope.type_tasks = ["task",'status'];
	$scope.type_task = $scope.type_tasks[1];
	socket.on('onJobCreated', function(data) {
	$scope.handleCreatedJob(data);
	});
	socket.on('onJobModified', function(data) {
	$scope.handleModifiedJob(data);
	console.log("modified data");
	++$scope.counter;
	});
	socket.on('onJobDeleted', function(data) {
		$scope.handleDeletedJob(data);
	});
	$scope.handleModifiedJob = function(data) {
	var selected ;
	$scope.counter = 0;	
	for (var i=0; i<$scope.job_list.length; i++)
		{ 
		if ($scope.job_list[i].id === parseInt(data.id,radix)) 
			{selected=i;}
		}
		if(selected) { 
			$scope.job_list[selected] = data;
			}
	};
	$scope.handleCreatedJob = function(data) {
	var selected ;
	$scope.counter = 0;	
	for (var i=0; i<$scope.job_list.length; i++)
		{ 
		if ($scope.job_list[i].super_id === parseInt(data.id,radix)) {selected=i;}
			}
		if(selected) { 
			$scope.job_list.push(data);
			}
		};	
	$scope.handleDeletedJob = function(id) {
	var selected ;
	for (var i=0; i<$scope.jobs_list.length; i++)
		{ 
		console.log(i);
		if ($scope.jobs_list[i].id === parseInt(id,radix)) {selected=i;}
		}
		if(selected) { $scope.jobs_list.splice(selected,1);}
	};

}
var ModalInstanceCtrl = function ($scope, $modalInstance, items) {


  $scope.plot_name = items;	
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

function JobSingleCtrl($scope, $routeParams,  Job, socket,QC, $filter, BreadCrumbsService, $modal) {
	Job.query({id :$routeParams.jobId, all: 0}, function(data) {
    $scope.job = data[0];
         BreadCrumbsService.push("home",
	{
	href: '#/single_view/'+$routeParams.jobId,
	label: 'view'+"-"+$routeParams.jobId
    });
});

	QC.query({id :$routeParams.jobId}, function(data) {
    $scope.quality_controls = data;

});
      $scope.img = "prova.jpg";	
      $scope.open = function (name) {
      $scope.img = name;
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
       items: function () {
          return $scope.img;
        }
      }
    });
  };
}




