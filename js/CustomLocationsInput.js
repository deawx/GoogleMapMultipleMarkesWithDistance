CustomLocationsInput = function () {

    function start(homeAddress) {
        var locationsTextArea = document.getElementById("locationsArea");
        var locations = locationsTextArea.value.split('\n')
        for (var i = 0; i < locations.length; i++) {
            LocationService.addLocationName(locations[i]);
        }
        GoogleMapMultipleMarkerController.start(homeAddress);
    }
    
    function clearAllLocations() { // This is not working
        LocationService.clearLocationNames();
        GoogleMapMultipleMarkerController.clearAllLocations();
    }

    return {
        start: start,
        clearAllLocations : clearAllLocations
    }

}();
