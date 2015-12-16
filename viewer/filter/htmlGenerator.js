GV.HTML = GV.HTML || {};

GV.HTML.generate = function (data, callback, position) {
    var html = callback(data);

    // draw: 
    position.html(html);
    GV.Filter.markSelectedFeatures();

}

var tblheaders = [];
GV.HTML.table = function (json) {
    tblheaders = [];
    $.each(GV.Filter.tablecolumns, function (index) {
        tblheaders.push(GV.Filter.tablecolumns[index].getCategory());
    });

    // json2array
    var arr = json["features"];
    var tablecontent = [];

    $.each(arr, function (i) {
        var row = [];
        var obj = arr[i];
        $.each(tblheaders, function (j) {
            var cell = obj[tblheaders[j]];
            if (!cell) {
                cell = "";
            }
            row.push(cell);
        });
        tablecontent.push(row);
    });
    GV.Filter.tablecontent = tablecontent;

    //Nicht gefilterte Features werden ausgeblendet
    var urilist = [];
    for (i = 0; i < tablecontent.length; i++) {
        // TODO link dynamisch!
        //urilist.push("http://ibr.spatialhumanities.de/ephesos/rest/Ephesos/features/" + tablecontent[i][0]);
       urilist.push(GV.setting.spatialstore.getSpatialcontext().getID() + "/features/" + tablecontent[i][0]);
    }
   
    if (GV.setting.spatialstore.getSpatialcontext()) {
        GV.setting.spatialstore.getSpatialcontext().setDisplayedFeatures(urilist);
        GV.info.filterResultCount(Object.keys(GV.setting.spatialstore.getSpatialcontext().getDisplayedFeatures()).length);
    }

    return GV.HTML.arrayToTable(tablecontent);

}

//wird nach dem sortieren benötigt
GV.HTML.arrayToTable = function (tablecontent) {
    var out = "<div class=\"headerwrapper\"><div class=\"row header\"><span id=\"overline\"></span>";
    $.each(tblheaders, function (i) {
        if (i == 0 && tblheaders.length > 1)
            out += "<div class='columnid'>" + tblheaders[i] + "<span class='icon-dropdown iconfont'></span></div>";
        else if (i == 0 && tblheaders.length == 1)
            out += "<div class='columnid'>" + tblheaders[i] + "<span class='icon-dropdown iconfont'></span></div><div class='noflyout'></div>";
        else if (i == tblheaders.length - 1)
            out += "<div class='" + tblheaders[i] + "'>" + tblheaders[i] + "<span class='icon-dropdown iconfont'></span></div><div class='noflyout'></div>";
        else
            out += "<div class='" + tblheaders[i] + "'>" + tblheaders[i] + "<span class='icon-dropdown iconfont'></span></div>";
    });
    out += "</div></div>";

    var lastline = tablecontent[0];
    for (var i = 0; i < tablecontent.length; i++) {
        if (i === 0) {
            out += "<div class='row first'";
        } else {
            if (checkArraysEqual(lastline, tablecontent[i]))
                continue;
            else { 
                out += "<div class='row'";
                lastline = tablecontent[i]; 
            }
        }


        for (var k = 0; k < tablecontent[i].length; k++) {
                var val = tablecontent[i][k];
                if (!val || val === "") {
                    val = "\"\"";
                }
                out += "data-" + tblheaders[k] + "=" + val + " ";
        }
        out += ">";


        for (var j = 0; j < tablecontent[i].length; j++) {
            if (j == 0) {
                if (tablecontent[i].length > 1) {
                    out += "<div class='columnid mark' onclick='GV.setting.spatialstore.getSpatialcontext().setSelectedFeatures([\"" + GV.setting.spatialstore.getSpatialcontext().getID() + "/features/" + tablecontent[i][j] + "\"],true); return false;' id=" + j + "><span class='icon-unselected iconfont'></span>" + tablecontent[i][j] + "</div>";
                }
                else {
                    out += "<div class='columnid mark' onclick='GV.setting.spatialstore.getSpatialcontext().setSelectedFeatures([\"" + GV.setting.spatialstore.getSpatialcontext().getID() + "/features/" + tablecontent[i][j] + "\"],true); return false;' id=" + j + "><span class='icon-unselected iconfont'></span>" + tablecontent[i][j] + "</div><div class='link'><a href='javascript:GV.GUI.showFeature(\"" + GV.setting.spatialstore.getSpatialcontext().getID() + "/features/" + tablecontent[i][0] + "\")'><span class='icon-camera iconfont'></span></a></div>";
                }
            } else {
                
                if(tblheaders[j] == "img" && tablecontent[i][j] != ""){
                    out += "<div class='" + tblheaders[j] + "'><img width='133' src='" + tablecontent[i][j] + "'/></div>"; 
                }
                else {
                    out += "<div class='" + tblheaders[j] + "'>" + tablecontent[i][j] + "</div>";
                }

                if (j == tablecontent[i].length - 1) {
                    out += "<div class='link'><a href='javascript:GV.GUI.showFeature(\"" + GV.setting.spatialstore.getSpatialcontext().getID() + "/features/" + tablecontent[i][0] + "\")'><span class='icon-camera iconfont'></span></a></div>";
                }
            }

        }
        out += "</div>";
    }
    return out;
    


}



// TODO HTMLInterface
GV.HTML.constructFlyout = function (id, flyoutclass, locationid, listcontent, object) {

    var query = '<ul>';
    for (var i = 0; i < listcontent.length; i++) {
        query += '<li><a val="' + '#' + '">' + listcontent[i] + '</a></li>';
    }
    query += '</ul>';
    var dummylist = $(query);

    $('<div/>', {
        'id': id,
        'class': flyoutclass,
        'html': dummylist
    }).appendTo("." + locationid);
    $(".nano").nanoScroller();
}




GV.HTML.constructTabHeader = function (tabs) {
    $("#smalltabheader").remove();
    $("#annotationsearch").remove();
    var tabheaderhtml = "<div id='smalltabheader'><div id='annotationsearch'></div><div class='tabnavigation'>";
    if (tabs) {
        for (i = 0; i < tabs.length; i++) {
            tabheaderhtml += "<a id='" + tabs[i] + "' href='#'>" + tabs[i] + "</a>";
        }
        tabheaderhtml += "</div></div>";
        $(tabheaderhtml).prependTo("#annotateflyout");
        //console.log("made tabheader");
    }
    else {
        tabheaderhtml = "<div id='smalltabheader'><div id='annotationsearch'></div></div>";

        $(tabheaderhtml).prependTo("#annotateflyout");
       
    }
}


GV.HTML.constructTabHeaderFilter = function(tabs){

    $("#smalltabheader").remove();
    var tabheaderhtml = "<div id='smalltabheader'><div id='annotationsearch'></div><div class='tabnavigation'>";
    if(tabs){
        for (i=0; i<tabs.length; i++){
            tabheaderhtml += "<a id='" + tabs[i] + "filter' href='#'>" + tabs[i] + "</a>";
        }
        tabheaderhtml += "</div></div>";

        $(tabheaderhtml).prependTo("#filtertabcontent");
    }
    else {
        tabheaderhtml = "<div id='annotationsearch'></div></div>";

        $(tabheaderhtml).prependTo("#filtertabcontent");
    }
}




GV.HTML.constructAnnotationList = function(type, filter){

    $(".annotationswrapper").remove();
    $(".featureswrapper").remove();
    $(".filterform").remove();
    $("#textsend").remove();
    $("#textbox").remove();
    var listhtml = "<div class='annotationswrapper tabcontent" + type + "' id='tab2'>";
    for (var i = 0; i < GV.Annotate.annotationinterface.listElements.length; i++) {
        if(!filter){       
        listhtml += "<a class='annotationlist' id='" + GV.Annotate.annotationinterface.listElements[i][0] + "'>" + GV.Annotate.annotationinterface.listElements[i][1] + "</a>";
    }
        else {
            listhtml += "<a class='tabfilterlist' id='" + GV.Annotate.annotationinterface.listElements[i][0] + "'>" + GV.Annotate.annotationinterface.listElements[i][1] + "</a>";
        }
    }
    listhtml += "</div>";
    var listhtml = $(listhtml);

    if(!filter){   
    $("#annotateflyout").append(listhtml);
    }
    else {
        $("#filtertabcontent").append(listhtml);
    }
    $(".nano").nanoScroller();

}


GV.HTML.constructFeatureList = function(filter){

    $(".annotationswrapper").remove();
    $(".featureswrapper").remove();
    $(".filterform").remove();
    $("#textsend").remove();
    $("#textbox").remove();
    var listhtml = "<div class='featureswrapper tabcontent' id='featurelist'>";
    Object.keys(GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures()).forEach(function (key) {
        if(!filter){
        listhtml += "<a id='" + key + "' class='annotationlist' data-type='feature'>";
        }
        else {
            listhtml += "<a id='" + key + "' class='tabfilterlist' data-type='feature'>";
        }
        listhtml += key.substring(key.indexOf('features/') + 9, key.length);
        listhtml += "</a>";
    });
    listhtml += "</div>";
    if(!filter){
        $(listhtml).appendTo("#annotateflyout"); 
    }
    else {
        $(listhtml).appendTo("#filtertabcontent"); 
    }
    listFilterAnnotator($(".featureswrapper"), $("#annotationsearch"));
    $(".nano").nanoScroller();



}

GV.HTML.constructAllFeaturesList = function(filter){

    $(".annotationswrapper").remove();
    $(".featureswrapper").remove();
    $(".filterform").remove();
    $("#textsend").remove();
    $("#textbox").remove();
    var listhtml = "<div class='featureswrapper tabcontent' id='featurelist'>";
    Object.keys(GV.setting.spatialstore.getSpatialcontext().getFeatures()).forEach(function (key) {
      
        listhtml += "<a id='" + key + "' class='tabfilterlist' data-type='feature'>";
        listhtml += key.substring(key.indexOf('features/') + 9, key.length);
        listhtml += "</a>";
    });
    listhtml += "</div>";
   
    $(listhtml).appendTo("#filtertabcontent"); 
    listFilterAnnotator($(".featureswrapper"), $("#annotationsearch"));
    $(".nano").nanoScroller();



}



GV.HTML.constructTextBox = function(filter){

    $(".annotationswrapper").remove();
    $(".featureswrapper").remove();
    $(".filterform").remove();
    $("#textsend").remove();
    $("#textbox").remove();
    var listhtml = "<textarea id='textbox'></textarea><span id='textsend'>Assign</span>";

    $(listhtml).appendTo("#annotateflyout"); 
    $(".nano").nanoScroller();



}


/**
 * Erweiterung für die Klasse Array um zu prüfen, ob zwei Arrays den gleichen Inhalt haben.
 * http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript
 */
var checkArraysEqual = function (array1, array2) {
    if (!array1)
        if (!array2)
            return true
        else
            return false;

    // compare length
    if (array1.length !== array2.length)
        return false;

    // compare values
    for (var i = 0; i < array1.length; i++) {
        // for nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (!array1[i].equals(array2[i])) {
                return false;
            }
            // check if values are the same
        } else if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
}