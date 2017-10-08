GoogleMapMultipleMarkerController = function () {
    var homeCoordinates;
    var homeAddress;
    var hospitalAddresses = LocationService.getLocationNames();
    var LOCATION_FOUND = "LOCATION_FOUND";
    var LOCATION_NOT_FOUND = "LOCATION_NOT_FOUND";
    var QUERY_LIMIT_EXCEEDED = "QUERY_LIMIT_EXCEEDED";

    function init() {
        if (HomeLocationService.isHomeLocationCached()) {
            GUIService.setHomeAddress(HomeLocationService.getCachedHomeLocation());
        }
        GUIService.showMap();
    }

    function start(homeLocation) {
        homeAddress = homeLocation;
        GUIService.disableUserInput();
        StatisticsService.init(hospitalAddresses.length);
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

            for (var i = 0; i < hospitalAddresses.length; i++) {
                placeMarkerAtHospital(hospitalAddresses[i], loadingFinished);
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
        placeMarkerAtLocation(homeAddress, true, callBack);
    }

    function placeMarkerAtHospital(hospitalLocation, callBack) {
        placeMarkerAtLocation(hospitalLocation, false, callBack);
    }

    function placeMarkerAtLocation(locationName, isHome, loadingFinishedCallBack) {
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
        init : init,
        start : start,
        clearAllLocations : clearAllLocations,
        LOCATION_FOUND : LOCATION_FOUND,
        LOCATION_NOT_FOUND : LOCATION_NOT_FOUND,
        QUERY_LIMIT_EXCEEDED : QUERY_LIMIT_EXCEEDED
    }

}();