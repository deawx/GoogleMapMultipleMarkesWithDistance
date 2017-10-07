var map;
var homeCoordinates;
var homeAddress = "Mahabellana";
var hospitalAddresses = getHospitals();
var loadedLocationsCount = 0;
var STATUS_FOUND = "FOUND";
var STATUS_NOT_FOUND = "NOT_FOUND";
var missedLocationsCount = 0;

function initMap() {

    //window.localStorage.clear();
    //console.log(JSON.stringify(localStorage));

    console.warn(" -------------- Total Number of Hospitals : " + hospitalAddresses.length + " -------------- ");

    initLocationService();
    initDirectionService();
    createMap();

    var loadingFinished = locationLoadingFinished;

    placeMarkerAtHomeLocation(function () {
        setHomeLocationInfo(homeAddress, homeCoordinates);

        for (var i = 0; i < hospitalAddresses.length; i++) {
            placeMarkerAtHospital(hospitalAddresses[i], loadingFinished);
        }
    });
}

function locationLoadingFinished(status) {
    loadedLocationsCount++;
    if (status == STATUS_NOT_FOUND) {
        missedLocationsCount++;
    }

    if (loadedLocationsCount === hospitalAddresses.length) {
        console.warn("-------------- Total Number of Hospitals could not be Located : " + missedLocationsCount + " -------------- ");
        displayHospitalsByDistance();
        displayHospitalsByDuration();
    }
}

function createMap() {
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