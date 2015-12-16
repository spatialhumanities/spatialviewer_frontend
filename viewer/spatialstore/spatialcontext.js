GV.Spatialstore.Spatialcontext = function(xml) {
	
	// data
	var transformation = new mat4(xml.getElementsByTagName("params")[0].firstChild.data);
	var viewpoints = [];
	var floorplans = [];
	var features = [];
	var mid = false; // floorplan
	var vid = false; // viewpoint
	var disfids = []; // displayed features
	var selfids = []; // selected features
	
	var href = xml.getElementsByTagName("spatialcontext")[0].getAttribute("href");
	var name = xml.getElementsByTagName("spatialcontext")[0].getAttribute("place");
	var resources = xml.getElementsByTagName("resource");
	for (var i=0; i<resources.length; i++) {
		var rid = resources[i].getAttribute("id");
		var resourceList = resources[i].childNodes;
		for (var j=0; j<resourceList.length; j++) {
			if (rid == "features") {
				var feature = new GV.Spatialstore.Feature(resourceList[j]);
				features[feature.getID()] = feature;
			}
			if (rid == "media") {
				var floorplan = new GV.Spatialstore.Floorplanmedia(resourceList[j]);
				floorplans[floorplan.getID()] = floorplan;
			}
			if (rid == "viewpoints") {
				var viewpoint = new GV.Spatialstore.Viewpoint(resourceList[j]);
				viewpoints[viewpoint.getID()] = viewpoint;
			}
		}
	}
	
	// get
	this.getName = function() {
		return name;
	}
	this.getID = function() {
		return href;
	}
	
	// get data
	this.getViewpoints = function() {
		return viewpoints;
	}
	this.getViewpoint = function(id) {
		return id ? viewpoints[id] : viewpoints[vid];
	}
	this.getFloorplans = function() {
		return floorplans;
	}
	this.getFloorplan = function(id) {
		return id ? floorplans[id] : floorplans[mid];
	}
	var getFeatures = function(ids) {
		if (!ids)
			return features;
		var list = [];
		for (var i in ids) {
			if (features[ids[i]])
				list[ids[i]] = features[ids[i]];
		}
		return list;
	}
	this.getFeatures = function(ids) {
		return getFeatures(ids);
	}
	this.getDisplayedFeatures = function() {
		return getFeatures(disfids);
	}
	this.getSelectedFeatures = function() {
		return getFeatures(selfids);
	}
	this.getFeature = function(id) {
		return features[id];
	}
	
	// set selected
	this.setViewpoint = function(id) {
		console.log(GV.setting.spatialstore.getSpatialcontext().getDisplayedFeatures());
		var oldViewpoint = GV.setting.spatialstore.getSpatialcontext().getViewpoint();
		vid = id;
		GV.GUI.select("viewpoint",viewpoints[id]);
		GV.GUI.fillSelect("panorama",viewpoints[id].getPanoramas());
		// TODO: choose panorama by name - same as old panorama
		viewpoints[id].setPanorama(first(viewpoints[id].getPanoramas()).getID());
		GV.setting.changeFloorplanViewpoint();
		GV.setting.changeViewerFeatures();
		console.log(GV.setting.spatialstore.getSpatialcontext().getDisplayedFeatures());
		if (oldViewpoint) {
			var spherical = new Spherical(GV.setting.getElev(),GV.setting.getAzim());
			var cart = spherical.toCartesian();
			cart.mulS(1000);
			cart.mulM(oldViewpoint.getTransformation());
			cart.mulM(viewpoints[id].getTransformation().inverse());
			spherical = cart.toSpherical();
			GV.setting.setAzim(spherical.getHorAngle());
			GV.setting.setElev(spherical.getVerAngle());
		}
		GV.setting.setMeasurement(false);
		console.log(GV.setting.spatialstore.getSpatialcontext().getDisplayedFeatures());
	}
	this.setFloorplan = function(id) {
		mid = id;
		GV.GUI.select("floorplanmedia",floorplans[id]);
		GV.setting.changeFloorplan();
		
		// set north angle
		var matrix = new mat4();
		matrix.mulM(floorplans[id].getTransformation());
		matrix.mulM(transformation);
		
		var p1 = new vec4(0,0,1,1);
		p1.mulM(matrix);
		var p2 = new vec4(0,1,1,1);
		p2.mulM(matrix);
		var angle = -Math.round(180*Math.atan2(p1.x-p2.x,p1.y-p2.y)/Math.PI);
		var rotate = "webkit-transform: rotate"+angle+"deg);";
		rotate += "-moz-transform: rotate("+angle+"deg);";
		rotate += "-o-transform: rotate("+angle+"deg);";
		rotate += "-ms-transform: rotate("+angle+"deg);";
		rotate += "transform: rotate("+angle+"deg);";
		document.getElementById("north").setAttribute("style",rotate);
	}
	this.setDisplayedFeatures = function(ids) {
		disfids = ids;
		GV.setting.changeViewerFeatures();
		GV.setting.setTab();
	}
	this.setSelectedFeatures = function(ids,add) {
		if (add)
			ids = setXOR(selfids,ids);
		var oldFeatures = getFeatures(selfids);
		for (var i in oldFeatures)
			oldFeatures[i].deselect();
		var features = getFeatures(ids);
		for (var i in features)
			features[i].select();
		GV.info.select(features);
		selfids = ids;

		GV.Filter.markSelectedFeatures();
		var keylength = Object.keys(GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures());
		keylength = keylength.length;
		if (keylength > 1){
			GV.Annotate.annotationinterface.storeValue("directuris", Object.keys(GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures()));
		}
		else {
			GV.Annotate.annotationinterface.storeValue("directuri", Object.keys(GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures()));
		}
		


		GV.setting.changeViewerFeatures();
		GV.setting.setTab();
	}
	
	this.updateAll = function(xml) {
		var resources = xml.getElementsByTagName("resource");
		for (var i=0; i<resources.length; i++) {
			var rid = resources[i].getAttribute("id");
			var resourceList = resources[i].childNodes;
			if (rid == "features") {
				var updated = [];
				for (var j=0; j<resourceList.length; j++) {
					var feature = new GV.Spatialstore.Feature(resourceList[j]);
					features[feature.getID()] = feature;
					updated[feature.getID()] = feature;
					for (var id in viewpoints) {
						viewpoints[id].removeFeature(fid);
					}
					var xmlViewpoints = resourceList[j].getElementsByTagName("viewpoint");
					for (var i=0; i<xmlViewpoints.length; i++) {
						var id = xmlViewpoints[i].getAttribute("href");
						viewpoints[id].addFeature(fid,feature);
					}
				}
				var deleted = mapSubstract(features,updated);
				for (var fid in deleted) {
					for (var id in viewpoints) {
						viewpoints[id].removeFeature(fid);
					}
					features[fid].display(false);
					delete features[fid];
					this.setSelectedFeatures(setSubstract(selfids,[fid]));
					this.setDisplayedFeatures(setSubstract(disfids,[fid]));
				}
				GV.setting.changeViewerFeatures();
				GV.setting.setTab();
			}
		}
	}
	
	// set data
	this.update = function(fid,xml) {
		if (!xml) {
			for (var id in viewpoints) {
				viewpoints[id].removeFeature(fid);
			}
			features[fid].display(false);
			delete features[fid];
			this.setSelectedFeatures(setSubstract(selfids,[fid]));
			this.setDisplayedFeatures(setSubstract(disfids,[fid]));
		}
		else {
			var xmlFeatures = xml.getElementsByTagName("feature");
			var feature = new GV.Spatialstore.Feature(xmlFeatures[0]);
			fid = feature.getID();
			if (features[fid]) {
				features[fid].display(false);
				delete features[fid];
			}
			features[fid] = feature;
			for (var id in viewpoints) {
				viewpoints[id].removeFeature(fid);
			}
			var xmlViewpoints = xml.getElementsByTagName("viewpoint");
			for (var i=0; i<xmlViewpoints.length; i++) {
				var id = xmlViewpoints[i].getAttribute("href");
				viewpoints[id].addFeature(fid,feature);
			}
			GV.setting.setMeasurement(false);
			this.setSelectedFeatures(setUnion(selfids,[fid]));
			this.setDisplayedFeatures(setUnion(disfids,[fid]));
		}
		GV.setting.changeViewerFeatures();
		GV.setting.setTab();
		return fid;
	}
	this.setReferences = function(spatialcontext) {
		for (var id in features) {
			features[id].setReferences(spatialcontext);
		}
		for (var id in viewpoints) {
			viewpoints[id].setReferences(spatialcontext);
		}
		for (var id in floorplans) {
			floorplans[id].setReferences(spatialcontext);
		}
	}
}
