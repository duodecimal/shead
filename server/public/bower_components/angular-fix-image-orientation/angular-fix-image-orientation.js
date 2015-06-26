(function (angular, EXIF) {
    'use strict';
    
    angular.module("cp.ng.fix-image-orientation", []).directive('imgFixOrientation', [orient]);
    
    /**
     * Directive definition.
     * 
     * @returns {object}
     */
    function orient() {
        return {
            restrict: 'A',
            scope: {
                'imgFixOrientation': '='
            },
            link: linkLogic
        };
        
        /**
         * {@inheritDoc}
         * 
         * @param {object} scope
         * @param {object} element
         * @param {object} attrs
         * @returns {undefined}
         */
        function linkLogic(scope, element, attrs) {
            var imageUrl = scope.imgFixOrientation;
            if (0 === imageUrl.indexOf('data:image')) {
                var base64 = imageUrl.split(',')[1];
                var exifData = EXIF.readFromBinaryFile(base64ToArrayBuffer(base64));
                reOrient(parseInt(exifData.Orientation || 1, 10), element);
            }
            else {

                function createCORSRequest(method, url) {
                    var xhr = new XMLHttpRequest();
                    if ("withCredentials" in xhr) {
                        // Check if the XMLHttpRequest object has a "withCredentials" property.
                        // "withCredentials" only exists on XMLHTTPRequest2 objects.
                        xhr.open(method, url, true);
                        xhr.responseType = "arraybuffer";
                        xhr.onload = function(e) {
                            var arrayBuffer = new Uint8Array(this.response);
                            var exifData = EXIF.readFromBinaryFile(arrayBuffer.buffer);
                            reOrient(parseInt(exifData.Orientation || 1, 10), element);
                        };
                        xhr.send();
                    }
                    else if (typeof XDomainRequest != "undefined") {
                        // Otherwise, check if XDomainRequest.
                        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                        xhr = new XDomainRequest();
                        xhr.open(method, url);
                    }
                    else {
                        // Otherwise, CORS is not supported by the browser.
                        xhr = null;
                    }
                    return xhr;
                }

                var xhr = createCORSRequest('GET', imageUrl);
                if (!xhr) {
                    console.log("not supported");
                    throw new Error('CORS not supported');
                }
               
            }
        }
        
        /**
         * Convert base64 string to array buffer.
         * 
         * @param {string} base64
         * @returns {object}
         */
        function base64ToArrayBuffer(base64) {
            var binaryString = window.atob(base64);
            var len = binaryString.length;
            var bytes = new Uint8Array( len );
            
            for (var i = 0; i < len; i++)        {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            return bytes.buffer;
        }
        
        /**
         * Reorient specified element.
         * 
         * @param {number} orientation
         * @param {object} element
         * @returns {undefined}
         */
        function reOrient(orientation, element) {
            switch (orientation) {
                case 1:
                    // No action needed
                    break;
                case 2:
                    element.css({
                        '-moz-transform': 'scaleX(-1)',
                        '-o-transform': 'scaleX(-1)',
                        '-webkit-transform': 'scaleX(-1)',
                        'transform': 'scaleX(-1)',
                        'filter': 'FlipH',
                        '-ms-filter': "FlipH"
                    });
                    break;
                case 3:
                    element.css({
                        'transform': 'rotate(180deg)'
                    });
                    break;
                case 4:
                    element.css({
                        '-moz-transform': 'scaleX(-1)',
                        '-o-transform': 'scaleX(-1)',
                        '-webkit-transform': 'scaleX(-1)',
                        'transform': 'scaleX(-1) rotate(180deg)',
                        'filter': 'FlipH',
                        '-ms-filter': "FlipH"
                    });
                    break;
                case 5:
                    element.css({
                        '-moz-transform': 'scaleX(-1)',
                        '-o-transform': 'scaleX(-1)',
                        '-webkit-transform': 'scaleX(-1)',
                        'transform': 'scaleX(-1) rotate(90deg)',
                        'filter': 'FlipH',
                        '-ms-filter': "FlipH"
                    });
                    break;
                case 6:
                    element.css({
                        'transform': 'rotate(90deg)'
                    });
                    break;
                case 7:
                    element.css({
                        '-moz-transform': 'scaleX(-1)',
                        '-o-transform': 'scaleX(-1)',
                        '-webkit-transform': 'scaleX(-1)',
                        'transform': 'scaleX(-1) rotate(-90deg)',
                        'filter': 'FlipH',
                        '-ms-filter': "FlipH"
                    });
                    break;
                case 8:
                    element.css({
                        'transform': 'rotate(-90deg)'
                    });
                    break;
            }
        }// End reOrient()
    }// End orient()
})(window.angular, window.EXIF, window);