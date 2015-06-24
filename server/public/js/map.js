angular.module('myApp')

.controller('ctrlMap', function($scope, $http, $timeout, uiGmapGoogleMapApi){
  $scope.markers = [];
  $http.get('http://shead.cloudapp.net:3000/api/News')
  .success(function(data, status, headers, config) {
    //console.log(data);
    createMarker(data);
  })
  .error(function(data, status, headers, config) {

  });

  $scope.alert = function(){
    alert("test");
  }

  //uiGmapGoogleMapApi.then(function(maps) {

  function createMarker(data){
      var marker;
      for(var i = 0 ; i < data.length ; i++){
          marker = {
          id: data[i].id,
          coords: {
            latitude: data[i].loc.coordinates[1],
            longitude: data[i].loc.coordinates[0]
          },
          title: data[i].title,
          options: {
            draggable: false ,
            animation: google.maps.Animation.DROP,
            title: data[i].title,
            index: i
          },
          events: {
            click: function (marker, eventName, args) {
              infowindow = new google.maps.InfoWindow({
                  content: marker.title,
                  maxWidth: 200
              });
              infowindow.open(this.map, marker);
            }
          }
        };
        $scope.markers.push(marker);
      }
      //console.log($scope.markers);
  }



    $scope.getCurrentLocation = function(){
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
      $scope.map.zoom = 14;
    }

    $scope.map = {
      center: {
        latitude: 13.7558732, 
        longitude: 100.53209509999999 
      },
      zoom: 10,
      bounds: {}
    };

    $scope.options = {
      scrollwheel: true
    };

    function onSuccess(position) {
      $scope.map.center = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      //$scope.$apply();
    }

    function onError(error) {
        console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };


});