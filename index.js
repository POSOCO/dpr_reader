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
        //find the 1stTimeBlk row
        firstBlkRow = findRowIndexOfStrInCol(csebArray, timeBlkCol, 1, true);
        if (firstBlkRow != -1) {
            for (var hr = 1; hr <= 24; hr++) {
                dem24Hrs[hr - 1] = csebArray[firstBlkRow + hr - 1][demandCol];
            }
            for (var hr = 1; hr <= 24; hr++) {
                loadShedding24hrs[hr - 1] = csebArray[firstBlkRow + hr - 1][loadSheddingCol] + csebArray[firstBlkRow + hr - 1][loadSheddingCol + 1];
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
                    loadShedding24hrs[hr - 1] = mpDataArray[firstBlkRow + hr - 1][loadSheddingCol] + mpDataArray[firstBlkRow + hr - 1][loadSheddingCol + 1];
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
        WriteLineConsole("MP Hydro generation is " + (hydroGen + hydroGen1 + hydroGen2));
        WriteLineConsole("MP drawal is " + drawal);
        WriteLineConsole("MP availability is " + availability);
        WriteLineConsole("MP maxDemand is " + maxDem);
        WriteLineConsole("MP maxDemand is at " + maxDemTime + " hrs");
        WriteLineConsole("MP 3HrsDemand is " + dem3hrs);
        WriteLineConsole("MP 19HrsDemand is " + dem19hrs);
        WriteLineConsole("MP 20HrsDemand is " + dem20hrs);
        WriteLineConsole("MP LoadShedding is " + loadShedding24hrs.reduce(function (pv, cv) {
                return pv + cv;
            }, 0) / 1000 + " MUs");
    } else if (ind == 3) {
        //ESIL DATA
        drawal = "NA";
        timeBlkCol = -1;
        firstBlkRow = -1;
        demandCol = -1;
        dem24Hrs = [];
        maxDemTime = 25;
        maxDem = -1;
        dem3hrs = -1;
        dem19hrs = -1;
        dem20hrs = -1;
        var esilDataArray = dprReader.filesAfterReadArrays[consIDs[3]][0];
        for (var i = 0; i < esilDataArray.length; i++) {
            row = esilDataArray[i];
            val = findNonNullValueByTag(row, "Total energy consumption from ISTS:");
            if (val != null) {
                drawal = val;
            }
            val = findColumnIndexOfStr(row, "Time");
            if (!(isNaN(val)) && val >= 0) {
                timeBlkCol = val;
            }
            val = findColumnIndexOfStr(row, "Total ESIL Load (MW)");
            if (!(isNaN(val)) && val >= 0) {
                demandCol = val;
            }
        }
        //find the 1stTimeBlk row
        firstBlkRow = findRowIndexOfStrInCol(esilDataArray, timeBlkCol, "00 -01 hrs.", false);
        if (firstBlkRow != -1) {
            for (var hr = 1; hr <= 24; hr++) {
                dem24Hrs[hr - 1] = esilDataArray[firstBlkRow + hr - 1][demandCol];
            }
        }
        maxDemTime = indexOfMax(dem24Hrs) + 1;
        maxDem = dem24Hrs[maxDemTime - 1];
        dem3hrs = dem24Hrs[2];
        dem19hrs = dem24Hrs[18];
        dem20hrs = dem24Hrs[19];
        WriteLineConsole("ESIL drawal is " + drawal);
        WriteLineConsole("ESIL maxDemand is " + maxDem);
        WriteLineConsole("ESIL maxDemand is at " + maxDemTime + " hrs");
        WriteLineConsole("ESIL 3HrsDemand is " + dem3hrs);
        WriteLineConsole("ESIL 19HrsDemand is " + dem19hrs);
        WriteLineConsole("ESIL 20HrsDemand is " + dem20hrs);
    }
    else if (ind == 2) {
        //DNH DATA
        drawal = "NA";
        timeBlkCol = -1;
        firstBlkRow = -1;
        demandCol = -1;
        dem24Hrs = [];
        maxDemTime = 25;
        maxDem = -1;
        dem3hrs = -1;
        dem19hrs = -1;
        dem20hrs = -1;
        var dnhDataArray = dprReader.filesAfterReadArrays[consIDs[2]][0];
        for (var i = 0; i < dnhDataArray.length; i++) {
            row = dnhDataArray[i];
            val = findNonNullValueByTag(row, "Total Energy Consumption");
            if (val != null) {
                drawal = val;
            }
            val = findColumnIndexOfStr(row, "Hours");
            if (!(isNaN(val)) && val >= 0) {
                timeBlkCol = val;
            }
            val = findColumnIndexOfStr(row, "Demand");
            if (!(isNaN(val)) && val >= 0) {
                demandCol = val;
            }
        }
        //find the 1stTimeBlk row
        firstBlkRow = findRowIndexOfStrInCol(dnhDataArray, timeBlkCol, 0, true);
        if (firstBlkRow != -1) {
            for (var hr = 1; hr <= 24; hr++) {
                dem24Hrs[hr - 1] = dnhDataArray[firstBlkRow + hr - 1][demandCol];
            }
        }
        maxDemTime = indexOfMax(dem24Hrs) + 1;
        maxDem = dem24Hrs[maxDemTime - 1];
        dem3hrs = dem24Hrs[2];
        dem19hrs = dem24Hrs[18];
        dem20hrs = dem24Hrs[19];
        WriteLineConsole("DNH drawal is " + drawal);
        WriteLineConsole("DNH maxDemand is " + maxDem);
        WriteLineConsole("DNH maxDemand is at " + maxDemTime + " hrs");
        WriteLineConsole("DNH 3HrsDemand is " + dem3hrs);
        WriteLineConsole("DNH 19HrsDemand is " + dem19hrs);
        WriteLineConsole("DNH 20HrsDemand is " + dem20hrs);
    }
    else if (ind == 1) {
        //DD DATA
        drawal = "NA";
        timeBlkCol = -1;
        firstBlkRow = -1;
        demandCol = -1;
        dem24Hrs = [];
        maxDemTime = 25;
        maxDem = -1;
        dem3hrs = -1;
        dem19hrs = -1;
        dem20hrs = -1;
        var ddDataArray = dprReader.filesAfterReadArrays[consIDs[1]][0];
        for (var i = 0; i < ddDataArray.length; i++) {
            row = ddDataArray[i];
            val = findNonNullValueByTag(row, "Total Energy Consumption");
            if (val != null) {
                drawal = val;
            }
            val = findColumnIndexOfStr(row, "Hours ");
            if (!(isNaN(val)) && val >= 0) {
                timeBlkCol = val;
            }
            val = findColumnIndexOfStr(row, "Demand");
            if (!(isNaN(val)) && val >= 0) {
                demandCol = val;
            }
        }
        //find the 1stTimeBlk row
        firstBlkRow = findRowIndexOfStrInCol(ddDataArray, timeBlkCol, 1, true);
        if (firstBlkRow != -1) {
            for (var hr = 1; hr <= 24; hr++) {
                dem24Hrs[hr - 1] = ddDataArray[firstBlkRow + hr - 1][demandCol];
            }
        }
        maxDemTime = indexOfMax(dem24Hrs) + 1;
        maxDem = dem24Hrs[maxDemTime - 1];
        dem3hrs = dem24Hrs[2];
        dem19hrs = dem24Hrs[18];
        dem20hrs = dem24Hrs[19];
        WriteLineConsole("DD drawal is " + drawal);
        WriteLineConsole("DD maxDemand is " + maxDem);
        WriteLineConsole("DD maxDemand is at " + maxDemTime + " hrs");
        WriteLineConsole("DD 3HrsDemand is " + dem3hrs);
        WriteLineConsole("DD 19HrsDemand is " + dem19hrs);
        WriteLineConsole("DD 20HrsDemand is " + dem20hrs);
    }
    else if (ind == 4) {
        //GOA DATA
        drawal = "NA";
        timeBlkCol = -1;
        firstBlkRow = -1;
        demandCol = -1;
        dem24Hrs = [];
        maxDemTime = 25;
        maxDem = -1;
        dem3hrs = -1;
        dem19hrs = -1;
        dem20hrs = -1;
        var goaDataArray = dprReader.filesAfterReadArrays[consIDs[4]][0];
        for (var i = 0; i < goaDataArray.length; i++) {
            row = goaDataArray[i];
            val = findNonNullValueByTag(row, "1) WR");
            if (val != null) {
                drawal = val / 1000000;
            }
            val = findColumnIndexOfStr(row, "Hrs");
            if (!(isNaN(val)) && val >= 0) {
                timeBlkCol = val;
            }
            val = findColumnIndexOfStr(row, "Demand in MW");
            if (!(isNaN(val)) && val >= 0) {
                demandCol = val;
            }
        }
        //find the 1stTimeBlk row
        firstBlkRow = findRowIndexOfStrInCol(goaDataArray, timeBlkCol, 1, true);
        if (firstBlkRow != -1) {
            for (var hr = 1; hr <= 24; hr++) {
                dem24Hrs[hr - 1] = Number(goaDataArray[firstBlkRow + hr - 1][demandCol + 1]) + Number(goaDataArray[firstBlkRow + hr - 1][demandCol + 2]) + Number(goaDataArray[firstBlkRow + hr - 1][demandCol + 3]);
            }
        }
        maxDemTime = indexOfMax(dem24Hrs) + 1;
        maxDem = dem24Hrs[maxDemTime - 1];
        dem3hrs = dem24Hrs[2];
        dem19hrs = dem24Hrs[18];
        dem20hrs = dem24Hrs[19];
        WriteLineConsole("GOA drawal is " + drawal);
        WriteLineConsole("GOA maxDemand is " + maxDem);
        WriteLineConsole("GOA maxDemand is at " + maxDemTime + " hrs");
        WriteLineConsole("GOA 3HrsDemand is " + dem3hrs);
        WriteLineConsole("GOA 19HrsDemand is " + dem19hrs);
        WriteLineConsole("GOA 20HrsDemand is " + dem20hrs);
    }
    else if (ind == 5) {
        //GUJARAT DATA
        hydroGen = "NA";
        hydroGen1 = "NA";
        hydroGen2 = "NA";
        var hydroGen3 = "NA";
        windGen = "NA";
        solarGen = "NA";
        var requirement = "NA";
        drawal = "NA";
        var timeBlkRow = -1;
        timeBlkCol = -1;
        firstBlkRow = -1;
        demandCol = -1;
        dem24Hrs = [];
        maxDemTime = 25;
        maxDem = -1;
        dem3hrs = -1;
        dem19hrs = -1;
        dem20hrs = -1;
        var uhpsrow = -1;
        var uhpscol = -1;
        var khpsrow = -1;
        var khpscol = -1;
        var lbcpanamhydro = -1;
        var pvthydro = -1;
        var gujaratDataArray = dprReader.filesAfterReadArrays[consIDs[5]][0];
        for (var i = 0; i < gujaratDataArray.length; i++) {
            row = gujaratDataArray[i];
            val = findNonNullValueByTag(row, "WIND FARM");
            if (val != null) {
                windGen = val;
            }
            val = findNonNullValueByTag(row, "SOLAR ENERGY");
            if (val != null) {
                solarGen = val;
            }
            val = findNonNullValueByTag(row, "UN-RESTRICTED DEMAND");
            if (val != null) {
                requirement = val;
            }
            val = findNonNullValueByTag(row, "CATERED");
            if (val != null) {
                availability = val;
            }
            val = findColumnIndexOfStr(row, "TIME HOURS");
            if (!(isNaN(val)) && val >= 0) {
                timeBlkRow = i;
                timeBlkCol = val;
            }
            val = findColumnIndexOfStr(row, "GUJARAT CATERED");
            if (!(isNaN(val)) && val >= 0) {
                demandCol = val;
            }
            val = findColumnIndexOfStr(row, "FREQ. CORRECT");
            if (!(isNaN(val)) && val >= 0) {
                loadSheddingCol = val - 1;
            }
            val = findColumnIndexOfStr(row, "UHPS");
            if (!(isNaN(val)) && val >= 0) {
                uhpscol = val;
                uhpsrow = i;
            }
            val = findColumnIndexOfStr(row, "KHPS");
            if (!(isNaN(val)) && val >= 0) {
                khpscol = val;
                khpsrow = i;
            }
            val = findNonNullValueByTag(row, "LBC + PANAM");
            if (val != null) {
                lbcpanamhydro = val;
            }
            val = findNonNullValueByTag(row, "PVT HYDRO");
            if (val != null) {
                pvthydro = val;
            }
        }
        //find the 1stTimeBlk row
        if(timeBlkCol >= 0 && !isNaN(timeBlkCol)){
            firstBlkRow = findRowIndexOfStrInCol(gujaratDataArray, timeBlkCol, 1, true, timeBlkRow);
            if (firstBlkRow != -1) {
                for (var hr = 1; hr <= 24; hr++) {
                    dem24Hrs[hr - 1] = Number(gujaratDataArray[firstBlkRow + hr - 1][demandCol]);
                }
            }
        }
        maxDemTime = indexOfMax(dem24Hrs) + 1;
        maxDem = dem24Hrs[maxDemTime - 1];
        dem3hrs = dem24Hrs[2];
        dem19hrs = dem24Hrs[18];
        dem20hrs = dem24Hrs[19];
        //find the uhpshydro value
        if (uhpsrow != -1) {
            var uhpstotalrow = findRowIndexOfStrInCol(gujaratDataArray, uhpscol + 1, "TOTAL", false, uhpsrow);
            var uhpshydro = "NA";
            if (uhpstotalrow != -1) {
                row = gujaratDataArray[uhpstotalrow];
                val = findNonNullValueByTag(row, "TOTAL");
                if (val != null) {
                    uhpshydro = val;
                }
            }
        }
        //find the khpshydro value
        if (khpsrow != -1) {
            var khpstotalrow = findRowIndexOfStrInCol(gujaratDataArray, khpscol + 1, "TOTAL", false, khpsrow);
            var khpshydro = "NA";
            if (khpstotalrow != -1) {
                row = gujaratDataArray[khpstotalrow];
                val = findNonNullValueByTag(row, "TOTAL");
                if (val != null) {
                    khpshydro = val;
                }
            }
        }
        WriteLineConsole("GUJARAT drawal is " + drawal);
        WriteLineConsole("GUJARAT availability is " + availability);
        WriteLineConsole("GUJARAT requirement is " + requirement);
        WriteLineConsole("GUJARAT solar generation is " + solarGen);
        WriteLineConsole("GUJARAT wind generation is " + windGen);
        WriteLineConsole("GUJARAT hydro generation is " + (Number(uhpshydro) + Number(khpshydro) + Number(lbcpanamhydro) + Number(lbcpanamhydro)));
        WriteLineConsole("GUJARAT maxDemand is " + maxDem);
        WriteLineConsole("GUJARAT maxDemand is at " + maxDemTime + " hrs");
        WriteLineConsole("GUJARAT 3HrsDemand is " + dem3hrs);
        WriteLineConsole("GUJARAT 19HrsDemand is " + dem19hrs);
        WriteLineConsole("GUJARAT 20HrsDemand is " + dem20hrs);
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
