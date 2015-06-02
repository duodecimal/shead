var app = angular.module('myApp', ['ui.router']);

app.controller('myCtrl', function($scope, $http, $location){
	$http.get('http://localhost:3000').success(function(data) {
        $scope.stuff = data;
    });
});

app.config(function($stateProvider, $urlRouterProvider){
      
      // For any unmatched url, send to /route1
      $urlRouterProvider.otherwise("/route1")
      
      $stateProvider
        .state('route1', {
            url: "/route1",
            templateUrl: "templates/route1.html"
        })
          .state('route1.list', {
              url: "/list",
              templateUrl: "templates/route1.list.html",
              controller: function($scope){
                $scope.items = ["A", "List", "Of", "Items"];
              }
          })
          
        .state('route2', {
            url: "/route2",
            templateUrl: "templates/route2.html"
        })
          .state('route2.list', {
              url: "/list",
              templateUrl: "templates/route2.list.html",
              controller: function($scope){
                $scope.things = ["A", "Set", "Of", "Things"];
              }
  	       })
});