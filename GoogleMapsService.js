var map;
var homeCoordinates;
var homeAddress;
var hospitalAddresses = getHospitals();
var loadedLocationsCount = 0;
var STATUS_FOUND = "FOUND";
var STATUS_NOT_FOUND = "NOT_FOUND";
var missedLocationsCount = 0;

function init() {
    if (isHomeLocationCached()) {
        displayExistingHomeLocationToUser();
    }
    createMap();
}

function setHomeAddress() {
    homeAddress = document.getElementById("homeAddress").value;
    loadLocations();
}

function clearHomeAddress() {
    document.getElementById("homeAddress").value = "";
    document.getElementById("homeAddress").disabled = true
    clearCachedHomeLocationAndDirections();
}

function loadLocations() {
    console.warn(" -------------- Total Number of Hospitals : " + hospitalAddresses.length + " -------------- ");

    initLocationService();
    initDirectionService();

    var loadingFinished = locationLoadingFinished;

    placeMarkerAtHomeLocation(function () {
        initHomeLocationService(homeAddress, homeCoordinates);

        for (var i = 0; i < hospitalAddresses.length; i++) {
            placeMarkerAtHospital(hospitalAddresses[i], loadingFinished);
        }
    });
}

function updateDisplayStatus() {
    document.getElementById("loadingStatus").innerHTML = " Loading Locations, Please wait... " +
        "(Total Location Count :" + hospitalAddresses.length + " | Locations Loaded :" + loadedLocationsCount + " | Locations Failed to Load :" + missedLocationsCount + ")";
}

function locationLoadingFinished(status) {
    loadedLocationsCount++;
    if (status == STATUS_NOT_FOUND) {
        missedLocationsCount++;
    }
    updateDisplayStatus();

    if (loadedLocationsCount === hospitalAddresses.length) {
        console.warn("-------------- Total Number of Hospitals could not be Located : " + missedLocationsCount + " -------------- ");
        displayHospitalsByDistance();
        displayHospitalsByDuration();
    }
}

function displayExistingHomeLocationToUser() {
    document.getElementById("homeAddress").value = getCachedHomeLocation();
    document.getElementById("homeAddress").disabled = true;
}

function createMap() {
    // window.localStorage.clear();
    // console.log(JSON.stringify(localStorage));

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 10
    });
}

function placeMarkerAtHomeLocation(callBack) {
    placeMarkerAtLocation(homeAddress, true, callBack);
}

function placeMarkerAtHospital(hospitalLocation, callBack) {
    placeMarkerAtLocation(hospitalLocation, false, callBack);
}

function placeMarkerAtLocation(locationName, isHome, loadingFinishedCallBack) {
    getCoordinatesForLocation(locationName, function (coordinates) {
        if (isHome) {
            homeCoordinates = coordinates;
            map.setCenter(homeCoordinates);
            createMarker(homeCoordinates, "Home:" + locationName, true);

        } else {
            getTraveTimeFromHome(locationName, coordinates, function (travelInfo) {
                var title = locationName + " : " + travelInfo.duration + ' (' + travelInfo.distance + ')';
                createMarker(coordinates, title, false);
            }, function (failureStatus) {
                console.error("Directions : " + locationName + " can not be calculated !! - " + failureStatus);
                // loadingFinishedCallBack(STATUS_FOUND);
            });
        }
        loadingFinishedCallBack(STATUS_FOUND);
    }, function (failureStatus) {
        console.error("Location : " + locationName + " can not be found !! - " + failureStatus);
        loadingFinishedCallBack(STATUS_NOT_FOUND);
    });
}

function createMarker(location, title, isHome) {
    var markerConfig = {
        position: location,
        map: map,
        title: title
    };

    if (isHome) {
        markerConfig.icon = image;
    }

    var marker = new google.maps.Marker(markerConfig);

    var infowindow = new google.maps.InfoWindow({
        content: '<b>' + title + '</b>',
        size: new google.maps.Size(150, 50)
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });
}

var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';