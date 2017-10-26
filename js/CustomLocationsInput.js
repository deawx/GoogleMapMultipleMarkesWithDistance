CustomLocationsInput = function () {

    window.onload = function () {
        var cachedLocations = getCachedCustomLocations();
        if (cachedLocations) {
            var locations = cachedLocations[0];
            for (var i = 1; i < cachedLocations.length; i++) {
                locations = locations + "\n" + cachedLocations[i];
            }
            if (getLocationsTextArea()) { // HACK
                getLocationsTextArea().value = locations;
            }
        }
    };

    function start(homeAddress) {
        var locationsTextArea = getLocationsTextArea();
        var locations = locationsTextArea.value.split('\n');
        for (var i = 0; i < locations.length; i++) {
            LocationService.addLocationName(locations[i]);
        }
        cacheCustomLocations(locations);
        GoogleMapMultipleMarkerController.start(homeAddress);
    }

    function validateInput(homeAddress, locations) {
        getLoadLocationBtn().disabled = !(homeAddress && locations);
    }

    function getLoadLocationBtn() {
        return document.getElementById("loadLocationBtn");
    }

    function clearAllLocations() {
        getLocationsTextArea().value = "";
        LocationService.clearLocationNames();
        GoogleMapMultipleMarkerController.clearAllLocations();
    }

    function getCachedCustomLocations() {
        return JSON.parse(window.localStorage.getItem("CUSTOM_LOCATIONS"));
    }

    function cacheCustomLocations(locationNames) {
        window.localStorage.setItem("CUSTOM_LOCATIONS", JSON.stringify(locationNames));
    }

    function getLocationsTextArea() {
        return document.getElementById("locationsArea");
    }

    return {
        start: start,
        clearAllLocations: clearAllLocations,
        validateInput: validateInput
    }

}();
