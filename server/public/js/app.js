var app = angular.module('myApp', [
  'ui.router', 'angularFileUpload', 'filereader', 'ngAnimate', 'uiGmapgoogle-maps', 
  'angular-loading-bar'
]);
//, 'cp.ng.fix-image-orientation'
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
      })
      .state('feeds', {
          url: "/feeds",
          templateUrl: "templates/feeds.html",
          controller: "ctrlFeeds"
      });
      
    $urlRouterProvider.otherwise("/feeds");

    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})

app.directive('header', function () {
    return {
        // restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        // replace: true,
        templateUrl: "/directives/header.html"
        // controller: ['$scope', '$filter', function ($scope, $filter) {
        //     // Your behaviour goes here :)
        //}]
    }
});

app.directive('footer', function () {
    return {
        // restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        // replace: true,
        templateUrl: "/directives/footer.html"
        // controller: ['$scope', '$filter', function ($scope, $filter) {
        //     // Your behaviour goes here :)
        //}]
    }
});