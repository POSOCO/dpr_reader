/**
 * Created by Nagasudhir on 8/26/2016.
 */
var dprReader = new DPRReader();
var consIDs = ["ChhattisgarhFileInput", "DDFileInput", "DNHFileInput", "ESILFileInput", "GoaFileInput", "GujaratFileInput", "MadhyaPradeshFileInput", "MaharashtraFileInput"];
dprReader.setConsIDs(consIDs);

var peakHrIndex = 19;

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
        handleCSEB();
    } else if (ind == 6) {
        handleMP();
    } else if (ind == 3) {
        handleESIL();
    } else if (ind == 2) {
        handleDNH();
    } else if (ind == 1) {
        handleDD();
    } else if (ind == 4) {
        handleGoa();
    } else if (ind == 5) {
        handleGujarat();
    } else if (ind == 7) {
        handleMaharashtra();
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

function findColumnIndexOfStr(row, tag, isCaseInsensitive) {
    var colNum = row.indexOf(tag);
    if (colNum != -1) {
        return colNum;
    } else if (typeof isCaseInsensitive != 'undefined' && isCaseInsensitive == true) {
        for (var i = 0; i < row.length; i++) {
            if (row[i].toLowerCase() == tag.toLowerCase()) {
                return i;
            }
        }
    }
    return -1;
}

function findRowIndexOfStrInCol(reportArray, colIndex, val, isNumber, startRowToSearch) {
    if (startRowToSearch == null || startRowToSearch < 0 || isNaN(startRowToSearch)) {
        startRowToSearch = 0;
    }
    if (colIndex == -1) {
        return -1;
    }
    for (var i = startRowToSearch; i < reportArray.length && i < startRowToSearch + 100; i++) {
        var cellVal = reportArray[i][colIndex];
        if (isNumber) {
            if (!isNaN(cellVal) && cellVal.trim() != "" && Number(val) == Number(cellVal)) {
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
function findRowIndexOfNonEmptyInCol(reportArray, colIndex, startRowToSearch) {
    if (startRowToSearch == null || startRowToSearch < 0 || isNaN(startRowToSearch)) {
        startRowToSearch = 0;
    }
    if (colIndex == -1) {
        return -1;
    }
    for (var i = startRowToSearch; i < reportArray.length && i < startRowToSearch + 100; i++) {
        var cellVal = reportArray[i][colIndex];
        if (cellVal != null && cellVal.trim() != "") {
            return i;
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

function printFinalResult() {
    WriteLineConsole([dem19hrs_GEB, "", "", dem19hrs_MSEB, "", "", "", ""].join(', '));
    WriteLineConsole([dem19hrs_GEB, dem19hrs_MP, dem19hrs_CSEB, dem19hrs_MSEB - loadShedding24hrs_MSEB[peakHrIndex], dem19hrs_GOA, dem19hrs_DD, dem19hrs_DNH, dem19hrs_ESIL].join(', '));
    WriteLineConsole([0, loadShedding24hrs_MP[peakHrIndex], loadShedding24hrs_CSEB[peakHrIndex], loadShedding24hrs_MSEB[peakHrIndex], loadShedding24hrs_GOA[peakHrIndex], 0, 0, 0].join(', '));
    WriteLineConsole(["", "", "", "", stateGen_GOA, "", "", ""].join(', '));
    WriteLineConsole([drawal_GEB, drawal_MP, drawal_CSEB, drawal_MSEB, drawal_GOA, drawal_DD, drawal_DNH, drawal_ESIL].join(', '));
    WriteLineConsole([requirement_GEB, "", "", "", "", "", drawal_DNH, ""].join(', '));
    WriteLineConsole([availability_GEB, availability_MP, availability_CSEB, availability_MSEB, "", "", drawal_DNH, 0].join(', '));
    WriteLineConsole([requirement_GEB - availability_GEB, shortFallMUs_MP, shortFallMUs_CSEB, shortFallMUs_MSEB, shortFallMUs_GOA, "", "", ""].join(', '));
    WriteLineConsole([solarGen_GEB, solarGen_MP, solarGen_CSEB, solarGen_MSEB, "", "", "", ""].join(', '));
    WriteLineConsole([hydroGen_GEB, hydroGen_MP + hydroGen1_MP + hydroGen2_MP, hydroGen_CSEB, hydroGen_MSEB, "", "", "", ""].join(', '));
    WriteLineConsole([windGen_GEB, windGen_MP, "", windGen_MSEB, "", "", "", ""].join(', '));
    WriteLineConsole([maxDem_GEB, maxDem_MP, maxDem_CSEB, maxDem_MSEB - loadShedding24hrs_MSEB[maxDemTime_MSEB], maxDem_GOA, maxDem_DD, maxDem_DNH, maxDem_ESIL].join(', '));
    WriteLineConsole([0, loadShedding24hrs_MP[maxDemTime_MP - 1], loadShedding24hrs_CSEB[maxDemTime_CSEB - 1], loadShedding24hrs_MSEB[maxDemTime_MSEB - 1], loadShedding24hrs_GOA[maxDemTime_GOA - 1], 0, 0, 0].join(', '));
    WriteLineConsole([maxDemTime_GEB, maxDemTime_MP, maxDemTime_CSEB, maxDemTime_MSEB, maxDemTime_GOA, maxDemTime_DD, maxDemTime_DNH, maxDemTime_ESIL].join(', '));
    WriteLineConsole([dem3hrs_GEB, dem3hrs_MP, dem3hrs_CSEB, dem3hrs_MSEB - loadShedding24hrs_MSEB[2], dem3hrs_GOA, dem3hrs_DD, dem3hrs_DNH, dem3hrs_ESIL].join(', '));
    WriteLineConsole([0, loadShedding24hrs_MP[2], loadShedding24hrs_CSEB[2], loadShedding24hrs_MSEB[2], loadShedding24hrs_GOA[2], 0, 0, 0].join(', '));
}
