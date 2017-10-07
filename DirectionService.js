var directionsService;
var homeLocationName;
var homeCoordinates;

var hospitalsByDistance = [];
var hospitalsByDuration = [];

function initDirectionService() {
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

function displayHospitalsByDistance() {
    summariseHospitalsByDistance(hospitalsByDistance, hospitalsByDuration);
}


function displayHospitalsByDuration() {
    summariseHospitalsByDuration(hospitalsByDistance, hospitalsByDuration);
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