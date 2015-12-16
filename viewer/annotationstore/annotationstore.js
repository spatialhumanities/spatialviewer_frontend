GV.Annotationstore = GV.Annotationstore || {};

GV.Annotationstore.Main = function() {
	
	// data
	var collections = [];
	
	// init
	this.init = function() {
		IO.readXML("http://www.inschriften.net/rest",onload);
	}
	var onload = function(xml) {
		var xmlCollections = xml.getElementsByTagName("collection");
		for (var i=0; i<xmlCollections.length; i++) {
			var cid = xmlCollections[i].getAttribute("id");
			collections[cid] = new GV.Annotationstore.Collection(xmlCollections[i]);
		}
		GV.GUI.fillSelect("collection",collections);
	}
	
	// get
	this.getCollections = function() {
		return collections;
	}
	this.getCollection = function(cid) {
		return collections[cid];
	}
}

GV.Annotationstore.getCollection = function(uri) {
	return uri.replace(/http:\/\/www.inschriften.net\/rest\/([^\/]*)\/.*/,"$1");
}

GV.Annotationstore.getResource = function(uri) {
	return uri.replace(/http:\/\/www.inschriften.net\/rest\/[^\/]*\/[^\/]*\/([^\/]*).*/,"$1");
}
