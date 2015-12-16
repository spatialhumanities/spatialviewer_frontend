GV.Spatialstore.Panorama = function(xml,sid,vid) {
	
	// identifiers
	var id = xml.getAttribute("id");
	var name = xml.getElementsByTagName("kindof")[0].firstChild.data;
	
	// data
	var transformation = new mat4(xml.getElementsByTagName("params")[0].firstChild.data);
	//var p = new mat4(); p.a00 = -1; p.a12 = 1; p.a21 = 1; p.a11 = 0; p.a22 = 0;
	//var transformation = new mat4(); transformation.a00 = -1; transformation.a12 = 1; transformation.a21 = 1; transformation.a11 = 0; transformation.a22 = 0;
	//transformation.mulM(t); transformation.mulM(p);
	var images = [];
	for (var i=0; i<xml.getElementsByTagName("img").length; i++) {
		images.push(xml.getElementsByTagName("img")[i].firstChild.data);
	}
	var type = xml.getElementsByTagName("structuraltype")[0].firstChild.data;
	var kindof = xml.getElementsByTagName("kindof")[0].firstChild.data;
	
	// get ID Name
	this.getID = function() {
		return id;
	}
	this.getName = function() {
		return name;
	}
	this.getViewpoint = function() {
		return viewpoint;
	}
	
	// get data
	this.getTransformation = function() {
		return transformation;
	}
	this.getImages = function() {
		return images;
	}
	this.getType = function() {
		return type;
	}
	this.getKindOf = function() {
		return kindof;
	}
}
