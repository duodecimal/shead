var app = angular.module('myApp', ['ui.router', 'angularFileUpload', 'filereader'])
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

    $urlRouterProvider.otherwise("/photo");


})