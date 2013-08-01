angular.module('ngBreadcrumbs', []).factory('BreadCrumbsService', function($rootScope, $log) {
    var data = {};
    var ensureIdIsRegistered = function(id) {
        if (angular.isUndefined(data[id])) {
            data[id] = [];
        }
    };
    var exist = function(item,id){
            var hasPath = false;
            for(var i = 0; i < data[id].length;i++){
                if(data[id][i].href === item.href ){
                    hasPath = true;
                    break;
                }
            }
            if(!hasPath){
                data[id].push(item);
            }
        }
    return {
        push: function(id, item) {
            ensureIdIsRegistered(id);
            exist(item,id);
            $log.log( "$broadcast" );
            $rootScope.$broadcast( 'breadcrumbsRefresh',{id :id} );
        },
        get: function(id) {
            ensureIdIsRegistered(id);
            return angular.copy(data[id]);
        },
        setLastIndex: function( id, idx ) {
            ensureIdIsRegistered(id);
            if ( data[id].length > 1+idx ) {
                data[id].splice( 1+idx, data[id].length - idx );
            }
        }
    };
})
.directive('breadCrumbs', function($log, BreadCrumbsService) {
    return {
        restrict: 'A',
        template: '<p></p>',
        replace: true,
        compile: function(tElement, tAttrs) {
            return function($scope, $elem, $attr) {
                var bc_id = $attr['id'],
                    resetCrumbs = function() {
                        $scope.breadcrumbs = [];
                        angular.forEach(BreadCrumbsService.get(bc_id), function(v) {
                            $scope.breadcrumbs.push(v);
                        });
                    };
                resetCrumbs();
                $scope.unregisterBreadCrumb = function( index ) {
                    BreadCrumbsService.setLastIndex( bc_id, index );
                    resetCrumbs();
                };
                $scope.$on( 'breadcrumbsRefresh', function() {
                    $log.log( "$on" );
                    resetCrumbs();
                    $log.log( "lunghezza breads "+$scope.breadcrumbs.length );
                } );
            }
        }
    };

})
;