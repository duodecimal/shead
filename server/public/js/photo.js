//inject angular file upload directives and services.
angular.module('myApp')

.controller('ctrlPhoto', function($scope, $http, $rootScope, $upload){
	// Check that the browser supports the FileReader API.
	if (!window.FileReader) {
		document.write('<strong>Sorry, your web browser does not support the FileReader API.</strong>');
		return;
	}

    // UPLOAD CLASS DEFINITION
    // ======================

    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');
    var exif_data;
    var files;
    document.getElementById("js-upload-files").onchange = function(e) {
        files = e.target.files;
        //console.log(files);
        handleFile(files);
        //uploadImg(files);
    }

	var handleFile = function (event) {
	    var files, reader;

	    files = event;
	    reader = new FileReader();
	    reader.onload = function (event) {
			var exif, tags, tableBody, name, row;

			try {
				exif = new ExifReader();

				// Parse the Exif tags.
				exif.load(event.target.result);
				// Or, with jDataView you would use this:
				//exif.loadView(new jDataView(event.target.result));

				// The MakerNote tag can be really large. Remove it to lower memory usage.
				exif.deleteTag('MakerNote');

				// Output the tags on the page.
				tags = exif.getAllTags();
				exif_data = tags;
				//console.log(exif_data);
				tableBody = document.getElementById('exif-table-body');
				for (name in tags) {
					if (tags.hasOwnProperty(name)) {
						row = document.createElement('tr');
						row.innerHTML = '<td>' + name + '</td><td>' + tags[name].description + '</td>';
						tableBody.appendChild(row);
					}
				}
			} catch (error) {
				alert(error);
			}
	    };
	    // We only need the start of the file for the Exif info.
	    reader.readAsArrayBuffer(files[0].slice(0, 128 * 1024));
	  };

    $scope.submitPhoto = function(){
    	
		//console.log(files);
    	var JSONObjFinal = findExif(exif_data);
    	if(JSONObjFinal != null){
   			$http.post('http://shead.cloudapp.net:3000/api/ImageMetadatas', JSONObjFinal)
			.success(function(data, status, headers, config) {
			    console.log("Status : " + status + ", save metadata complete!");
			    //console.log(data);
			    uploadImg(files, data.id);
			})
			.error(function(data, status, headers, config) {
			    
			});	
    	}
    	else{
    		console.log("No GPS data or not select file.");
    	}    
	}
    
    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';
        handleFile(e.dataTransfer.files);
        files = e.dataTransfer.files;
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

	// 	// In your main controller
	// $rootScope.$on('animStart', function($event, element, speed) {
	//     // do something
	// });

	// $rootScope.$on('animEnd', function($event, element, speed) {
	//     // do something
	// });


	// // In your state controllers
	// $scope.$on('animIn', function($event, element, speed) {
	//     // do something
	// });

	// // BROKEN see angular/angular.js#6974
	// $scope.$on('animOut', function($event, element, speed) {
	//     // do something, eg. scroll to top of page
	// });

	$scope.percent = 0;



	uploadImg = function($files, id) {
    //$files: an array of files selected, each file has name, size, and type. 
    for (var i = 0; i < $files.length; i++) {
		var file = $files[i];
	}
		//console.log(file);
		$scope.upload = $upload
		.upload({
		    url: 'http://shead.cloudapp.net:3000/api/containers/images/upload', //upload.php script, node.js route, or servlet url 
		    method: 'POST', 
		    //headers: {'header-key': 'header-value'}, 
		    //withCredentials: true, 
		    //data: {myObj: "test11111111"},
		    file: file, // or list of files ($files) for html5 only 
		    fileName: id + (file.type === "image/jpeg" ? ".jpg" : "")
		    // customize file formData name ('Content-Desposition'), server side file variable name.  
		    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'  
		    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code 
		    //formDataAppender: function(formData, key, val){} 
		  }).progress(function(evt) {
		    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		    $scope.percent = parseInt(100.0 * evt.loaded / evt.total);

		  }).success(function(data, status, headers, config) {
		    // file is uploaded successfully
		    console.log("Status : " + status + ", upload " + data.result.files.file[0].name + " complete!");
		  });
			
      //.error(...) 
      //.then(success, error, progress);  
      // access or attach event listeners to the underlying XMLHttpRequest. 
      //.xhr(function(xhr){xhr.upload.addEventListener(...)}) 
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code. 
  	// };

});