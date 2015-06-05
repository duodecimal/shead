//inject angular file upload directives and services.
angular.module('myApp')

.controller('ctrlPhoto', function($scope, $http, $rootScope, $upload, $timeout, $interval){
	// Check that the browser supports the FileReader API.
	if (!window.FileReader) {
		document.write('<strong>Sorry, your web browser does not support the FileReader API.</strong>');
		return;
	}

    // UPLOAD CLASS DEFINITION
    // ======================

    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');
    var files;
    var exif_data;
    var listOfEXIF = [];
    var JSONObjFinal;
    var listOfJSONFinal = [];
    var centerOfList = [];
    var idList = [];
    var listOfGPSEachFile = [];
    var listOfGPSNearEachFile = [];
    var checkTotalHaveToClose = true;
    var maxDistance = 25;
    var tempArrayImg = [];

	$scope.totalFiles = 0;
    $scope.listImgThumb = [];
    $scope.percent = 0;
    $scope.progress = 0;
    $scope.isDisable = false;
    $scope.processedCount= 0;

    // $scope.listImgThumb.push("test1");
    // $scope.listImgThumb.push("test2");
    // $scope.listImgThumb.push("test3");

    document.getElementById("js-upload-files").onclick = function(e) {
    	listOfEXIF = [];
    	listOfJSONFinal = [];
    	centerOfList = [];
    	idList = [];
    	listOfGPSEachFile = [];
    	checkTotalHaveToClose = true;
    	$scope.processedCount= 0;
		$scope.totalFiles = 0;
    }

    document.getElementById("js-upload-files").onchange = function(e) {
        files = e.target.files;
    	//console.log(files);
        //handleFile(files);	
        //uploadImg(files);
        if(files.length != 0){
        	for (var i = 0; i < files.length; i++) {
		    handleFile(files[i], i);
			}
			$timeout(function() {
				checkNearBy();
				showThumbnail(e);
			}, 1000);	
			//console.log(files);
			//console.log(e);
			//showThumbnail(e);
        }
        else{
        	listOfEXIF = [];
        }
    }

	function handleFile(file, i) {
	    var reader = new FileReader();  
	    var exif;
	    reader.onload = function(e) {  
	       try {
		        // get file content  
		        var text = e.target.result; 
		        //console.log(text);

		        exif = new ExifReader();
				// Parse the Exif tags.
				exif.load(e.target.result);

				// Or, with jDataView you would use this:
				//exif.loadView(new jDataView(event.target.result));

				// The MakerNote tag can be really large. Remove it to lower memory usage.
				exif.deleteTag('MakerNote');
				exif_data = exif.getAllTags();
				//console.log(exif_data);
				listOfEXIF.push(exif_data);
				//showDataInTable(exif_data);
			} catch (error) {
				alert(error);
			}
	    }
	    //reader.readAsText(file, "UTF-8");

    	reader.readAsArrayBuffer(files[i].slice(0, 128 * 1024));	
	}

	

	showDataInTable = function(tags){
		var tableBody, name, row;
		tableBody = document.getElementById('exif-table-body');
		for (name in tags) {
			if (tags.hasOwnProperty(name)) {
				row = document.createElement('tr');
				row.innerHTML = '<td>' + name + '</td><td>' + tags[name].description + '</td>';
				tableBody.appendChild(row);
			}
		}
	}

    $scope.submitPhoto = function(){
    	$scope.isDisable = true;
    	//console.log(listOfEXIF);
    	for(var i = 0 ; i < listOfEXIF.length ; i++){
    		listOfJSONFinal.push(findExif(listOfEXIF[i]));
    	}

		//console.log(listOfJSONFinal);

    	if(listOfJSONFinal != null && checkTotalHaveToClose && listOfEXIF.length != 0){
   			$http.post('http://shead.cloudapp.net:3000/api/ImageMetadatas', listOfJSONFinal)
			.success(function(data, status, headers, config) {
			    //console.log("Status : " + status + ", save metadata complete!");
			    for(var i = 0 ; i < data.length ; i++){
			    	console.log("Status : " + status + ", ID : "+data[i].id+", save metadata complete!");
			    	idList.push(data[i].id);
			    }
			    	uploadImg(idList); 
			})
			.error(function(data, status, headers, config) {
			    
			});
			
    	}
    	else{
    		console.log("No GPS data or not select file.");
    		$scope.isDisable = false;
    	}

	}
    
    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';
        //handleFile(e.dataTransfer.files);
        files = e.dataTransfer.files;
        if(files.length != 0){
	        for (var i = 0; i < files.length; i++) {
			    handleFile(files[i], i);
			}
			$timeout(function() {
					checkNearBy();
			}, 10);	
			//console.log(files);
			//console.log(e);
			showThumbnail(e);
		}
		else{
        	listOfEXIF = [];
        }
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

	
	uploadImg = function(idList) {
	    //$files: an array of files selected, each file has name, size, and type. 

	    //var file = $files;
		//console.log($files, id);
		var fileList = [];
		var nameList = [];
		//console.log(idList);

		//console.log(files);
		for(var i = 0 ; i < files.length ; i++){
			fileList.push(files[i]);
			nameList.push(idList[i] + (files[i].type === "image/jpeg" ? ".jpg" : ""));
		}
		//console.log(fileList);
		//console.log(nameList);

		$scope.upload = $upload
		.upload({
		    url: 'http://shead.cloudapp.net:3000/api/containers/images/upload', //upload.php script, node.js route, or servlet url 
		    method: 'POST', 
		    //headers: {'header-key': 'header-value'}, 
		    //withCredentials: true, 
		    //data: {myObj: "test11111111"},
		    file: fileList, // or list of files ($files) for html5 only 
		    //fileName: id + (file.type === "image/jpeg" ? ".jpg" : "")
		    fileName: nameList,
		    // customize file formData name ('Content-Desposition'), server side file variable name.  
		    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'  
		    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code 
		    //formDataAppender: function(formData, key, val){} 
		  }).progress(function(evt) {
		    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		    $scope.percent = parseInt(100.0 * evt.loaded / evt.total);
		    //console.log($scope.percent);
		    //console.log(evt);
		  }).success(function(data, status, headers, config) {
		    // file is uploaded successfully
		    for(var i = 0 ; i < data.result.files.file.length ; i++){
		    	console.log("Status : " + status + ", upload " + data.result.files.file[i].name + " complete!");	
		    }
		    
		    listOfEXIF = [];
		    listOfJSONFinal = [];
		    fileList = [];
			nameList = [];
			$scope.isDisable = false;
		    //console.log(data);
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

  	checkNearBy = function(){
  		var checkTotalHaveGPS;
  		for(var i = 0 ; i < listOfEXIF.length ; i++){
  			if(listOfEXIF[i].GPSLatitude != undefined && listOfEXIF[i].GPSLongitude != undefined){
  				listOfGPSEachFile.push([listOfEXIF[i].GPSLatitude.description, listOfEXIF[i].GPSLongitude.description]);	
  				checkTotalHaveGPS = true;
  			}
  			else{
  				console.log("File " + files[i].name + " have not GPS.");
  				listOfGPSEachFile.push(null); //push null to list if file[i] have not GPS.
  				checkTotalHaveGPS = false;
  				checkTotalHaveToClose = false;
  			}
  		}
  		if(checkTotalHaveGPS){
  			centerOfList = getLatLngCenter(listOfGPSEachFile);
	  		for(var i = 0 ; i < listOfEXIF.length ; i++){
	  			//console.log(calculateDistance(centerOfList[0],centerOfList[1],listOfEXIF[i].GPSLatitude.description,listOfEXIF[i].GPSLongitude.description));
		  		if(listOfEXIF[i].GPSLatitude != undefined && listOfEXIF[i].GPSLongitude != undefined){
		  			if(calculateDistance(centerOfList[0],centerOfList[1],listOfEXIF[i].GPSLatitude.description,listOfEXIF[i].GPSLongitude.description) > maxDistance){
		  				checkTotalHaveToClose = false; //some file so far than maxDistance
		  				listOfGPSNearEachFile.push(true);
		  				//break;
		  			}
		  			else{
		  				listOfGPSNearEachFile.push(false);
		  				checkTotalHaveToClose = true; //all file have gps and close together
		  			}
		  		}
		  		else{
		  			checkTotalHaveToClose = false; //some file not have GPS
		  				break;
		  		}
	  		}
	  		if(checkTotalHaveToClose){
	  			console.log("Can be uploaded");
	  		}
	  		else{
	  			console.log("GPS point not close");
	  		}
  		}
  		
  	}

  	function calculateDistance(lat1, lon1, lat2, lon2) {
		var R = 6371000; // metres
		var dLat = (lat2 - lat1).toRad();
		var dLon = (lon2 - lon1).toRad(); 
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
			Math.sin(dLon / 2) * Math.sin(dLon / 2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
		var d = R * c;
		return d;
	}
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}

	$scope.cancelUpload = function(){
		$scope.upload.abort();
		console.log("canceled.");
		$timeout(function() {
			$scope.percent = 0;
		}, 10);
		idList = [];
		listOfEXIF = [];
    	listOfJSONFinal = [];
    	centerOfList = [];
    	listOfGPSEachFile = [];
    	files = null;
    	$scope.isDisable = false;
	}


    
    showThumbnail = function(evt){
    	var files = (evt.dataTransfer || evt.target).files; // FileList object

		$scope.totalFiles = files.length; // important

		
		
		// files is a FileList of File objects. List some properties.
		var i = 0;
		$interval(function(){
			f = files[i]
			//Create new file reader
			var r = new FileReader();
			//On load call
			r.onload = (function(theFile){
			    return function(){
			      onLoadHandler(this, i);
			      onLoadEndHandler(this, i);
			   };
			})(f);
			r.readAsDataURL(f);
			i++;	
		}, 500, files.length);

		// for (var i = 0, f; f = files[i]; i++) {

		// 	//Create new file reader
		// 	var r = new FileReader();
		// 	//On load call
		// 	r.onload = (function(theFile){
		// 	    return function(){
		// 	      onLoadHandler(this, i);
		// 	      onLoadEndHandler(this, i);
		// 	   };
		// 	})(f);
		// 	r.readAsDataURL(f);
		// }
    }
 
 	function onLoadEndHandler(fileReader, index){
		//console.log(index);
		$scope.processedCount++;
		//console.log($scope.processedCount);
	  	//console.log(listOfGPSEachFile);
	  	
		if($scope.processedCount == $scope.totalFiles){ 
			$timeout(function() {
				//console.log($scope.listImgThumb);
				//console.log(listOfGPSEachFile);
				//$scope.listImgThumb = angular.copy(tempArrayImg.sort());
			}, 10);
		}

	 //  	if(listOfGPSEachFile[$scope.processedCount-1] != null){
		// 	$scope.listImgThumb.push([fileReader.result, false]);	
		// 	//console.log($scope.processedCount-1);
		// }
		// else{
		// 	$scope.listImgThumb.push([fileReader.result, true]);
		// 	console.log("null founded.");		
		// }
	  $timeout(function() {
	  	$scope.progress = $scope.processedCount/files.length;
	  }, 10);
	}

	function onLoadHandler(fileReader, index){
		
		if(listOfGPSEachFile[$scope.processedCount] != null){ //have gps
			if(listOfGPSNearEachFile[$scope.processedCount] == false ){
				$scope.listImgThumb.push([fileReader.result, false, false]); //close
			}
			else{
				$scope.listImgThumb.push([fileReader.result, false, true]);	//far
			}
		}
		else{
			$scope.listImgThumb.push([fileReader.result, true, null]);	//have not gps
		}	
		
	}

	$scope.clearImg = function(){
		$scope.listImgThumb = [];
		$scope.progress = 0;
		$scope.processedCount= 0;
		$scope.totalFiles = 0;
		// listOfEXIF = [];
  //   	listOfJSONFinal = [];
  //   	centerOfList = [];
  //   	idList = [];
  //   	listOfGPSEachFile = [];
  //   	checkTotalHaveToClose = true;
	}
});