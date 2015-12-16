GV.Spatialstore.Floorplanmedia = function(xml) {
	
	// data
	var transformation = new mat4(xml.getElementsByTagName("params")[0].firstChild.data);
	var viewpoints = [];
	
	// identifiers
	var href = xml.getElementsByTagName("filename")[0].firstChild.data;
	var name = xml.getElementsByTagName("description")[0].firstChild.data;
	
	var xmlViewpoints = xml.getElementsByTagName("viewpoint");
	for (var i=0; i<xmlViewpoints.length; i++) {
		var id = xmlViewpoints[i].getAttribute("href");
		viewpoints[id] = true;
	}
	this.getViewpoint = function(id) {
		return id ? viewpoints[id] : first(viewpoints);
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
	this.getURL = function() {
		return href;
	}
	this.getViewpoints = function() {
		return viewpoints;
	}
	
	this.setReferences = function(spatialcontext) {
		for (id in viewpoints) {
			viewpoints[id] = spatialcontext.getViewpoint(id);
		}
	}
}
