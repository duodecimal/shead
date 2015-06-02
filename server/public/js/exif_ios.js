var findExif = function(exif_data){
	if((exif_data && exif_data.GPSLatitude && exif_data.GPSLongitude) != undefined){
		var EXIFDataJSON = {
			"{Exif}": {
				"DateTimeOriginal": exif_data.hasOwnProperty("DateTimeOriginal") ? exif_data.DateTimeOriginal.value[0] : "",
				"MeteringMode": exif_data.hasOwnProperty("MeteringMode") ? exif_data.MeteringMode.value : "",
				"ComponentsConfiguration": exif_data.hasOwnProperty("ComponentsConfiguration") ? exif_data.ComponentsConfiguration.value : "",
				"BrightnessValue": exif_data.hasOwnProperty("BrightnessValue") ? exif_data.BrightnessValue.value : "",
				"FocalLenIn35mmFilm": exif_data.hasOwnProperty("FocalLengthIn35mmFilm") ? exif_data.FocalLengthIn35mmFilm.value : "",
				"LensMake": exif_data.hasOwnProperty("undefined-42035") ? exif_data["undefined-42035"].value[0] : "",
				"FNumber": exif_data.hasOwnProperty("FNumber") ? exif_data.FNumber.value : "",
				"FocalLength": exif_data.hasOwnProperty("FocalLength") ? exif_data.FocalLength.value : "",
				"ShutterSpeedValue": exif_data.hasOwnProperty("ShutterSpeedValue") ? exif_data.ShutterSpeedValue.value : "",
				"SubjectArea": exif_data.hasOwnProperty("SubjectArea") ? exif_data.SubjectArea.value : "",
				"ApertureValue": exif_data.hasOwnProperty("ApertureValue") ? exif_data.ApertureValue.value : "",
				"SceneType": exif_data.hasOwnProperty("SceneType") ? exif_data.SceneType.value : "",
				"SceneCaptureType": exif_data.hasOwnProperty("SceneCaptureType") ? exif_data.SceneCaptureType.value : "",
				"ColorSpace": exif_data.hasOwnProperty("ColorSpace") ? exif_data.ColorSpace.value : "",
				"LensModel": exif_data.hasOwnProperty("undefined-42036") ? exif_data["undefined-42036"].value[0] : "",
				"LensSpecification": exif_data.hasOwnProperty("undefined-42034") ? exif_data["undefined-42034"].value : "",
				"PixelYDimension": exif_data.hasOwnProperty("PixelYDimension") ? exif_data.PixelYDimension.value : "",
				"WhiteBalance": exif_data.hasOwnProperty("WhiteBalance") ? exif_data.WhiteBalance.value : "",
				"FlashPixVersion": exif_data.hasOwnProperty("FlashpixVersion") ? exif_data.FlashpixVersion.value : "",
				"DateTimeDigitized": exif_data.hasOwnProperty("DateTimeDigitized") ? exif_data.DateTimeDigitized.value[0] : "",
				"ISOSpeedRatings": exif_data.hasOwnProperty("ISOSpeedRatings") ? [exif_data.ISOSpeedRatings.value] : "",
				"ExposureMode": exif_data.hasOwnProperty("ExposureMode") ? exif_data.ExposureMode.value : "",
				"ExifVersion": exif_data.hasOwnProperty("ExifVersion") ? exif_data.ExifVersion.value : "",
				"PixelXDimension": exif_data.hasOwnProperty("PixelXDimension") ? exif_data.PixelXDimension.value : "",
				"CustomRendered": exif_data.hasOwnProperty("CustomRendered") ? exif_data.CustomRendered.value : "",
				"ExposureProgram": exif_data.hasOwnProperty("ExposureProgram") ? exif_data.ExposureProgram.value : "",
				"ExposureTime": exif_data.hasOwnProperty("ExposureProgram") ? exif_data.ExposureProgram.value : "",
				"SubsecTimeDigitized": exif_data.hasOwnProperty("SubSecTimeDigitized") ? exif_data.SubSecTimeDigitized.value[0] : "",
				"Flash": exif_data.hasOwnProperty("Flash") ? exif_data.Flash.value : "",
				"SubsecTimeOriginal": exif_data.hasOwnProperty("SubSecTimeOriginal") ? exif_data.SubSecTimeOriginal.value[0] : "",
				"SensingMethod": exif_data.hasOwnProperty("SensingMethod") ? exif_data.SensingMethod.value : "",
				"ExposureBiasValue": exif_data.hasOwnProperty("ExposureBiasValue") ? exif_data.ExposureBiasValue.value : ""
    		},
    		"{TIFF}": {
				"ResolutionUnit": exif_data.hasOwnProperty("ResolutionUnit") ? exif_data.ResolutionUnit.value : "",
				"Software": exif_data.hasOwnProperty("Software") ? exif_data.Software.value[0] : "",
				"DateTime": exif_data.hasOwnProperty("DateTime") ? exif_data.DateTime.value[0] : "",
				"XResolution": exif_data.hasOwnProperty("XResolution") ? exif_data.XResolution.value : "",
				"Orientation": exif_data.hasOwnProperty("Orientation") ? exif_data.Orientation.value : "",
				"YResolution": exif_data.hasOwnProperty("YResolution") ? exif_data.YResolution.value : "",
				"Model": exif_data.hasOwnProperty("Model") ? exif_data.Model.value[0] : "",
				"Make": exif_data.hasOwnProperty("Make") ? exif_data.Make.value[0] : ""
			},
			"DPIWidth": exif_data.hasOwnProperty("DPIWidth") ? exif_data.DPIWidth.value : "",
		    "DPIHeight": exif_data.hasOwnProperty("DPIHeight") ? exif_data.DPIHeight.value : "",
		    "Depth": exif_data.hasOwnProperty("Depth") ? exif_data.Depth.value : "",
		    "PixelHeight": exif_data.hasOwnProperty("PixelHeight") ? exif_data.PixelHeight.value : "",
		    "ColorModel": exif_data.hasOwnProperty("ColorModel") ? exif_data.ColorModel.value : "",
		    "Orientation": exif_data.hasOwnProperty("Orientation") ? exif_data.Orientation.value : "",
		    "{GPS}": {
				"ImgDirection": exif_data.hasOwnProperty("GPSImgDirection") ? exif_data.GPSImgDirection.value : "",
				"LatitudeRef": exif_data.hasOwnProperty("GPSLatitudeRef") ? exif_data.GPSLatitudeRef.value[0] : "",
				"DestBearingRef": exif_data.hasOwnProperty("GPSDestBearingRef") ? exif_data.GPSDestBearingRef.value[0] : "",
				"Latitude": exif_data.hasOwnProperty("GPSLatitude") ? exif_data.GPSLatitude.description : "",
				"Speed": exif_data.hasOwnProperty("GPSSpeed") ? exif_data.GPSSpeed.value : "",
				"TimeStamp": exif_data.hasOwnProperty("GPSTimeStamp") ? exif_data.GPSTimeStamp.value : "",
				"LongitudeRef": exif_data.hasOwnProperty("GPSLongitudeRef") ? exif_data.GPSLongitudeRef.value[0] : "",
				"AltitudeRef": exif_data.hasOwnProperty("GPSAltitudeRef") ? exif_data.GPSAltitudeRef.value : "",
				"Longitude": exif_data.hasOwnProperty("GPSLongitude") ? exif_data.GPSLongitude.description : "",
				"Altitude": exif_data.hasOwnProperty("GPSAltitude") ? exif_data.GPSAltitude.value : "",
				"DateStamp": exif_data.hasOwnProperty("GPSDateStamp") ? exif_data.GPSDateStamp.value[0] : "",
				"DestBearing": exif_data.hasOwnProperty("GPSDestBearing") ? exif_data.GPSDestBearing.value : "",
				"ImgDirectionRef": exif_data.hasOwnProperty("GPSImgDirectionRef") ? exif_data.GPSImgDirectionRef.value[0] : "",
				"SpeedRef": exif_data.hasOwnProperty("GPSSpeedRef") ? exif_data.GPSSpeedRef.value[0] : ""
			},
			"PixelWidth": exif_data.hasOwnProperty("PixelWidth") ? exif_data.PixelWidth.value : ""
		}		
			
		EXIFDataJSON = removeAllBlankOrNull(EXIFDataJSON);

		//console.log(EXIFDataJSON);
		return EXIFDataJSON;

    	}

    	else{
    		//console.log("No GPS data or not select file.");
    		return null;
    	}
}

function removeAllBlankOrNull(JsonObj) {
    $.each(JsonObj, function(key, value) {
        if (value === "" || value === null) {
            delete JsonObj[key];
        } else if (typeof(value) === "object") {
            JsonObj[key] = removeAllBlankOrNull(value);
        }
    });
    return JsonObj;
}