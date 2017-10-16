GoogleMapMultipleMarkerController = function () {
    var homeCoordinates;
    var homeAddress;
    var allLocations;
    var LOCATION_FOUND = "LOCATION_FOUND";
    var LOCATION_NOT_FOUND = "LOCATION_NOT_FOUND";
    var QUERY_LIMIT_EXCEEDED = "QUERY_LIMIT_EXCEEDED";

    function init() {
        w3.includeHTMLCustom(function () {
            if (HomeLocationService.isHomeLocationCached()) {
                GUIService.setHomeAddress(HomeLocationService.getCachedHomeLocation());
            }
            GUIService.showMap();
        }, getLocationsFileName());
    }

    function getLocationsFileName() {
        var fileName = "CustomLocationsInput.html";
        if (window.location.href.endsWith("hospitalLocations")) {
            fileName = "HospitalLocationsInput.html";
        }
        return fileName;
    }

    function start(homeLocation) {
        homeAddress = homeLocation;
        allLocations = LocationService.getLocationNames();
        GUIService.disableUserInput();
        StatisticsService.init(allLocations.length);
        loadLocations();
    }

    function clearAllLocations() {
        GUIService.clearHomeAddress();
        HomeLocationService.clearAllCachedLocationsAndDirections();
    }

    function loadLocations() {

        MarkerService.initMarkerService();
        TravelInfoService.initTravelInfoService();

        var loadingFinished = locationLoadingFinished;

        placeMarkerAtHomeLocation(function () {
            HomeLocationService.initHomeLocationService(homeAddress, homeCoordinates);
            TravelInfoService.setHomeLocationInfo(homeAddress, homeCoordinates);

            for (var i = 0; i < allLocations.length; i++) {
                placeMarkerAtLocation(allLocations[i], loadingFinished);
            }
        });
    }

    function locationLoadingFinished(locationName, status) {

        StatisticsService.markLocationAsLoaded(locationName, status);
        GUIService.setDataLoadingProgress(StatisticsService.getCurrentLoadingSummary());

        if (StatisticsService.allLocationsAttemptedToLoad()) {
            var locationByDistance = TravelInfoService.getLocationsByDistance();
            var locationByDuration = TravelInfoService.getLocationsByDuration();
            var locationLoadingStats = StatisticsService.getCurrentLoadingSummary();
            GUIService.displaySummary(locationLoadingStats, locationByDistance, locationByDuration);
        }
    }

    function placeMarkerAtHomeLocation(callBack) {
        placeMarkerAtGivenLocation(homeAddress, true, callBack);
    }

    function placeMarkerAtLocation(hospitalLocation, callBack) {
        placeMarkerAtGivenLocation(hospitalLocation, false, callBack);
    }

    function placeMarkerAtGivenLocation(locationName, isHome, loadingFinishedCallBack) {
        MarkerService.getMarkerCoordinatesForLocation(locationName, function (coordinates) {
            if (isHome) {
                homeCoordinates = coordinates;
                GUIService.centerMapAt(homeCoordinates);
                GUIService.addMarker(homeCoordinates, "Home:" + locationName, true);

            } else {
                TravelInfoService.getTraveTimeFromHome(locationName, coordinates, function (travelInfo) {
                    var title = locationName + " : " + travelInfo.duration + ' (' + travelInfo.distance + ')';
                    GUIService.addMarker(coordinates, title, false);
                }, function (failureStatus) {
                    console.warn("Directions : " + locationName + " can not be calculated !! - " + failureStatus);
                    // loadingFinishedCallBack(STATUS_FOUND);
                });
            }
            loadingFinishedCallBack(locationName, LOCATION_FOUND);
        }, function (failureStatus) {
            console.warn("Location : " + locationName + " can not be found !! - " + failureStatus);
            loadingFinishedCallBack(locationName, failureStatus === "ZERO_RESULTS" ? LOCATION_NOT_FOUND : QUERY_LIMIT_EXCEEDED);
        });
    }

    return {
        init: init,
        start: start,
        clearAllLocations: clearAllLocations,
        LOCATION_FOUND: LOCATION_FOUND,
        LOCATION_NOT_FOUND: LOCATION_NOT_FOUND,
        QUERY_LIMIT_EXCEEDED: QUERY_LIMIT_EXCEEDED
    }

}();