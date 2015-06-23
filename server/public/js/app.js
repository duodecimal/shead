var app = angular.module('myApp', ['ui.router', 'angularFileUpload', 'filereader', 'ngAnimate', 'uiGmapgoogle-maps']);
app.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider){
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
      })
      .state('map', {
          url: "/map",
          templateUrl: "templates/map.html",
          controller: "ctrlMap"
      });
      
    $urlRouterProvider.otherwise("/photo");

    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})
