function rad2degr(rad) { return rad * 180 / Math.PI; }
	function degr2rad(degr) { return degr * Math.PI / 180; }

	/**
	 * @a latLngInDeg array of arrays with latitude and longtitude pairs (in degrees)
	 *   e.g. [[latitude1, longtitude1], [latitude2][longtitude2] ...]
	 *
	 * @return array with the center latitude longtitude pair (in degrees)
	 */
	function getLatLngCenter(latLngInDegr) {
	    var sumX=0, sumY=0, sumZ=0, lat, lng;

	    var LATIDX = 0;
	    var LNGIDX = 1;

	    for (var i=0; i<latLngInDegr.length; i++) {
	        if(latLngInDegr[i] != null){
	        	lat = degr2rad(latLngInDegr[i][LATIDX]);
		        lng = degr2rad(latLngInDegr[i][LNGIDX]);
		        // sum of cartesian coordinates
		        sumX += Math.cos(lat) * Math.cos(lng);
		        sumY += Math.cos(lat) * Math.sin(lng);
		        sumZ += Math.sin(lat);
	        }
	    }

	    var avgX = sumX / latLngInDegr.length;
	    var avgY = sumY / latLngInDegr.length;
	    var avgZ = sumZ / latLngInDegr.length;

	    // convert average x, y, z coordinate to latitude and longtitude
	    lng = Math.atan2(avgY, avgX);
	    var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
	    lat = Math.atan2(avgZ, hyp);

	    return ([rad2degr(lat), rad2degr(lng)]);
	}