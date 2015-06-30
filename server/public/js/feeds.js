angular.module('myApp')

.controller('ctrlFeeds', function($scope, $http, $state){
	$scope.state = $state.current.name;
	$scope.news = [];
	$scope.numNews;
	$http.get('http://shead.cloudapp.net:3000/api/News')
	.success(function(dataNews, status, headers, config) {
		$scope.news = dataNews;
		$scope.numNews = dataNews.length;
		// var stringList = [];
		// var stringTags = "";
		// for(var i = 0 ; i < dataNews.length ; i++){
		// 	for(var j = 0 ; j < dataNews[i].tags.length ; j++){
		// 		stringTags += dataNews[i].tags[j] + ", ";
		// 		console.log("*");
		// 	}
		// 	console.log("/");
		// 	stringList.push(stringTags);
		// 	stringTags = "";
		// }
		// console.log(stringList);
	})
	.error(function(data, status, headers, config) {
		console.log(data);
	});
})


