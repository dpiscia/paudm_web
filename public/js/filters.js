'use strict';
/* jshint -W117 */
/* jshint -W065 */
/* Filters */

angular.module('myApp.filters', []).filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var newItems = [];
      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
})
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
}).
filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      {input.push(i);}
    return input;
  };
}).filter('nl2p', function () {
    return function(text){
        text = String(text).trim();
        text = text.replace(/\n|\r/g, '</p><p>');
        return (text.length > 0 ? '<p>' + text.replace(/\s/g, '&nbsp;') + '</p>' : null);
    };
}).filter('job_check', function () {
    return function(arrays,job_id){
    var arrayToReturn = []; 
    if (job_id === undefined  || job_id === "!!") {
        return arrays; }
        else
        {
        for (var i=0; i<arrays.length; i++){
            for (var j=0; j<arrays[i].array.length; j++){
	            if (arrays[i].id === parseInt(job_id) || arrays[i].array[j] === parseInt(job_id) ) {
	                arrayToReturn.push(arrays[i]);
	                console.log(arrays[i].id);
				}
            }
            
        }
        return arrayToReturn;}
        
    };
});