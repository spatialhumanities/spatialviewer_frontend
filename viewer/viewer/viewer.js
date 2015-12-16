GV.Viewer = GV.Viewer || {};

GV.Viewer.Main = function() {
	
	var gl;
	var width = 0;
	var height = 0;
	
	var panodraw;
	var polydraw;
	
	// utils
	var screenToCartesian = function(screen) {
		var tz = Math.tan(GV.setting.getZoom());
		var x = 2*tz* ((1.0*screen.getX()/(width-1))-0.5) ;
		var y = 2*tz* (0.5-(1.0*screen.getY()/(height-1))) *height/width;
		
		var sv = Math.sin(GV.setting.getElev());
		var cv = Math.cos(GV.setting.getElev());
		var sh = Math.sin(GV.setting.getAzim());
		var ch = Math.cos(GV.setting.getAzim());
		var matrix = new mat3();
		matrix.a00 = sh;  matrix.a01 = -cv*ch; matrix.a02 = sv*ch;
		matrix.a10 = -ch; matrix.a11 = -cv*sh; matrix.a12 = sv*sh;
		matrix.a20 = 0;   matrix.a21 = sv;     matrix.a22 = cv;
		
		var point = new vec3(x,y,1);
		point.mulM(matrix);
		return point;
	}
	
	// repaint
	var draw = function() {
		gl.viewport(0, 0, width, height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		var pMatrix = new Float32Array(GV.Math.projectionMatrix(width/height).toTransposedArray());
		var mvMatrix = new Float32Array(GV.Math.modelviewMatrix().toTransposedArray());
		panodraw.draw(pMatrix,mvMatrix);
		polydraw.draw(pMatrix,mvMatrix);
	}
	
	// init
	{
		var canvas = document.getElementById("viewer");
		
		// init webGL
		try {
			gl = canvas.getContext("webgl",{preserveDrawingBuffer: true}) || canvas.getContext("experimental-webgl",{preserveDrawingBuffer: true});
		}
		catch (exception) {
			alert("Sorry! Your browser doesn't support WebGL.");
			return;
		}
		if (!gl) {
			alert("Sorry! Your browser doesn't support WebGL.");
			return;
		}
		
		// init panorama and polygon drawer
		panodraw = new GV.Viewer.Panodraw(gl,draw);
		polydraw = new GV.Viewer.Polydraw(gl,draw);
		
		// init mouse
		GV.Viewer.addMouse(canvas,screenToCartesian);
		
		// clear canvas
		gl.clearColor(0.0,0.0,0.0,1.0);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
	
	this.changePanorama = function(panorama) {
		panodraw.changePanorama(panorama);
	}
	this.changeFeatures = function() {
		var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
		var features = mapIntersect(spatialcontext.getViewpoint().getFeatures(),spatialcontext.getDisplayedFeatures());
		for (var i in features) {
			features[i].getGeometry().create();
			features[i].getGeometry().updateRadius();
		}
		polydraw.update(GV.setting.getMeasurement(),mapSubstract(features,spatialcontext.getSelectedFeatures()),mapIntersect(features,spatialcontext.getSelectedFeatures()));
		draw();
	}
	
	// set
	/*this.changeViewpoint = function(viewpoint) {
		var features = viewpoint.getFeatures();
		polydraw.clear();
		for (var fid in features)
			polydraw.addFeature(features[fid],viewpoint);
		draw();
	}
	this.addFeature = function(feature,viewpoint) {
		polydraw.addFeature(feature,viewpoint);
		draw();
	}
	this.removeFeature = function(fid) {
		polydraw.removeFeature(fid);
		draw();
	}
	this.changeFeatures = function(features) {
		var lookAt = polydraw.selectFeatures(features);
		if (lookAt) {
			var dir = lookAt.toSpherical();
			GV.master.setAngles(dir.getPhi(),dir.getTheta());
		}
		draw();
	}
	this.displayFeatures = function(fids) {
		polydraw.displayFeatures(fids);
	}*/
	this.update = function(zoom) {
		if (zoom) {
			var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
			var features = mapIntersect(spatialcontext.getViewpoint().getFeatures(),spatialcontext.getDisplayedFeatures());
			for (var i in features) {
				features[i].getGeometry().updateRadius();
			}
			polydraw.update(GV.setting.getMeasurement(),mapSubstract(features,spatialcontext.getSelectedFeatures()),mapIntersect(features,spatialcontext.getSelectedFeatures()));
		}
		draw();
	}
	
	this.updateMeasurement = function() {
		polydraw.update(GV.setting.getMeasurement());
		draw();
	}
	
	// mouse
	/*var rotate = function(hStep,vStep) {
		var azim = GV.master.getAzim() + hStep*GV.master.getZoom();
		var elev = GV.master.getElev() - vStep*GV.master.getZoom();
		GV.master.setAngles(azim,elev);
	}
	var zoom = function(factor) {
		GV.master.setZoom(factor*GV.master.getZoom());
	}
	var click = function(screen,ctrlKey) {
		polydraw.click(screenToCartesian(screen),GV.master.getZoom(),ctrlKey);
		draw();
	}
	var dblclick = function(screen) {
		polydraw.dblclick(screenToCartesian(screen),GV.master.getZoom());
		draw();
	}
	var move = function(screen) {
		polydraw.mouseOver(screenToCartesian(screen));
		draw();
	}*/
	
	this.resize = function() {
		var canvas = document.getElementById("viewer");
		width = canvas.width;
		height = canvas.height;
		draw();
	}
	
	/*var save = function() {
		GV.master.addFeature(polydraw.getMeasurement().getPoints(),polydraw.getMode(),width*height);
		return false;
	}*/
	//document.getElementById("save").onclick = save;
	
}


