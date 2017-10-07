function summariseHospitalsByDistance(hospitalsByDistance, hospitalsByDuration) {
    console.warn("\n\n\n -------------- Hospitals by Distance -------------- ")
    var keysSorted = Object.keys(hospitalsByDistance).sort(function (a, b) {
        return hospitalsByDistance[a].replace(" km", "") - hospitalsByDistance[b].replace(" km", "")
    });
    for (var i = 0; i < keysSorted.length; i++) {
        console.log(keysSorted[i] + " : " + hospitalsByDistance[keysSorted[i]] + "  (" + hospitalsByDuration[keysSorted[i]] + ")");
    }
}

function summariseHospitalsByDuration(hospitalsByDistance, hospitalsByDuration) {
    console.warn("\n\n\n -------------- Hospitals by Travel Time -------------- ")
    var keysSorted = Object.keys(hospitalsByDuration).sort(function (a, b) {
        return getTimeInMins(hospitalsByDuration[a]) - getTimeInMins(hospitalsByDuration[b])
    });

    for (var i = 0; i < keysSorted.length; i++) {
        console.log(keysSorted[i] + " : " + hospitalsByDuration[keysSorted[i]] + " (" + hospitalsByDistance[keysSorted[i]] + ")");
    }
}

function getTimeInMins(timeStr) {
    var hour = 0;
    var min = 0;
    var hourMarker = " hour ";
    var time = timeStr;


    if (time.indexOf(" hours ") > 0) {
        hourMarker = " hours ";
    }

    if (time.indexOf(hourMarker) !== -1) {
        hour = time.split(hourMarker)[0];
        time = time.split(hourMarker)[1];
    }
    if (time.indexOf("mins") !== -1) {
        min = time.split("mins")[0];
    }

    return (parseInt(hour) * 60) + parseInt(min);
}