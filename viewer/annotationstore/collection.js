GV.Annotationstore.Collection = function(xml) {
	
	// identifiers
	var id = xml.getAttribute("id");
	var uri = xml.getAttribute("href");
	var name = xml.getAttribute("id");
	
	// data
	var resources = [];
	
	// load
	var isLoaded = false;
	this.load = function() {
		if (isLoaded)
			fill();
		else
			IO.readXML(uri+"/articles",onload);
	}
	var onload = function(xml) {
		var xmlResources = xml.getElementsByTagName("resource");
		for (var i=0; i<xmlResources.length; i++) {
			var rid = xmlResources[i].getAttribute("id");
			resources[rid] = new GV.Annotationstore.Resource(xmlResources[i],id);
		}
		fill();
	}
	var fill = function() {
		isLoaded = true;
		GV.GUI.fillSelect("resource",resources);
	}
	
	// get ID Name
	this.getID = function() {
		return id;
	}
	this.getName = function() {
		return name;
	}
	
	// get data
	this.getResources = function() {
		return resources;
	}
	this.getResource = function(rid) {
		return resources[rid];
	}
	
}
