var parseDate = function(text) {
	return new Date(text.replace(" ","T"));
}
var parseTextNode = function(node) {
	var text = "";
	for (var i=0; i<node.childNodes.length; i++) {
		text += node.childNodes[i].data;
	}
	return text;
}

GV.Spatialstore.Feature = function(xml) {
	
	// identifiers
	var href = xml.getAttribute("href");
	var name = Number(xml.getAttribute("id"));
	
	// data
	var geometry = new GV.Draw.Geometry(parseTextNode(xml.getElementsByTagName("geom")[0]));
	var creator = xml.getElementsByTagName("creator")[0].firstChild.data;
	var lastModify = parseDate(xml.getElementsByTagName("lastModify")[0].firstChild.data);
	var size = Number(xml.getElementsByTagName("size")[0].firstChild.data);
	//var unit = xml.getElementsByTagName("unit")[0].firstChild.data;
	var viewpoints = [];
	
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
	this.getGeometryParts = function(viewpoint,zoom) {
		return geometry.getParts(viewpoint.getTransformation().inverse(),zoom);
	}
	this.getGeometry = function() {
		return geometry;
	}
	this.getSize = function() {
		return size;
	}
	this.getCreator = function() {
		return creator=="null" ? false : creator;
	}
	this.getDate = function() {
		return lastModify;
	}
	this.setReferences = function(spatialcontext) {
		for (id in viewpoints) {
			viewpoints[id] = spatialcontext.getViewpoint(id);
		}
	}
	
	var createDOM = function() { // object overview
		var gvobject = document.createElement("div");
		gvobject.id = "feature"+name;
		gvobject.setAttribute("class","gvobject");
		
		var img = document.createElement("img");
		img.setAttribute("class","screenshot");
		img.setAttribute("alt","screenshot");
		img.setAttribute("onerror","this.onerror=null;this.src='screenshot.png'; return false;");
		//img.setAttribute("src",href+".png#" + new Date().getTime());
		img.setAttribute("src","screenshot.png#" + new Date().getTime());
		img.setAttribute("onclick","GV.setting.spatialstore.getSpatialcontext().setSelectedFeatures(['"+href+"'],true); return false;");
		gvobject.appendChild(img);
		
		var div = document.createElement("div");
		div.setAttribute("class","gvobjectdesc");
		var p = document.createElement("p");
		p.setAttribute("class","gvobjectid");
		p.appendChild(document.createTextNode(name));
		div.appendChild(p);
		gvobject.appendChild(div);
		
		// geometrische Information
		var pdiv = document.createElement("div");
		pdiv.setAttribute("class","geodesc");
		var geomP1 = document.createElement("p");
		geomP1.setAttribute("class","label");
		var geomLabel; 
		switch (geometry.getType()) {
			case "POINT": geomLabel = "Punkt"; break;
			case "LINESTRING": geomLabel = "Länge"; break;
			case "MULTIPOLYGON": geomLabel = "Area"; break;
			case "GEOMETRYCOLLECTION": geomLabel = "Volumen"; break;
		}
		geomP1.appendChild(document.createTextNode(geomLabel));
		pdiv.appendChild(geomP1);
		var geomP2 = document.createElement("p");
		geomP2.setAttribute("class","content");
		var geomSize;
		switch (geometry.getType()) {
			case "POINT":
				var pointList = geometry.getPointList();
				geomSize = "Point";
				//geomSize = "( " + pointList[0].x.toFixed(2) + " , " + pointList[0].y.toFixed(2) + " , " + pointList[0].z.toFixed(2) + " )";
			break;
			case "LINESTRING":
				//var size = geometry.getSize();
				geomSize = size.toFixed(2) + "m";
			break;
			case "MULTIPOLYGON":
				//var size = geometry.getSize();
				geomSize = (size<1) ? ((10000*size).toFixed(0) + "cm²") : (size.toFixed(1) + "m²");
			break;
			case "GEOMETRYCOLLECTION":
				//var size = geometry.getSize();
				geomSize = (size<0.001) ? ((1000000*size).toFixed(0) + "ml") : (size<1) ? ((1000*size).toFixed(1) + "l") : (size.toFixed(1) + "m³");
			break;
		}
		geomP2.appendChild(document.createTextNode(geomSize));
		div.appendChild(geomP2);
		var a = document.createElement("a");
		a.setAttribute("class","gvobjectselect");
		a.appendChild(document.createTextNode("show"));
		a.href = "javascript:GV.GUI.showFeature('"+href+"')";
		div.appendChild(a);
		gvobject.appendChild(pdiv);
		
		// Datum der letzten Modifizierung
		if (lastModify) {
			var date = document.createElement("div");
			date.setAttribute("class","infoDate");
			var dateP1 = document.createElement("p");
			dateP1.setAttribute("class","label");
			dateP1.appendChild(document.createTextNode("Date"));
			date.appendChild(dateP1);
			var dateP2 = document.createElement("p");
			dateP2.setAttribute("class","content");
			dateP2.appendChild(document.createTextNode(lastModify.toLocaleString()));
			date.appendChild(dateP2);
			gvobject.appendChild(date);
		}
		
		// Ersteller
		if (creator != "null") {
			var crea = document.createElement("div");
			crea.setAttribute("class","infoCreator");
			var creaP1 = document.createElement("p");
			creaP1.setAttribute("class","label");
			creaP1.appendChild(document.createTextNode("Creator"));
			crea.appendChild(creaP1);
			var creaP2 = document.createElement("p");
			creaP2.setAttribute("class","content");
			creaP2.appendChild(document.createTextNode(creator));
			crea.appendChild(creaP2);
			gvobject.appendChild(crea);
		}
		
		return gvobject;
	}
	var dom = createDOM();
	
	this.deselect = function() {
		dom.getElementsByTagName("img")[0].setAttribute("class","screenshot");
	}
	this.select = function() {
		dom.getElementsByTagName("img")[0].setAttribute("class","screenshot markiert");
	}
	this.display = function(divID) {
		if (divID) {
			var gvobjectdiv = document.getElementById(divID);
			dom.removeAttribute("style");
			gvobjectdiv.appendChild(dom);
		}
		else {
			dom.setAttribute("style","display: none");
		}
	}
	
	this.displayInfo = function() { // info-window below floorplan
                //
                //NEUER ANNOTATOR 
                //
                //Muss dynamisch sein, da die Liste viel mehr beinhalten kann.
                //
		// remove elements from span
		var span = document.getElementById("info");
		while (span.firstChild) {
			span.removeChild(span.firstChild);
		}
		
		// URI
		var fid = document.createElement("div");
		fid.setAttribute("class","infoFeature");
		var fidA = document.createElement("a");
		var fidSpan = document.createElement("span");
		fidSpan.setAttribute("class", "icon-detail iconfont");
		fidA.setAttribute("class","content");
		fidA.setAttribute("href",href);
		fidA.setAttribute("title",href);
		fidA.setAttribute("target","_blank");
		fidA.appendChild(fidSpan);
		fidA.appendChild(document.createTextNode("Feature Overview"));
		fid.appendChild(fidA);
		span.appendChild(fid);
		
		
		// ID
		var geom = document.createElement("div");
		geom.setAttribute("class","infoGeometry");
		var fidP1 = document.createElement("p");
		fidP1.setAttribute("class","label");
		fidP1.appendChild(document.createTextNode('Number'));
		geom.appendChild(fidP1);
		var fidP2 = document.createElement("p");
		fidP2.setAttribute("class","content");
		fidP2.appendChild(document.createTextNode(name));
		geom.appendChild(fidP2);
		
		// geometrische Information
		var geomP1 = document.createElement("p");
		geomP1.setAttribute("class","label");
		var geomLabel; 
		switch (geometry.getType()) {
			case "POINT": geomLabel = "Punkt"; break;
			case "LINESTRING": geomLabel = "Länge"; break;
			case "MULTIPOLYGON": geomLabel = "Area"; break;
			case "GEOMETRYCOLLECTION": geomLabel = "Volumen"; break;
		}
		geomP1.appendChild(document.createTextNode(geomLabel));
		geom.appendChild(geomP1);
		var geomP2 = document.createElement("p");
		geomP2.setAttribute("class","content");
		var geomSize;
		switch (geometry.getType()) {
			case "POINT":
				var pointList = geometry.getPointList();
				geomSize = "( " + pointList[0].x.toFixed(2) + " , " + pointList[0].y.toFixed(2) + " , " + pointList[0].z.toFixed(2) + " )";
			break;
			case "LINESTRING":
				//var size = geometry.getSize();
				geomSize = size.toFixed(2) + "m";
			break;
			case "MULTIPOLYGON":
				//var size = geometry.getSize();
				geomSize = (size<1) ? ((10000*size).toFixed(0) + "cm²") : (size.toFixed(1) + "m²");
			break;
			case "GEOMETRYCOLLECTION":
				//var size = geometry.getSize();
				geomSize = (size<0.001) ? ((1000000*size).toFixed(0) + "ml") : (size<1) ? ((1000*size).toFixed(1) + "l") : (size.toFixed(1) + "m³");
			break;
		}
		geomP2.appendChild(document.createTextNode(geomSize));
		geom.appendChild(geomP2);
		span.appendChild(geom);
		
		// Datum der letzten Modifizierung
		if (lastModify) {
			var date = document.createElement("div");
			date.setAttribute("class","infoDate");
			var dateP1 = document.createElement("p");
			dateP1.setAttribute("class","label");
			dateP1.appendChild(document.createTextNode("Date"));
			date.appendChild(dateP1);
			var dateP2 = document.createElement("p");
			dateP2.setAttribute("class","content");
			dateP2.appendChild(document.createTextNode(lastModify.toLocaleString()));
			date.appendChild(dateP2);
			span.appendChild(date);
		}
		
		// Ersteller
		if (creator != "null") {
			var crea = document.createElement("div");
			crea.setAttribute("class","infoCreator");
			var creaP1 = document.createElement("p");
			creaP1.setAttribute("class","label");
			creaP1.appendChild(document.createTextNode("Creator"));
			crea.appendChild(creaP1);
			var creaP2 = document.createElement("p");
			creaP2.setAttribute("class","content");
			creaP2.appendChild(document.createTextNode(creator));
			crea.appendChild(creaP2);
			span.appendChild(crea);
		}

		//console.log("INFOINFO");
		var count = Object.keys(GV.setting.spatialstore.getSpatialcontext().getDisplayedFeatures()).length;
		var count = "<p id='infofiltered' class='inforow'><span class='number'>" + count + "</span> Features filtered</p>";
		$(count).appendTo("#info");
		GV.info.alertYellow();
	}
}
