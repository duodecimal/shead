var app = angular.module('myApp', ['ui.router']);

app.controller('myCtrl', function($scope, $http){

  $scope.submit = function(){
    $http.post('/api/uploadFile', {msg:'hello word!'})
    .success(function(data, status, headers, config) {
      console.log(data); 
    })
    .error(function(data, status, headers, config) {
      
    });  
  }
  

});

app.config(function($stateProvider, $urlRouterProvider){
      
      // For any unmatched url, send to /route1
      $urlRouterProvider.otherwise("/photo")
      
      $stateProvider
        .state('photo', {
            url: "/photo",
            templateUrl: "templates/upload_photo.html",
            controllers: "ctrlPhoto"
        }) 
        .state('video', {
            url: "/video",
            templateUrl: "templates/upload_video.html",
            controllers: "ctrlVideo"
        })
          
});