GV.Spatialstore.Viewpoint = function(xml) {
	
	// data
	var panoramas = [];
	var pid = false; // panorama
	var transformation = new mat4(xml.getElementsByTagName("params")[0].firstChild.data);
	var features = [];
	var floorplans = [];
	
	// identifiers
	var href = xml.getAttribute("href");
	var name = xml.getAttribute("id");
	
	var xmlPanoramas = xml.getElementsByTagName("panorama");
	for (var i=0; i<xmlPanoramas.length; i++) {
		var id = xmlPanoramas[i].getAttribute("id");
		panoramas[id] = new GV.Spatialstore.Panorama(xmlPanoramas[i]);
	}
	var xmlFeatures = xml.getElementsByTagName("feature");
	for (var i=0; i<xmlFeatures.length; i++) {
		var id = xmlFeatures[i].getAttribute("href");
		features[id] = true;
	}
	var xmlFloorplans = xml.getElementsByTagName("media");
	for (var i=0; i<xmlFloorplans.length; i++) {
		var id = xmlFloorplans[i].getAttribute("filename");
		floorplans[id] = true;
	}
	
	// get ID Name
	this.getID = function() {
		return href;
	}
	this.getName = function() {
		return name;
	}
	
	// get data
	this.getTransformation = function() {
		return transformation;
	}
	this.getPanoramas = function() {
		return panoramas;
	}
	this.getPanorama = function(id) {
		return id ? panoramas[id] : panoramas[pid];
	}
	this.getFeatures = function() {
		return features;
	}
	this.getFeature = function(id) {
		return features[id];
	}
	
	// set selected
	this.setPanorama = function(id) {
		pid = id;
		GV.GUI.select("panorama",panoramas[id]);
		GV.setting.changeViewerPanorama();
	}
	
	// set data
	this.setReferences = function(spatialcontext) {
		for (id in features) {
			features[id] = spatialcontext.getFeature(id);
		}
		for (id in floorplans) {
			floorplans[id] = spatialcontext.getFloorplan(id);
		}
	}
	this.addFeature = function(id,feature) {
		features[id] = feature;
	}
	this.removeFeature = function(id) {
		delete features[id];
	}
}
