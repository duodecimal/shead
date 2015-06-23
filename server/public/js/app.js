var app = angular.module('myApp', ['ui.router', 'angularFileUpload', 'filereader', 'ngAnimate'])
.config(function($stateProvider, $urlRouterProvider){
      
    
    $stateProvider
      .state('photo', {
          url: "/photo",
          templateUrl: "templates/upload_photo.html",
          controller: "ctrlPhoto"
      }) 
      .state('video', {
          url: "/video",
          templateUrl: "templates/upload_video.html",
          controller: "ctrlVideo"
      });
      
      // .otherwise({redirectTo: '/photo'});
    $urlRouterProvider.otherwise("/photo");


})
