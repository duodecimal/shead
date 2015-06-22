//inject angular file upload directives and services.
angular.module('myApp')

.controller('ctrlPhoto', function($scope, $http, $rootScope, $upload, $timeout, $interval, postDataFactory){
	// Check that the browser supports the FileReader API.
	if (!window.FileReader) {
		document.write('<strong>Sorry, your web browser does not support the FileReader API.</strong>');
		return;
	}

	var dropZone = document.getElementById('drop-zone');
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
    var maxDistance = 50;
    var tempArrayImg = [];
    var fileList = [];
	var nameList = [];
	var allTags = [];

	$scope.totalFiles = 0;
    $scope.listImgThumb = [];
    $scope.percent = 0;
    $scope.progress = 0;
    $scope.isDisable = false;
    $scope.processedCount= 0;
    //$scope.model = [];
    

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
    	createFileList(e.target.files);
        //files = e.target.files;
        //console.log(files);       
        if(files.length != 0){
        	for(var i = 0; i < files.length; i++) {
        		handleFile(files[i], i);		
			}
			$timeout(function() {
				checkNearBy();
				showThumbnail(e);
			}, 1000);	

        }
        else{
        	listOfEXIF = [];
        }
        //myFileList(files);
    }

    function createFileList(fileListOriginal){
    	var myFileList = [];
		for(var i = 0 ; i < fileListOriginal.length ; i++){
			myFileList.push(fileListOriginal[i]);
		}
		files = sortFile(myFileList);
    }

    function sortFile(fileBeforeSort){
		var fileAfterSort = fileBeforeSort.slice(0);
		fileAfterSort.sort(function(a,b) {
		    var x = a.name.toLowerCase();
		    var y = b.name.toLowerCase();
		    return x < y ? -1 : x > y ? 1 : 0;
		});
		return fileAfterSort;
	}

	function handleFile(file, i) {

	    var reader = new FileReader();  
	    var exif;
	    reader.onload = function(e) {  
	       try {
		        var text = e.target.result; 
		        exif = new ExifReader();
				exif.load(e.target.result);
				exif.deleteTag('MakerNote');
				exif_data = exif.getAllTags();
				listOfEXIF.push(exif_data);
			} catch (error) {
				alert(error);
			}
	    }
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

	function getTagsFromView(){
		allTags = [];
		for(var i = 0 ; i < t.getValues().length ; i++){
			allTags.push(t.getValues()[i][1]);	
		}
	}

    $scope.submitPhoto = function(){
    	getTagsFromView();
    	$scope.isDisable = true;
    	for(var i = 0 ; i < listOfEXIF.length ; i++){
    		listOfJSONFinal.push(findExif(listOfEXIF[i]));
    	}

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
        createFileList(e.dataTransfer.files);
        //console.log(files);
        if(files.length != 0){
	        for (var i = 0; i < files.length; i++) {
			    handleFile(files[i], i);
			}
			$timeout(function() {
				checkNearBy();
				showThumbnail(e);
			}, 1000);
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
		for(var i = 0 ; i < files.length ; i++){
			nameList.push(idList[i] + (files[i].type === "image/jpeg" ? ".jpg" : ""));
		}

		console.log(nameList);
		console.log(files);

		// $scope.upload = $upload
		// .upload({
		//     url: 'http://shead.cloudapp.net:3000/api/containers/images/upload', //upload.php script, node.js route, or servlet url 
		//     method: 'POST', 
		//     //headers: {'header-key': 'header-value'}, 
		//     //withCredentials: true, 
		//     //data: {myObj: "test11111111"},
		//     file: files, // or list of files ($files) for html5 only 
		//     //fileName: id + (file.type === "image/jpeg" ? ".jpg" : "")
		//     fileName: nameList,
		//     // customize file formData name ('Content-Desposition'), server side file variable name.  
		//     //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'  
		//     // customize how data is added to formData. See #40#issuecomment-28612000 for sample code 
		//     //formDataAppender: function(formData, key, val){} 
		//   }).progress(function(evt) {
		//     //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		//     $scope.percent = parseInt(100.0 * evt.loaded / evt.total);
		//     //console.log($scope.percent);
		//     //console.log(evt);
		//   }).success(function(data, status, headers, config) {
		//   	//console.log(data);
		//     // file is uploaded successfully
		//     for(var i = 0 ; i < data.result.files.file.length ; i++){
		//     	console.log("Status : " + status + ", upload " + data.result.files.file[i].name + " complete!");	
		//     }
		//     getCoordinates(data.result.files.file);

		//     listOfEXIF = [];
		//     listOfJSONFinal = [];
		//     fileList = [];
		// 	nameList = [];
		// 	$scope.isDisable = false;
		//   });

    }


  	checkNearBy = function(){
  		var checkTotalHaveGPS;

  		for(var i = 0 ; i < listOfEXIF.length ; i++){
  			if(listOfEXIF[i].GPSLatitude != undefined && listOfEXIF[i].GPSLongitude != undefined){
  				listOfGPSEachFile.push([listOfEXIF[i].GPSLatitude.description, listOfEXIF[i].GPSLongitude.description]);	
  			}
  			else{
  				console.log("File " + files[i].name + " have not GPS.");
  				listOfGPSEachFile.push(null); //push null to list if file[i] have not GPS.
  			}
  		}

  		//check list have null?
  		if(checkValueInList(listOfGPSEachFile, null)){
  			//console.log("have null");
  			checkTotalHaveGPS = false;
  			checkTotalHaveToClose = false;
  		}
  		else{
  			checkTotalHaveGPS = true;
  		}

  		//if(checkTotalHaveGPS){
  		if(true){

			//get GPS point first file
			for(var i = 0 ; i < listOfGPSEachFile.length ; i++){
				if(listOfGPSEachFile[i] != null){
					centerOfList = listOfGPSEachFile[i];
					break;
				}
			}
			
	  		for(var i = 0 ; i < listOfEXIF.length ; i++){
		  		if(listOfEXIF[i].GPSLatitude != undefined && listOfEXIF[i].GPSLongitude != undefined){
		  			if(calculateDistance(centerOfList[0],centerOfList[1],listOfEXIF[i].GPSLatitude.description,listOfEXIF[i].GPSLongitude.description) > maxDistance){
		  				listOfGPSNearEachFile.push(true); //some file so far than maxDistance
		  			}
		  			else{
		  				listOfGPSNearEachFile.push(false);
		  			}
		  		}
		  		else{
		  			listOfGPSNearEachFile.push(null); //some file not have GPS
		  		}
	  		}


			if(checkValueInList(listOfGPSNearEachFile, null) || checkValueInList(listOfGPSNearEachFile, true)){
				//console.log("cannot upload");
				checkTotalHaveToClose = false; //some file not have GPS or invalid distance
			}
			else{
				//console.log("can upload");
				checkTotalHaveToClose = true; //all file have gps and close together
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
		console.log("Canceled.");
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
    	//var files = (evt.dataTransfer || evt.target).files; // FileList object

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

    }
 
 	function onLoadEndHandler(fileReader, index){

		$scope.processedCount++;

	  	
		if($scope.processedCount == $scope.totalFiles){ 
			$timeout(function() {
				//do_somethings
			}, 10);
		}

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
		listOfGPSEachFile = [];
		centerOfList = [];
		files = [];
		listOfEXIF = [];
		//console.log(files);
	}

	$scope.removeImg = function(index){
		//console.log(index);	
		if (index > -1) {
		    $scope.listImgThumb.splice(index, 1);
		    processAfterRemove(index);
		}
	}

	function processAfterRemove(index){
		//console.log(index);
		files.splice(index, 1);
		//console.log(files);
		listOfEXIF.splice(index, 1);
		//console.log(listOfEXIF);
		listOfGPSNearEachFile = [];
		checkNearBy();
	}

	function checkValueInList(list, value){
		return!!~list.indexOf(value)
	}

	function getCoordinates(files){
		var idListFromCallback = [];
		var coordinates = [];
		var newsObj;
		var id;
		for(var i = 0 ; i < files.length ; i++){
			idListFromCallback.push((files[i].name).substring(0, (files[i].name).lastIndexOf('.')));
		}
		
		id = idListFromCallback[0];
		$http.get('http://shead.cloudapp.net:3000/api/ImageMetadatas/'+id)
		.success(function(data, status, headers, config) {
			coordinates.push(data["{GPS}"].Longitude);
			coordinates.push(data["{GPS}"].Latitude);
			postNews(files, coordinates);
		})
		.error(function(data, status, headers, config) {
		
		});


	}

	function postNews(files, coordinates){
		var newsObj = [];
		var assetsObj = [];
		var tagsObj = [];
		var d = new Date();

		for(var i = 0 ; i < files.length ; i++){
			assetsObj.push({
				"imageMetadataId": (files[i].name).substring(0, (files[i].name).lastIndexOf('.')),
		        "imageDownloadURL": "https://sheadimages.blob.core.windows.net/images/"+files[i].name,
		        "type": "image"
			})
		}

		//console.log(assetsObj);

		// tagsObj = ($scope.model.tags).split(',');
		// for(var i = 0 ; i < tagsObj.length ; i++){
		// 	tagsObj[i] = tagsObj[i].trim();
		// 	if (i > -1 && tagsObj[i] == "") {
		//     	tagsObj.splice(i, 1);
		// 	}
		// }

		//for true format of Date
		var dateString = window.JSON.stringify(new Date);
		var dateObj = window.JSON.parse(dateString);

		newsObj = {
		    "title": $scope.model.title,
		    "created": dateObj,
		    "updated": dateObj,
		    "type": $scope.model.type,
		    "tags": allTags,
		    "loc": {
		      "coordinates": coordinates,
		      "type": "Point"
		    },
		    "assets": assetsObj
		}
		//console.log(newsObj);

		console.log(postDataFactory.postData(newsObj));
		// $http.post('http://shead.cloudapp.net:3000/api/News', newsObj)
		// .success(function(data, status, headers, config) {
		// 	console.log("Completed, news ID = "+data.id);
		// })
		// .error(function(data, status, headers, config) {
		// 	console.log(data);
		// });
	}

	$("#myForm").keypress(function(e) {
	  //Enter key
	  if (e.which == 13) {
	    return false;
	  }
	});

	var t = new $.TextboxList('#form_tags_input', {
		bitsOptions:{
			editable:{
				addKeys: [188,186,13,9],
			}
		},max: 20, unique: true
	});


});