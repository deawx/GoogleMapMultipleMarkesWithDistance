function initHomeLocationService(homeLocationName, homeCoordinates) {
    cacheHomeLocationName(homeLocationName);
    setHomeLocationInfo(homeLocationName, homeCoordinates);
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

function clearCachedHomeLocationAndDirections() {
    window.localStorage.clear();
}