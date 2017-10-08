StatisticsService = function () {
    var totalLocationCount = 0;
    var attemptedLocationsCount = 0;
    var loadedLocationCount = 0;
    var invalidLocationsCount = 0;
    var queryLimitExceededCount = 0;
    var invalidLocationNames = [];


    function init(totalLocations) {
        totalLocationCount = totalLocations;
    }

    function getTotalLocationCount() {
        return totalLocationCount;
    }

    function getCurrentLoadingSummary() {
        return {
            "totalLocationCount": totalLocationCount,
            "attemptedLocationsCount": attemptedLocationsCount,
            "loadedLocationCount": loadedLocationCount,
            "invalidLocationsCount": invalidLocationsCount,
            "queryLimitExceededCount": queryLimitExceededCount,
            "failedLocationCount": invalidLocationsCount + queryLimitExceededCount,
            "invalidLocationNames" : invalidLocationNames
        };
    }

    function markLocationAsLoaded(locationName, status) {
        attemptedLocationsCount++;
        switch (status) {
            case GoogleMapMultipleMarkerController.LOCATION_FOUND:
                loadedLocationCount++;
                break;
            case GoogleMapMultipleMarkerController.LOCATION_NOT_FOUND:
                invalidLocationsCount++;
                invalidLocationNames.push(locationName);
                break;
            case GoogleMapMultipleMarkerController.QUERY_LIMIT_EXCEEDED:
                queryLimitExceededCount++;
                break;
        }
    }

    function allLocationsAttemptedToLoad() {
        return attemptedLocationsCount === totalLocationCount;
    }

    return {
        init: init,
        getTotalLocationCount: getTotalLocationCount,
        getCurrentLoadingSummary : getCurrentLoadingSummary,
        allLocationsAttemptedToLoad: allLocationsAttemptedToLoad,
        markLocationAsLoaded: markLocationAsLoaded,
    }
}();