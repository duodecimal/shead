//inject angular file upload directives and services.
var app = angular.module('myApp', []);

app.controller('ctrlVideo', function($scope, $http){

	var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');

    document.getElementById("js-upload-files").onchange = function(e) {
        handleFile(e.target.files);
    }

    var handleFile = function (event) {
    	console.log(event);
    }

    $scope.submit = function(){
    	   
	}
    
    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';
        handleFile(e.dataTransfer.files);
    }

    dropZone.ondragover = function() {
        this.className = 'upload-drop-zone drop';
        return false;
    }

    dropZone.ondragleave = function() {
        this.className = 'upload-drop-zone';
        return false;
    }

    $scope.go = function(path) {
  		$location.path(path);
	};

});