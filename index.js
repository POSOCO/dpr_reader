/**
 * Created by Nagasudhir on 8/26/2016.
 */
var dprReader = new DPRReader();
var consIDs = ["ChhattisgarhFileInput", "DDFileInput", "DNHFileInput", "ESILFileInput", "GoaFileInput", "GujaratFileInput", "MadhyaPradeshFileInput", "MaharashtraFileInput"];
dprReader.setConsIDs(consIDs);

window.onload = function () {
    for (var i = 0; i < consIDs.length; i++) {
        var fileInput = document.getElementById(consIDs[i]);
        fileInput.addEventListener('change', function (e) {
            var fileInput = e.target;
            dprReader.resetAndCreateArrays(fileInput.getAttribute("id"));
            for (var b = 0; b < fileInput.files.length; b++) {
                dprReader.pushFiles(fileInput.files[b], fileInput.getAttribute("id"));
            }
            dprReader.afterEachRead(fileInput.getAttribute("id"));
        });
    }
};

function fetchFromArrays(ind) {
    if (ind == 0) {
        //It is Chhattisgarh
        var hydroGen = "NA";
        var drawal = "NA";
        var availabilityExc = "NA";
        var availabilityAux = "NA";
        var availability = "NA";
        var timeBlkCol = -1;
        var firstBlkRow = -1;
        var demandCol = -1;
        var loadSheddingCol = -1;
        var dem24Hrs = [];
        var loadShedding24hrs = [];
        var maxDemTime = 25;
        var maxDem = -1;
        var dem3hrs = -1;
        var dem19hrs = -1;
        var dem20hrs = -1;
        var csebArray = dprReader.filesAfterReadArrays[consIDs[0]][0];
        for (var i = 0; i < csebArray.length; i++) {
            var row = csebArray[i];
            var val = findNonNullValueByTag(row, "TOTAL HYDEL");
            if (val != null) {
                hydroGen = val;
            }
            val = findNonNullValueByTag(row, "STATE DRAWL FROM GRID");
            if (val != null) {
                drawal = val;
            }
            val = findNonNullValueByTag(row, "STATE CONSUM EXC AUX");
            if (val != null) {
                availabilityExc = val;
            }
            val = findNonNullValueByTag(row, "AUX. CONSUMPTION");
            if (val != null) {
                availabilityAux = val;
            }
            val = findColumnIndexOfStr(row, "TIME IN HRS");
            if (!(isNaN(val)) && val >= 0) {
                timeBlkCol = val;
            }
            val = findColumnIndexOfStr(row, "DEMAND MW");
            if (!(isNaN(val)) && val >= 0) {
                demandCol = val;
            }
            val = findColumnIndexOfStr(row, "SCH. RELIEF");
            if (!(isNaN(val)) && val >= 0) {
                loadSheddingCol = val;
            }
        }
        if (availabilityAux != null && availabilityExc != null) {
            availability = Number(availabilityAux) + Number(availabilityExc);
        }
        //find the 1stTimeBlk row
        firstBlkRow = findRowIndexOfStrInCol(csebArray, timeBlkCol, 1, true);
        for (var hr = 1; hr <= 24; hr++) {
            dem24Hrs[hr - 1] = csebArray[firstBlkRow + hr - 1][demandCol];
        }
        for (var hr = 1; hr <= 24; hr++) {
            loadShedding24hrs[hr - 1] = csebArray[firstBlkRow + hr - 1][loadSheddingCol];
        }
        maxDemTime = indexOfMax(dem24Hrs) + 1;
        maxDem = dem24Hrs[maxDemTime - 1];
        dem3hrs = dem24Hrs[2];
        dem19hrs = dem24Hrs[18];
        dem20hrs = dem24Hrs[19];
        WriteLineConsole("CSEB Hydro generation is " + hydroGen);
        WriteLineConsole("CSEB drawal is " + drawal);
        WriteLineConsole("CSEB availability is " + availability);
        WriteLineConsole("CSEB maxDemand is " + maxDem);
        WriteLineConsole("CSEB maxDemand is at " + maxDemTime + " hrs");
        WriteLineConsole("CSEB 3HrsDemand is " + dem3hrs);
        WriteLineConsole("CSEB 19HrsDemand is " + dem19hrs);
        WriteLineConsole("CSEB 20HrsDemand is " + dem20hrs);
        WriteLineConsole("CSEB LoadShedding is " + loadShedding24hrs.reduce(function (pv, cv) {
                return pv + cv;
            }, 0) / 1000 + " MUs");

    }
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function findColumnIndexOfStr(row, tag) {
    return row.indexOf(tag);
}

function findRowIndexOfStrInCol(reportArray, colIndex, val, isNumber) {
    for (var i = 0; i < 100; i++) {
        var cellVal = reportArray[i][colIndex];
        if (isNumber) {
            if (!isNaN(cellVal) && Number(val) == Number(cellVal)) {
                return i;
            }
        } else {
            if (val == cellVal) {
                return i;
            }
        }
    }
    return -1;
}

function findNonNullValueByTag(row, tag) {
    var searchTagIndex = row.indexOf(tag);
    if (searchTagIndex > -1) {
        //found total tag value
        return findNonNullValueToRight(row, searchTagIndex);
    }
    return null;
}

function findNonNullValueToRight(row, searchTagIndex) {
    //proceed right and find value that is not null or "" or any spaces
    for (var i = 1; i < row.length - searchTagIndex; i++) {
        var val = row[searchTagIndex + i];
        if ((val != null) && (val.trim() != "")) {
            return val;
        }
    }
    return "Not Found...";
}