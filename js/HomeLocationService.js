HomeLocationService = function () {
    function initHomeLocationService(homeLocationName, homeCoordinates) {
        cacheHomeLocationName(homeLocationName);
    }

    function cacheHomeLocationName(homeLocationName) {
        window.localStorage.setItem("homeLocationName", homeLocationName);
    }

    function getCachedHomeLocation() {
        return window.localStorage.getItem("homeLocationName");
    }

    function isHomeLocationCached() {
        // if (window.localStorage.getItem("homeLocationName")) {
        //     return true;
        // }
        return window.localStorage.getItem("homeLocationName") != null;
    }

    function clearAllCachedLocationsAndDirections() {
        window.localStorage.clear();
    }

    return {
        initHomeLocationService : initHomeLocationService,
        isHomeLocationCached : isHomeLocationCached,
        getCachedHomeLocation : getCachedHomeLocation,
        clearAllCachedLocationsAndDirections : clearAllCachedLocationsAndDirections
    }

}();

