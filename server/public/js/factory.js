angular.module('myApp')

.factory('postDataFactory', function() {
    return {
        postData: function(data, uri) {
        	console.log(data);
            $http.post('http://shead.cloudapp.net:3000/api/News', newsObj)
			.success(function(data, status, headers, config) {
				console.log("Completed, news ID = "+data.id);
				return "success"
			})
			.error(function(data, status, headers, config) {
				console.log(data);
				return "error"
			});
        }
    };
});