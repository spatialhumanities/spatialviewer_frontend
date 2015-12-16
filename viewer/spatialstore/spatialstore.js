GV.Spatialstore = GV.Spatialstore || {};

GV.Spatialstore.punditLoaded = false;

GV.Spatialstore.URL = GV.Config.spatialstoreURL;

GV.Dummy = function(id,name) {
	this.getID = function() { return id; }
	this.getName = function() { return name; }
}

GV.Spatialstore.fillSelect = function(selectID) {
	var callback = function(xml) {
		var xmlSpatialcontexts = xml.getElementsByTagName("spatialcontext");
		var list = [];
		for (var i=0; i<xmlSpatialcontexts.length; i++) {
			list.push(new GV.Dummy(xmlSpatialcontexts[i].getAttribute("href"),xmlSpatialcontexts[i].getAttribute("place")));
		}
		GV.GUI.fillSelect(selectID,list);
        if(GV.Config.SpatialcontextID !== undefined) {
            GV.GUI.execute("spatialcontext", GV.Config.spatialstoreURL + GV.Config.SpatialcontextID);
        } else {
            GV.GUI.execute("spatialcontext", list[0].getID());
        }
		
	}
	IO.readXML(GV.Spatialstore.URL,callback);
}

GV.Spatialstore.Main = function() {
	
	var spatialcontexts = [];
	var sid = false; // selected spatialcontext
	
	// get data
	this.getSpatialcontexts = function() {
		return spatialcontexts;
	}
	this.getSpatialcontext = function(id) {
		return id ? spatialcontexts[id] : spatialcontexts[sid];
	}
	
	// set selected
	this.setSpatialcontext = function(id) {
		if (spatialcontexts[id])
			changeSpatialcontext(id);
		else
			IO.readXML(id,callback,id);
	}
	var callback = function(xml,id) {
		spatialcontexts[id] = new GV.Spatialstore.Spatialcontext(xml);
		spatialcontexts[id].setReferences(spatialcontexts[id]);
		var init = !sid;
		changeSpatialcontext(id);
		if (init && (typeof(initfeature) == 'function'))
                    var furi = initfeature();
                    if (init && furi)
                        GV.GUI.showFeature(furi);
	}
	var changeSpatialcontext = function(id) {
		if (!sid)
			GV.setting.init();
		sid = id;
		GV.GUI.select("spatialcontext",spatialcontexts[id]);
		GV.GUI.fillSelect("viewpoint",spatialcontexts[id].getViewpoints());
		GV.GUI.fillSelect("floorplanmedia",spatialcontexts[id].getFloorplans());
		spatialcontexts[id].setFloorplan(first(spatialcontexts[id].getFloorplans()).getID());
		spatialcontexts[id].setViewpoint(first(spatialcontexts[id].getViewpoints()).getID());
		spatialcontexts[id].setDisplayedFeatures(keys(spatialcontexts[id].getFeatures()));
		spatialcontexts[id].setSelectedFeatures([]);
	}
	
	// set data
	this.update = function(xml,sid,fid) {
        var sc = spatialcontexts[sid];
        var feature = sc.getFeature(fid) || 'undefined';
        
		fid = spatialcontexts[sid].update(fid,xml);
        if(feature == 'undefined')feature = sc.getFeature(fid);
        feature.setReferences(spatialcontexts[sid]);
		return fid;
	}
	
	var updateAllCallback = function(xml,sid) {
		spatialcontexts[sid].updateAll(xml);
		window.setTimeout(function(){IO.updateAll(updateAllCallback)},10000);
	}
	//window.setTimeout(function(){IO.updateAll(updateAllCallback)},10000);
}
