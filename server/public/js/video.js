//inject angular file upload directives and services.
angular.module('myApp')

.controller('ctrlVideo', function($scope, $http){
    var tmp;

    // document.getElementById("js-upload-files").onchange = function(e) {
    //     tmp = e;
    //     //console.log(tmp.target.files);
    //     submitVideo(tmp.target.files);
    // }
    var dataUpload;
    $scope.showContent = function($fileContent){
        dataUpload = $fileContent;
        console.log(dataUpload);
    };

    

    $scope.submitVideo = function(){
        //console.log(dataUpload);
        $http.post('/api/uploadFile', dataUpload)
        .success(function(data, status, headers, config) {
          //console.log(data); 
          console.log(status);
        })
        .error(function(data, status, headers, config) {
          
        });  
    }

	var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');

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

})

.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();
                
                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent:onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});