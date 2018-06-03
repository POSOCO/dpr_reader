/**
 * Created by Nagasudhir on 11/11/2017.
 */

var constituentIds_g = {
    'CSEB_State': 'c88b0ddb-e90c-4a89-8855-ac6512897c72',
    'DD_State': 'e881d351-afad-4034-9d22-53c6df736634',
    'DNH_State': 'b49743ce-b4cd-4f5e-bce9-bc6f406c93cd',
    'ESIL_WR State': '9d8d8acb-84ff-4516-8e84-88bc53585277',
    'GEB_State': '2b2428f1-1992-40ef-ac36-d0dfbe843d04',
    'GOA_State': '7fc7317c-89d8-4745-8e31-b865941cbd1a',
    'MSEB_State': '82099353-d9b7-42f8-9e0e-2d5851fc59fa',
    'MP_State': '907e0643-1af6-4acd-8a19-ba0a414fbf04'
};

window.onload = function () {
    var dateYest = new Date(new Date() - 86400000);
    document.getElementById('dateInput').value = makeTwoDigits(dateYest.getDate()) + "-" + makeTwoDigits(dateYest.getMonth() + 1) + "-" + dateYest.getFullYear();
    document.getElementById('latestRevInp').value = 1;
};

function createScheduleLinks() {
    var dateStr = document.getElementById('dateInput').value;
    var revNum = document.getElementById('latestRevInp').value;
    var scheduleLinksDiv = document.getElementById('scheduleLinksDiv');
    scheduleLinksDiv.innerHTML = '';
    var constituents = Object.keys(constituentIds_g);
    var linkUrl;
    var spanEl;
    // get the links of all net schedules
    for (var i = 0; i < constituents.length; i++) {
        linkUrl = "http://scheduling.wrldc.in/wbes/ReportNetSchedule/ExportNetScheduleSummaryToPDF?scheduleDate=" + dateStr + "&sellerId=" + constituentIds_g[constituents[i]] + "&revisionNumber=" + revNum + "&getTokenValue=" + new Date().getTime() + "&fileType=csv&regionId=2&byDetails=1&isBuyer=1&isBuyer=1";

        spanEl = document.createElement('span');
        spanEl.innerHTML = constituents[i] + 'Net Schedule';
        scheduleLinksDiv.appendChild(spanEl);

        scheduleLinksDiv.appendChild(document.createElement("br"));

        var a = document.createElement('a');
        a.className += "schedule_link";
        var linkText = document.createTextNode(linkUrl);
        a.appendChild(linkText);
        a.title = linkUrl;
        a.href = linkUrl;
        a.setAttribute('target', '_blank');
        scheduleLinksDiv.appendChild(a);

        scheduleLinksDiv.appendChild(document.createElement("br"));
        scheduleLinksDiv.appendChild(document.createElement("br"));
    }

    // get the link of All generators Full Schedules
    linkUrl = "http://scheduling.wrldc.in/wbes/ReportFullSchedule/ExportFullScheduleInjSummaryToPDF?scheduleDate=" + dateStr + "&sellerId=ALL&revisionNumber=" + revNum + "&getTokenValue=" + new Date().getTime() + "&fileType=csv&regionId=2&byDetails=0&isDrawer=0&isBuyer=0";
    spanEl = document.createElement('span');
    spanEl.innerHTML = 'All Generators Injection Schedules';
    scheduleLinksDiv.appendChild(spanEl);

    scheduleLinksDiv.appendChild(document.createElement("br"));

    a = document.createElement('a');
    a.className += "schedule_link";
    linkText = document.createTextNode(linkUrl);
    a.appendChild(linkText);
    a.title = linkUrl;
    a.href = linkUrl;
    a.setAttribute('target', '_blank');
    scheduleLinksDiv.appendChild(a);

    scheduleLinksDiv.appendChild(document.createElement("br"));
    scheduleLinksDiv.appendChild(document.createElement("br"));

    // get the link of All generators DC
    linkUrl = "http://scheduling.wrldc.in/wbes/Report/ExportDeclarationRldcToPDF?scheduleDate=" + dateStr + "&getTokenValue=" + new Date().getTime() + "&fileType=csv&Region=2&UtilId=ALL&Revision=" + revNum + "&isBuyer=0&byOnBar=0&byDCSchd=0";
    spanEl = document.createElement('span');
    spanEl.innerHTML = 'All Generators Declared Capacities';
    scheduleLinksDiv.appendChild(spanEl);

    scheduleLinksDiv.appendChild(document.createElement("br"));

    a = document.createElement('a');
    a.className += "schedule_link";
    linkText = document.createTextNode(linkUrl);
    a.appendChild(linkText);
    a.title = linkUrl;
    a.href = linkUrl;
    a.setAttribute('target', '_blank');
    scheduleLinksDiv.appendChild(a);

    scheduleLinksDiv.appendChild(document.createElement("br"));
    scheduleLinksDiv.appendChild(document.createElement("br"));

    // get the link of All generators DC
    linkUrl = "http://scheduling.wrldc.in/wbes/Report/ExportFlowGateScheduleToPDF?scheduleDate=" + dateStr + "&getTokenValue=" + new Date().getTime() + "&fileType=csv&revisionNumber=" + revNum + "&pathId=0&scheduleType=-1&isLink=1";
    spanEl = document.createElement('span');
    spanEl.innerHTML = 'Inter Regional Schedules';
    scheduleLinksDiv.appendChild(spanEl);

    scheduleLinksDiv.appendChild(document.createElement("br"));

    a = document.createElement('a');
    a.className += "schedule_link";
    linkText = document.createTextNode(linkUrl);
    a.appendChild(linkText);
    a.title = linkUrl;
    a.href = linkUrl;
    a.setAttribute('target', '_blank');
    scheduleLinksDiv.appendChild(a);

    scheduleLinksDiv.appendChild(document.createElement("br"));
    scheduleLinksDiv.appendChild(document.createElement("br"));
}

function clickAllLinks() {
    var linkEls = document.getElementsByClassName('schedule_link');
    for (var i = 0; i < linkEls.length; i++) {
        linkEls[i].click();
    }
}

function makeTwoDigits(x) {
    if (isNaN(x)) {
        return x;
    }
    if (x < 10) {
        return "0" + x;
    }
    return x;
}

