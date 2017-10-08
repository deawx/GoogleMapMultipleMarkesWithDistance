TravelInfoService = function () {
    var directionsService;
    var homeLocationName;
    var homeCoordinates;

    var hospitalsByDistance = [];
    var hospitalsByDuration = [];

    function initTravelInfoService() {
        directionsService = new google.maps.DirectionsService();
    }

    function setHomeLocationInfo(homeLocation, homeCoord) {
        homeLocationName = homeLocation;
        homeCoordinates = homeCoord;
    }

    function getTraveTimeFromHome(targetLocationName, targetLocation, successCallBack, failureCallBack) {
        if (isDirectionsCached(targetLocationName)) {
            var travelInfo = getCachedDirections(targetLocationName);
            successCallBack(travelInfo);
        } else {
            // failureCallBack(GoogleMapMultipleMarkerController.LOCATION_NOT_FOUND);

            var request = {
                origin: homeCoordinates,
                destination: targetLocation,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {
                if (status === 'OK') {
                    var point = response.routes[0].legs[0];
                    var travelInfo = cacheDirections(targetLocationName, point);
                    successCallBack(travelInfo);
                } else {
                    failureCallBack(status);
                }
            });
        }
    }

    function getLocationsByDistance() {
        var keysSorted = Object.keys(hospitalsByDistance).sort(function (a, b) {
            return hospitalsByDistance[a].replace(" km", "") - hospitalsByDistance[b].replace(" km", "")
        });
        var byDistance = [];
        for (var i = 0; i < keysSorted.length; i++) {
            byDistance.push({
                location: keysSorted[i],
                distance: hospitalsByDistance[keysSorted[i]],
                duration: hospitalsByDuration[keysSorted[i]]
            });
        }
        return byDistance;
    }

    function getLocationsByDuration() {
        var keysSorted = Object.keys(hospitalsByDuration).sort(function (a, b) {
            return getTimeInMins(hospitalsByDuration[a]) - getTimeInMins(hospitalsByDuration[b])
        });

        var byDuration = [];
        for (var i = 0; i < keysSorted.length; i++) {
            byDuration.push({
                location: keysSorted[i],
                duration: hospitalsByDuration[keysSorted[i]],
                distance: hospitalsByDistance[keysSorted[i]]
            });
        }
        return byDuration;
    }

    function getTimeInMins(timeStr) {
        var hour = 0;
        var min = 0;
        var hourMarker = " hour ";
        var time = timeStr;


        if (time.indexOf(" hours ") > 0) {
            hourMarker = " hours ";
        }

        if (time.indexOf(hourMarker) !== -1) {
            hour = time.split(hourMarker)[0];
            time = time.split(hourMarker)[1];
        }
        if (time.indexOf("mins") !== -1) {
            min = time.split("mins")[0];
        }

        return (parseInt(hour) * 60) + parseInt(min);
    }

    function isDirectionsCached(targetLocationName) {
        return window.localStorage.getItem(getDirectionsKey(targetLocationName)) !== null;
    }

    function getCachedDirections(targetLocationName) {
        var travelInfo = JSON.parse(window.localStorage.getItem(getDirectionsKey(targetLocationName)));
        addLocationForStatistics(targetLocationName, travelInfo);
        return travelInfo;
    }

    function addLocationForStatistics(targetLocationName, travelInfo) {
        hospitalsByDistance[targetLocationName] = travelInfo.distance;
        hospitalsByDuration[targetLocationName] = travelInfo.duration;
    }

    function cacheDirections(targetLocationName, point) {
        var travelInfo = {
            duration: point.duration.text,
            distance: point.distance.text
        };
        addLocationForStatistics(targetLocationName, travelInfo);
        window.localStorage.setItem(getDirectionsKey(targetLocationName), JSON.stringify(travelInfo));
        return travelInfo;
    }

    function getDirectionsKey(targetLocationName) {
        return homeLocationName + "_" + targetLocationName;
    }

    return {
        initTravelInfoService: initTravelInfoService,
        setHomeLocationInfo: setHomeLocationInfo,
        getTraveTimeFromHome: getTraveTimeFromHome,
        getLocationsByDistance: getLocationsByDistance,
        getLocationsByDuration: getLocationsByDuration
    }
}();

