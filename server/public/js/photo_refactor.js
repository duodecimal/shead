angular.module('myApp')
.controller('ctrlPhoto', function($scope, $http, $rootScope, $upload, $timeout, $interval){
	
	var dropZone = document.getElementById('drop-zone');
	var uploadForm = document.getElementById('js-upload-form');
	var fileList;
	var listOfEXIFData;
	var listOfJSONFinal;
	var readEXIFComplete;
	

	$scope.processedCount;
	$scope.percent;
	$scope.listImgThumb;
	$scope.totalFiles;

	initialize();

	function initialize(){
		fileList = [];
		listOfEXIFData = [];
		listOfJSONFinal = [];
		readEXIFComplete = false;
		$timeout(function() {
			$scope.percent = 0;	
		}, 10);
		$scope.processedCount = 0;
		$scope.listImgThumb = [];
		$scope.totalFiles = 0;
	}

	//input file from input
	document.getElementById("js-upload-files").onchange = function(e){
		createFileList(e.target.files);
	};

	//input file from dropzone
	dropZone.ondrop = function(e){
		e.preventDefault();
		this.className = 'upload-drop-zone';
		createFileList(e.dataTransfer.files);
	};


	function createFileList(fileListOriginal){
		var myFileList = [];
		for(var i = 0 ; i < fileListOriginal.length ; i++){
			myFileList.push(fileListOriginal[i]);
		}
		fileList = sortFile(myFileList);
		//console.log(fileList);
		//getExifDataAllFile(fileList);
		$timeout(function() {
			showThumbnail(fileList);
		}, 1000);
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
	
	function getExifDataAllFile(files){
		for(var i = 0 ; i < files.length ; i++){
			//var exif;
			var reader = new FileReader();  
		    //var exif_data; // single EXIF
		    reader.onload = (function(e) {  
		       try {
					return function(){
			          	onLoadHandler(this, e, "getEXIFData");
			          	onLoadEndHandler(this, e, "getEXIFData");
			      	};
				} catch (error) {
					alert(error);
				}
		    })(files[i]);
	    	reader.readAsArrayBuffer(files[i].slice(0, 128 * 1024));
		}
	}


	function onLoadHandler(fileReader, files, from){
		if(from == "getEXIFData"){
			var exif;
			var exif_data;

			exif = new ExifReader();
			exif.load(fileReader.result);
			exif.deleteTag('MakerNote');
			exif_data = exif.getAllTags();
			listOfEXIFData.push(exif_data);
		}
		else if(from == "showThumbnail"){
			$scope.listImgThumb.push([fileReader.result, false, false]); //close
		}
	}

	function onLoadEndHandler(fileReader, files, from){
		if(from == "getEXIFData"){
			$scope.processedCount++;
		  	if($scope.processedCount == fileList.length){ 
		  		for(var i = 0 ; i < listOfEXIFData.length ; i++){
	    			listOfJSONFinal.push(findExif(listOfEXIFData[i]));
		    	}
		    	readEXIFComplete = true;
		    	$scope.processedCount = 0;
		  	}
		}
		else if(from == "showThumbnail"){
			$scope.processedCount++;
			console.log($scope.processedCount);
			if($scope.processedCount == fileList.length){ 
				$scope.processedCount = 0;
			}
		}
	}

	$scope.submitPhoto = function(){
		if(readEXIFComplete){
			if(true){
				uploadMetadata();	//upload both metadata and img
			}
		}
		else{
			console.log("Read EXIF Uncomplete")
		}
	}

	function uploadMetadata(){
		var idList = [];
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

	function uploadImg(idList){
		var nameList = [];
		for(var i = 0 ; i < idList.length ; i++){
			nameList.push(idList[i] + (fileList[i].type === "image/jpeg" ? ".jpg" : ""));	
		}
		
		$scope.upload = $upload
		.upload({
		    url: 'http://shead.cloudapp.net:3000/api/containers/images/upload', //upload.php script, node.js route, or servlet url 
		    method: 'POST', 
		    file: fileList, // or list of files ($files) for html5 only 
		    fileName: nameList,
		}).progress(function(evt) {
		   	$scope.percent = parseInt(100.0 * evt.loaded / evt.total);
		}).success(function(data, status, headers, config) {
		   	for(var i = 0 ; i < data.result.files.file.length ; i++){
		   		console.log("Status : " + status + ", upload " + data.result.files.file[i].name + " complete!");	
		   	}
		   	initialize();
		});
	}


	function showThumbnail(files){
		$scope.totalFiles = files.length;
		console.log($scope.totalFiles);
		
		var i = 0;
		$interval(function(){
			f = files[i]
			//Create new file reader
			var r = new FileReader();
			//On load call
			r.onload = (function(theFile){
			    return function(){
			      onLoadHandler(this, i, "showThumbnail");
			      onLoadEndHandler(this, i, "showThumbnail");
			   };
			})(f);
			r.readAsDataURL(f);
			i++;	
		}, 500, files.length);

	}
	$scope.debug = function(){
		//console.log(fileList);
	}

	dropZone.ondragover = function(){
        this.className = 'upload-drop-zone drop';
        return false;
    }

    dropZone.ondragleave = function(){
        this.className = 'upload-drop-zone';
        return false;
    }

    $scope.cancelUpload = function(){
		$scope.upload.abort();
		initialize();
		console.log("canceled.");
	}
});