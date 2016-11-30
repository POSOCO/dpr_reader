/**
 * Created by Nagasudhir on 8/26/2016.
 */
var dprReader = new DPRReader();
var consIDs = ["ChhattisgarhFileInput", "DDFileInput", "DNHFileInput", "ESILFileInput", "GoaFileInput", "GujaratFileInput", "MadhyaPradeshFileInput", "MaharashtraFileInput"];
dprReader.setConsIDs(consIDs);

var peakHrIndex = 18;

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
        var solarGen = "NA";
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
            val = findColumnIndexOfStr(row, "TOTAL SOLAR GEN IN MU");
            if (!(isNaN(val)) && val >= 0) {
                var solarCol = val;
                var solarRow = i;
            }
        }
        //find the 1stTimeBlk row
        firstBlkRow = findRowIndexOfStrInCol(csebArray, timeBlkCol, 1, true);
        if (firstBlkRow != -1) {
            for (var hr = 1; hr <= 24; hr++) {
                dem24Hrs[hr - 1] = csebArray[firstBlkRow + hr - 1][demandCol];
            }
            for (var hr = 1; hr <= 24; hr++) {
                loadShedding24hrs[hr - 1] = Number(csebArray[firstBlkRow + hr - 1][loadSheddingCol]) + Number(csebArray[firstBlkRow + hr - 1][loadSheddingCol + 1]);
            }
        }
        if (availabilityAux != null && availabilityExc != null) {
            availability = Number(availabilityAux) + Number(availabilityExc);
        }
        maxDemTime = indexOfMax(dem24Hrs) + 1;
        maxDem = dem24Hrs[maxDemTime - 1];
        dem3hrs = dem24Hrs[2];
        dem19hrs = dem24Hrs[18];
        dem20hrs = dem24Hrs[19];
        var shortFallMUs = loadShedding24hrs.reduce(function (pv, cv) {
                return pv + cv;
            }, 0) / 1000;
        //find the 1stNonEmpty row
        var solarValRow = findRowIndexOfNonEmptyInCol(csebArray, solarCol, solarRow + 1);
        if (solarValRow != -1) {
            solarGen = csebArray[solarValRow][solarCol];
        }
        WriteLineConsole("*********** CSEB DATA ***********");
        WriteLineConsole("");
        WriteLineConsole(dem19hrs);
        WriteLineConsole(loadShedding24hrs[18]);
        WriteLineConsole("");
        WriteLineConsole(drawal);
        WriteLineConsole("");
        WriteLineConsole(availability);
        WriteLineConsole(shortFallMUs);
        WriteLineConsole(solarGen);
        WriteLineConsole(hydroGen);
        WriteLineConsole("");
        WriteLineConsole(maxDem);
        WriteLineConsole(loadShedding24hrs[maxDemTime - 1]);
        WriteLineConsole(maxDemTime);
        WriteLineConsole(dem3hrs);
        WriteLineConsole(loadShedding24hrs[2]);
        WriteLineConsole("*********** CSEB DATA ***********");
        WriteLineConsole("CSEB Hydro generation is " + hydroGen);
        WriteLineConsole("CSEB drawal is " + drawal);
        WriteLineConsole("CSEB availability is " + availability);
        WriteLineConsole("CSEB maxDemand is " + maxDem);
        WriteLineConsole("CSEB maxDemand is at " + maxDemTime + " hrs");
        WriteLineConsole("CSEB 3HrsDemand is " + dem3hrs);
        WriteLineConsole("CSEB 19HrsDemand is " + dem19hrs);
        WriteLineConsole("CSEB 20HrsDemand is " + dem20hrs);
        WriteLineConsole("CSEB LoadShedding is " + shortFallMUs + " MUs");

    } else if (ind == 6) {
        //MP data
        hydroGen = "NA";
        var hydroGen1 = "NA";
        var hydroGen2 = "NA";
        var solarGen = "NA";
        var windGen = "NA";
        drawal = "NA";
        availabilityExc = "NA";
        availabilityAux = "NA";
        availability = "NA";
        timeBlkCol = -1;
        firstBlkRow = -1;
        demandCol = -1;
        loadSheddingCol = -1;
        dem24Hrs = [];
        loadShedding24hrs = [];
        maxDemTime = 25;
        maxDem = -1;
        dem3hrs = -1;
        dem19hrs = -1;
        dem20hrs = -1;
        for (var k = 0; k < 2; k++) {
            var mpDataArray = dprReader.filesAfterReadArrays[consIDs[6]][k];
            for (var i = 0; i < mpDataArray.length; i++) {
                row = mpDataArray[i];
                val = findNonNullValueByTag(row, "MP HYDEL");
                if (val != null) {
                    hydroGen = val / 10;
                }
                val = findNonNullValueByTag(row, "Indira Sagar");
                if (val != null) {
                    hydroGen1 = val / 10;
                }
                val = findNonNullValueByTag(row, "Omkareshwar");
                if (val != null) {
                    hydroGen2 = val / 10;
                }
                val = findNonNullValueByTag(row, "MP Drawal LU");
                if (val != null) {
                    drawal = val / 10;
                }
                val = findNonNullValueByTag(row, "M.P.Supply Excl");
                if (val != null) {
                    availabilityExc = val / 10;
                }
                val = findNonNullValueByTag(row, "Aux.Cons.  LU");
                if (val != null) {
                    availabilityAux = val / 10;
                }
                val = findNonNullValueByTag(row, "Wind Injection");
                if (val != null) {
                    windGen = val / 10;
                }
                val = findNonNullValueByTag(row, "Solar Injection");
                if (val != null) {
                    solarGen = val / 10;
                }
                val = findColumnIndexOfStr(row, "HOURS");
                if (!(isNaN(val)) && val >= 0) {
                    timeBlkCol = val;
                }
                val = findColumnIndexOfStr(row, "CATERED\nDEMAND\nIncl Aux.Cons.");
                if (!(isNaN(val)) && val >= 0) {
                    demandCol = val;
                }
                val = findColumnIndexOfStr(row, " L.S.");
                if (!(isNaN(val)) && val >= 0) {
                    loadSheddingCol = val;
                }
            }
            //find the 1stTimeBlk row
            firstBlkRow = findRowIndexOfStrInCol(mpDataArray, timeBlkCol, 1, true);
            if (firstBlkRow != -1) {
                for (var hr = 1; hr <= 24; hr++) {
                    dem24Hrs[hr - 1] = mpDataArray[firstBlkRow + hr - 1][demandCol];
                }
                for (var hr = 1; hr <= 24; hr++) {
                    loadShedding24hrs[hr - 1] = Number(mpDataArray[firstBlkRow + hr - 1][loadSheddingCol]) + Number(mpDataArray[firstBlkRow + hr - 1][loadSheddingCol + 1]);
                }
            }
        }
        if (availabilityAux != null && availabilityExc != null) {
            availability = Number(availabilityAux) + Number(availabilityExc);
        }
        maxDemTime = indexOfMax(dem24Hrs) + 1;
        maxDem = dem24Hrs[maxDemTime - 1];
        dem3hrs = dem24Hrs[2];
        dem19hrs = dem24Hrs[18];
        dem20hrs = dem24Hrs[19];
        var shortFallMUs = loadShedding24hrs.reduce(function (pv, cv) {
                return pv + cv;
            }, 0) / 1000;
        WriteLineConsole("*********** MP DATA ***********");
        WriteLineConsole("");
        WriteLineConsole(dem19hrs);
        WriteLineConsole(loadShedding24hrs[18]);
        WriteLineConsole("");
        WriteLineConsole(drawal);
        WriteLineConsole("");
        WriteLineConsole(availability);
        WriteLineConsole(shortFallMUs);
        WriteLineConsole(solarGen);
        WriteLineConsole(hydroGen + hydroGen1 + hydroGen2);
        WriteLineConsole(windGen);
        WriteLineConsole(maxDem);
        WriteLineConsole(loadShedding24hrs[maxDemTime - 1]);
        WriteLineConsole(maxDemTime);
        WriteLineConsole(dem3hrs);
        WriteLineConsole(loadShedding24hrs[2]);
        WriteLineConsole("*********** MP DATA ***********");
        WriteLineConsole("MP Hydro generation is " + (hydroGen + hydroGen1 + hydroGen2));
        WriteLineConsole("MP Solar Generation is " + solarGen);
        WriteLineConsole("MP Wind Generation is " + windGen);
        WriteLineConsole("MP drawal is " + drawal);
        WriteLineConsole("MP availability is " + availability);
        WriteLineConsole("MP maxDemand is " + maxDem);
        WriteLineConsole("MP maxDemand is at " + maxDemTime + " hrs");
        WriteLineConsole("MP 3HrsDemand is " + dem3hrs);
        WriteLineConsole("MP 19HrsDemand is " + dem19hrs);
        WriteLineConsole("MP 20HrsDemand is " + dem20hrs);
        WriteLineConsole("MP LoadShedding is " + shortFallMUs + " MUs");
    } else if (ind == 3) {
        handleESIL();
    }
    else if (ind == 2) {
        handleDNH();
    }
    else if (ind == 1) {
        handleDD();
    }
    else if (ind == 4) {
        handleGoa();
    }
    else if (ind == 5) {
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

function findColumnIndexOfStr(row, tag) {
    return row.indexOf(tag);
}

function findRowIndexOfStrInCol(reportArray, colIndex, val, isNumber, startRowToSearch) {
    if (startRowToSearch == null || startRowToSearch < 0 || isNaN(startRowToSearch)) {
        startRowToSearch = 0;
    }
    if (colIndex == -1) {
        return -1;
    }
    for (var i = startRowToSearch; i < startRowToSearch + 100; i++) {
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
    for (var i = startRowToSearch; i < startRowToSearch + 100; i++) {
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
