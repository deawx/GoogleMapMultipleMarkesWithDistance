MarkerService = function () {
    var geocoder;
    var waitTimeIndex = 0;

    function initMarkerService() {
        geocoder = new google.maps.Geocoder();
    }

    function getMarkerCoordinatesForLocation(locationName, successCallBack, failureCallBack) {
        if (isLocationCoordinatesCached(locationName)) {
            successCallBack(getCachedLocationCoordinates(locationName));
        }
        else {
            // failureCallBack(GoogleMapMultipleMarkerController.LOCATION_NOT_FOUND);


            setTimeout(function () {
                fetchCoordinatesForLocation(locationName, successCallBack, failureCallBack);
            }, 800 * waitTimeIndex++);
        }
    }

    function fetchCoordinatesForLocation(locationName, successCallBack, failureCallBack) {
        geocoder.geocode({
            'address': locationName
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK && status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                cacheLocationCoordinates(locationName, results[0].geometry.location);
                successCallBack(results[0].geometry.location);
            }
            else {
                failureCallBack(status);
            }
        });
    }

    function isLocationCoordinatesCached(locationName) {
        return window.localStorage.getItem(locationName) !== null;
    }

    function getCachedLocationCoordinates(locationName) {
        return JSON.parse(window.localStorage.getItem(locationName));
    }

    function cacheLocationCoordinates(locationName, coordinates) {
        window.localStorage.setItem(locationName, JSON.stringify(coordinates));
    }

    return {
        initMarkerService : initMarkerService,
        getMarkerCoordinatesForLocation : getMarkerCoordinatesForLocation
    }
}();