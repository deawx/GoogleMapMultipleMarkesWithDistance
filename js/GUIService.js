GUIService = function () {
    var map;
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    function showMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 7.29, lng: 80.63},
            zoom: 8
        });
    }

    function addMarker(location, title, isHome) {
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

    function centerMapAt(coordinates) {
        map.setCenter(coordinates);
    }

    function disableUserInput() {
        getHomeAddressTextField().disabled = true;
        getLoadLocationsButton().disabled = true;
        getClearLocationsButton().disabled = true;
        showSpinners();
    }

    function showSpinners() {
        document.getElementById("spinner1").className += "glyphicon-refresh spinning";
        document.getElementById("spinner2").className += " glyphicon-refresh spinning";
    }

    function clearHomeAddress() {
        getHomeAddressTextField().value = "";
        getHomeAddressTextField().disabled = false;
    }

    function setHomeAddress(homeAddress) {
        getHomeAddressTextField().value = homeAddress;
        // getHomeAddressTextField().disabled = true;
    }

    function setDataLoadingProgress(currentStatusSummary) {
        document.getElementById("loadingStatus").innerHTML = "<b> Loading Locations, Please wait...</b>" +
            "(Total Location Count :" + currentStatusSummary.totalLocationCount +
            " | Locations attempted to Load :" + currentStatusSummary.attemptedLocationsCount +
            " | Locations Successfully Loaded :" + currentStatusSummary.loadedLocationCount +
            " | Invalid Locations :" + currentStatusSummary.invalidLocationsCount +
            " | Locations Failed to Load due to QUERY_LIMIT :" + currentStatusSummary.queryLimitExceededCount +
            " | Total Failed Locations :" + currentStatusSummary.failedLocationCount +
            ")";
        document.getElementById("loadingStatus").style.display = "block";
    }

    function displaySummary(locationLoadingStats, locationsByDistance, locationsByDuration) {
        displayStatsSummary(locationLoadingStats);
        displaySummaryOfLocationsByDistance(locationsByDistance);
        displaySummaryOfLocationsByDuration(locationsByDuration);
        autoScrollToResults();
        getLoadLocationsButton().value = "Location Loading Completed";
        getClearLocationsButton().value = "Location Loading Completed";
    }

    function autoScrollToResults() {
        location.href = "#";
        location.href = "#divLocationByDistance";
    }

    function displaySummaryOfLocationsByDistance(locationsByDistance) {
        document.getElementById("divLocationByDistance").style.display = "block";
        populateTable(getLocationByDistanceTable(), locationsByDistance, ["location", "distance", "duration"]);
    }

    function displaySummaryOfLocationsByDuration(locationsByDuration) {
        document.getElementById("divLocationByDuration").style.display = "block";
        populateTable(getLocationByDurationTable(), locationsByDuration, ["location", "duration", "distance"]);
    }

    function populateTable(table, data, columnHeaderOrder) {
        // table.style.display = "table";
        for (var i = 0; i < data.length; i++) {
            var row = table.insertRow();
            var indexCell = row.insertCell(0);
            indexCell.innerHTML = i + 1;

            for (var c = 0; c < columnHeaderOrder.length; c++) {
                var cell = row.insertCell(c + 1);
                cell.innerHTML = data[i][columnHeaderOrder[c]];
            }
        }
    }

    function displayStatsSummary(loadingSummary) {
        var summary = "Application has attempted to load all the locations.";
        if (loadingSummary.queryLimitExceededCount > 0) {
            summary = summary + " However " + loadingSummary.queryLimitExceededCount + " locations could not be loaded since you have exceeded the Google Map's " +
                "quota of maximum marker count for a single page load. Therefore please refresh the page by pressing F5. ";
        } else if (loadingSummary.invalidLocationsCount > 0) {
            summary = summary + "Following " + loadingSummary.invalidLocationsCount + " locations could not be found (" + loadingSummary.invalidLocationNames + "). Make sure they are correctly spelled.";
        }
        document.getElementById("loadingStatus").innerHTML = summary;
    }

    function getLocationByDistanceTable() {
        return document.getElementById("locationByDistance");
        ;
    }

    function getLocationByDurationTable() {
        return document.getElementById("locationByDuration");
        ;
    }

    function getHomeAddressTextField() {
        return document.getElementById("homeAddress");
    }

    function getLoadLocationsButton() {
        return document.getElementById("loadLocationBtn");
    }

    function getClearLocationsButton() {
        return document.getElementById("clearLocationsBtn");
    }

    return {
        showMap: showMap,
        addMarker: addMarker,
        centerMapAt: centerMapAt,
        disableUserInput: disableUserInput,
        clearHomeAddress: clearHomeAddress,
        setHomeAddress: setHomeAddress,
        setDataLoadingProgress: setDataLoadingProgress,
        displaySummary: displaySummary
    }
}();

