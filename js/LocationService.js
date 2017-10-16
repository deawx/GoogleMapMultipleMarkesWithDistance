LocationService = function () {

    var locationNames = [];
    
    function addLocationName(locationName) {
        locationNames.push(locationName);
    }
    
    function getLocationNames() {
        return locationNames;
    }

    function clearLocationNames() {
        locationNames = [];
    }

    return {
        addLocationName : addLocationName,
        getLocationNames : getLocationNames,
        clearLocationNames : clearLocationNames
    }

}();

