GV.Filter.list = [];


/**
 * - get all features from sc
 * - check if some feature is being edited, get id
 * - check each feature from sc if it's contained all filter lists
 * - if true and if not being edited, push the feature to list
 * - use list to set displayed features
 * 
 * @param {type} spatialcontext spatialcontext
 * @returns {Array|GV.Filter.filter.list} features to display
 */
/*
 GV.Filter.filter = function (spatialcontext) {
 
 var features = keys(spatialcontext.getFeatures());
 var measurement = GV.setting.getMeasurement();
 var fid = measurement ? measurement.getFid() : false;
 var list = [];
 for (var i in features) {
 if (features[i] == fid)
 continue;
 var c = true;
 for (var index in GV.Filter.list)
 // TODO auf neue filterliste (GV.Filter.filterInstances) anpassen
 if (!contains(GV.Filter.list[index], features[i]))
 c = false;
 if (c)
 list.push(features[i]);
 }
 spatialcontext.setDisplayedFeatures(list);
 //spatialcontext.setSelectedFeatures(list);
 return list;
 }*/

GV.Filter.filter = function (spatialcontext) {
    if (typeof GV.Filter.tablecontent === 'undefined' || GV.Filter.tablecontent.length <= 0) {
        window.setTimeout(function () {
            GV.Filter.filter(spatialcontext);
        }, 1000);
    } else {
        GV.Filter.list = [];

        $.each(GV.Filter.tablecontent, function (index, nextLine) {
            GV.Filter.list.push(spatialcontext.getID() + "/features/" + nextLine[0]);
        });

        var features = GV.Filter.list; //keys(spatialcontext.getFeatures());
        var measurement = GV.setting.getMeasurement();
        var fid = measurement ? measurement.getFid() : false;
        var list = [];
        for (var i in features) {
            if (features[i] == fid)
                continue;
            if($.inArray(features[i], GV.Filter.list)) {
                list.push(features[i]);
            }
                
        }
        spatialcontext.setDisplayedFeatures(list);
        //spatialcontext.setSelectedFeatures(list);
        return list;
    }
}

/**
 * bin nicht sicher, ob diese Funktionen jemals aufgerufen werden:
 *
 
 
 GV.Filter.DAY = 1000*60*60*24;
 
 
 
 GV.Filter.savedQueries = function(name) {
 document.getElementById("sparql").value = GV.Filter.savedQueries.list[name];
 }
 
 
 
 
 
 GV.Filter.savedQueries.list = [];
 
 
 
 
 
 GV.Filter.addSparql = function(xml) {
 var fids = [];
 var uris = xml.getElementsByTagName("uri");
 for (var i in uris) {
 if (uris[i].textContent)
 fids.push(uris[i].textContent);
 }
 GV.Filter.addSet("sparql",fids);
 }
 
 
 
 
 GV.Filter.viewpoint = function(set) {
 var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
 if (spatialcontext) {
 GV.Filter.filter(spatialcontext,"viewpoint",keys(spatialcontext.getViewpoint().getFeatures()),set);
 GV.Filter.display("filterViewpoint",set);
 }
 } 
 
 
 
 
 
 /** 
 */