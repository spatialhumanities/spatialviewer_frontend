GV.Report = GV.Report || {};

$(document).on("click", '#downloadreport', function (e) {
    GV.Report.getData();

});

GV.Report.getData = function () {
    var reportData = {};
    // Daten sammeln, die in json zur berichterstellung gebraucht werden
    // url
    reportData.url = document.URL;    
    // nutzer (falls eingeloggt, ansonsten anonym
    reportData.user = GV.openid.getUser();
    // name des spatialcontext (name + beschreibung?)
    reportData.scname = GV.setting.spatialstore.getSpatialcontext().getName();
    reportData.scuri = GV.setting.spatialstore.getSpatialcontext().getID();
    // gesetzte filter
    reportData.filter = GV.Filter.getFilterArray();
    // ausgewähtle spalten
    reportData.tablecolumns = getHeaderNames(GV.Filter.tablecolumns);
    // gesamter tabelleninhalt
    reportData.tablecontent = GV.Filter.tablecontent;
    
    reportData.featurens = GV.setting.spatialstore.getSpatialcontext().getID() + "/features/";
    
    
    getReportFile(reportData);

};

getHeaderNames = function (input) {
    var headers = [];
    for (var c in input) {
        headers.push(input[c].getCategory());
    }
    return headers;
};

getReportFile = function(data) {

    var json = {};
    json.type = "report";
    json.format = 'txt';
    json.params = data;
    var jsonAsString = JSON.stringify(json);

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", GV.Config.spatialstoreURL + "export");

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "json");
    hiddenField.setAttribute("value", jsonAsString);
    
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
}

