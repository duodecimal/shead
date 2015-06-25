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
      var infowindow = [];
      //console.log(data);
      for(var i = 0 ; i < data.length ; i++){
        infowindow[i] = new google.maps.InfoWindow();
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
            index: i,
            id: data[i].id,
            created: data[i].created,
            type: data[i].type,
            updated: data[i].updated,
            tags: data[i].tags,
            loc: data[i].loc,
            assets: data[i].assets
          },
          events: {
            click: function (marker, eventName, args) {
              var stringImg = "";
              for(var i = 0 ; i <  marker.assets.length ; i++){
                stringImg += "<img style='padding:2px;width:150px;' src='"+marker.assets[i].imageDownloadURL+"'>";
              }
              //console.log(stringImg);
              contentString = '<h4>'+marker.title+'</h4>'+
                              '<br>'+stringImg+'<br>'+
                              '<b>Tags</b>: '+marker.tags+'<br>'+
                              '<b>Created</b>: '+marker.created+'<br>'+
                              '<b>Updated</b>: '+marker.updated;
                              
              //console.log(marker.assets[0].imageDownloadURL);
              infowindow[marker.index].setContent(contentString);
              infowindow[marker.index].setOptions({maxWidth: 500});
              infowindow[marker.index].open(this.map, marker);

              google.maps.event.addListener(infowindow[marker.index], 'closeclick', function(){
                //console.log("close");
              });

              infowindow[marker.index].setZIndex(99);
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