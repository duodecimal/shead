var app = angular.module('myApp', ['ui.router', 'angularFileUpload', 'ui.thumbnail', 'filereader'])
.config(function($stateProvider, $urlRouterProvider, ThumbnailServiceProvider){
      
    
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
    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/photo");
         
    // ThumbnailServiceProvider.defaults.width = 150;
    // ThumbnailServiceProvider.defaults.height = 150;



})