'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope) {

  }).
  controller('MyCtrl1', JobListCtrl).
  controller('MyCtrl2', JobDetailCtrl);


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
    } );


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
		};

		
	});
	    socket.on('onJobModified', function(data) {
    	
		$scope.handleModifiedJob(data);
		console.log("modified data");
		++$scope.counter;
	 	console.log("lunghe 1"+$scope.filteredData.length)
		sync_filter();
		
	});
	
	$scope.handleDeletedJob = function(id) {
	var selected ;
	for (var i=0; i<$scope.jobs.length; i++)
		{ 
		console.log(i);
		if ($scope.jobs[i].id == parseInt(id)) {selected=i};
		}
		if(selected) { $scope.jobs.splice(selected,1);}
		}
		
	$scope.handleModifiedJob = function(data) {
	var selected ;
	for (var i=0; i<$scope.jobs.length; i++)
		{ 
		
		if ($scope.jobs[i].id == parseInt(data.id)) {selected=i};
		}
		if(selected) { 
			$scope.jobs[selected] = data;
			}
		}
	 var sync_filter = function(){

	    $scope.$watch("status_filter", function(query){
	 	$scope.filteredData = 	$filter("filter")($filter("filter")($scope.jobs, $scope.task_filter), $scope.status_filter);
	 	console.log("lunghe "+$scope.filteredData.length)
		});
		$scope.$watch("task_filter", function(query){
			$scope.filteredData = $filter("filter")($filter("filter")($scope.jobs, $scope.task_filter), $scope.status_filter);     
		});
		}
	

}

function JobDetailCtrl($scope, $routeParams,  Job, socket, $location, BreadCrumbsService) {
	


  //$scope.job = job.get({jobId: $routeParams.jobId});
  console.log("$routeParams.jobId "+$routeParams.jobId);
    /*Job.get({jobId: $routeParams.jobId}, function(data) */

    Job.query({id :$routeParams.jobId, all: $routeParams.All}, function(data) {
    	
    	$scope.job_list = data;
    //console.log("got data: "+data);
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
		//$scope.job_list.push(data);
	//add hceck id job belongs to this view

		
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
		
		if ($scope.job_list[i].id == parseInt(data.id)) {selected=i};
		}
		if(selected) { 
			$scope.job_list[selected] = data;
			}
		}
		
	$scope.handleCreatedJob = function(data) {
	var selected ;
	$scope.counter = 0;	
	for (var i=0; i<$scope.job_list.length; i++)
		{ 
		
		if ($scope.job_list[i].super_id == parseInt(data.id)) {selected=i};
		}
		if(selected) { 
			$scope.job_list.push(data);
		}
		}	
	$scope.handleDeletedJob = function(id) {
	var selected ;
	for (var i=0; i<$scope.jobs_list.length; i++)
		{ 
		console.log(i);
		if ($scope.jobs_list[i].id == parseInt(id)) {selected=i};
		}
		if(selected) { $scope.jobs_list.splice(selected,1);}
		}

}


function add_col(lista) {
    lista['nbr'] = parseInt(lista['?column?']);
    return lista;
}

