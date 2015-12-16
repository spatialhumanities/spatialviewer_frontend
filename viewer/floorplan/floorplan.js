GV.Visualizer = GV.Visualizer || {};
GV.Floorplan = GV.Floorplan || {};

GV.Floorplan.Main = function() {
	
	var azim = 0;
	var elev = Math.PI/2;
	var aspect = Math.PI/4;
	
	var fp;
	var x = 0.0;
	var y = 0.0;
	var zoomLevel = 1.0;
	var image = new Image();
	var viewpointList = [];
	//var tooltip;
	var highlightedFeature = false;
	
	var transformation = new mat4();
	
	var fullscreen = function() {
		x = fs_x;
		y = fs_y;
		zoomLevel = fs_zoom;
		draw();
	}
	document.getElementById("fullscreenbutton").onclick = function() {fullscreen(); return false;};
	
	// mouse
	var move = function(xStep,yStep) {
		x -= xStep;
		y -= yStep;
		draw();
	}
	var zoom = function(factor,screen) {
		zoomLevel *= factor;
		x = (x+0.5)/factor-0.5;
		y = (y+0.5)/factor-0.5;
		draw();
		displayScale();
	}
	var select = function(screen) {
		for (var i in viewpointList) {
			if (viewpointList[i].isInside(screen,getTransformation())) {
				GV.setting.spatialstore.getSpatialcontext().setViewpoint(i);
				return;
			}
		}
	}
	var mouseOver = function(screen) {
		for (var i in viewpointList) {
			if (viewpointList[i].isInside(screen,getTransformation())) {
				/*tooltip.text = viewpointList[i].getName();
				tooltip.x = screen.getX();
				tooltip.y = screen.getY();
				draw();*/
				return true;
			}
		}
		//tooltip.text = false;
		//draw();
		return false;
	}
	
	// init
	{
		var canvas2d = document.getElementById("floorplan");
		try {
			fp = canvas2d.getContext("2d");
		}
		catch (exception) {
			alert("Canvas 2D geht nicht");
			return;
		}
		//tooltip = new GV.Visualizer.Tooltip(fp);
		
		GV.Floorplan.addMouse(canvas2d,move,zoom,select,function(){},mouseOver);
	}
	
	// repaint
	var draw = function() {
		var aspect = GV.setting.getZoom();
		var azim = GV.setting.getAzim();
		var elev = GV.setting.getElev();
		var width = document.getElementById("floorplan").width;
		var height = document.getElementById("floorplan").height;
		fp.clearRect(0,0,width,height);
		if (image.loaded)
			fp.drawImage(image,-x*width,-y*height,width/zoomLevel,height/zoomLevel); // x und y bei Verschiebung einbauen
		for (var i in viewpointList) {
			viewpointList[i].draw(getTransformation(),aspect,azim,elev);
		}
		var features = GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures();

		// Selektierte Features werden in den Grundriss gemalt
		for (var i in features) {
			var point = features[i].getGeometry().getCenter();
			point.mulM(getTransformation());
			fp.beginPath();
			fp.arc(point.x,point.y,8,0,2*Math.PI);
			fp.fillStyle = "#00F58F"; 
			fp.fill();
		}

		if (highlightedFeature) {
			var point = highlightedFeature.getGeometry().getCenter();
			point.mulM(getTransformation());
			fp.beginPath();
			fp.arc(point.x,point.y,10,0,2*Math.PI);
			fp.fillStyle = "#FFFDBF"; 
			fp.fill();
			fp.strokeStyle='gray';
			fp.lineWidth = 2;
			fp.stroke();
		}
		//tooltip.draw();
	}
	var getTransformation = function() {
		var width = document.getElementById("floorplan").width;
		var height = document.getElementById("floorplan").height;
		var T = new mat4();
		T.mulM(transformation);
		T.mulM(GV.Math.floorplanMatrix(x,y,zoomLevel,width,height));
		return T;
	}
	
	// set
	this.changeFloorplan = function(floorplanmedia) {
		for (var i in viewpointList) {
			delete viewpointList[i];
		}
		var viewpoints = floorplanmedia.getViewpoints();
		transformation = floorplanmedia.getTransformation().inverse();
		var Xmin, Xmax, Ymin, Ymax;
		for (var i in viewpoints) {
			viewpointList[i] = new GV.Visualizer.Floorplanpoint(viewpoints[i],fp);
			var point = viewpointList[i].getPoint(transformation);
			if (!Xmin || point.x < Xmin) Xmin = point.x;
			if (!Xmax || point.x > Xmax) Xmax = point.x;
			if (!Ymin || point.y < Ymin) Ymin = point.y;
			if (!Ymax || point.y > Ymax) Ymax = point.y;
		}
		fs_zoom = Math.max(Xmax-Xmin,Ymax-Ymin);
		fs_x = Xmin/fs_zoom;
		fs_y = Ymin/fs_zoom;
		image.onload = function() {
			image.loaded = true;
			draw();
		}
		image.src = floorplanmedia.getURL();
		displayScale();
	}
	this.changeViewpoint = function(viewpoint) {
		for (var i in viewpointList) {
			viewpointList[i].select(viewpoint && viewpoint.getID() == i);
		}
		draw();
	}
	this.update = function() {
		draw();
	}
	this.changeFeatures = function() {
		draw();
	}
	this.setHighlightedFeature = function(uri) {
		highlightedFeature = GV.setting.spatialstore.getSpatialcontext().getFeature(uri);
	}
	
	var displayScale = function() {
		var pixels = meterInPixels();
		var scaleunit = document.getElementById("scaleunit");
		var scalewidth = document.getElementById("scalewidth");
		
		var unit = Math.pow(10,Math.floor(Math.log(100/pixels)/Math.LN10));
		scaleunit.innerHTML = unit<1 ? 100*unit+"cm" : unit+"m";
		scalewidth.setAttribute("style","width: "+Math.round(unit*pixels)+"px;");
		
		/*
		if (pixels > 1000) {
			scaleunit.innerHTML = "1cm";
			scalewidth.setAttribute("style","width: "+Math.round(pixels/100)+"px;");
		}
		else if (pixels > 100) {
			scaleunit.innerHTML = "10cm";
			scalewidth.setAttribute("style","width: "+Math.round(pixels/10)+"px;");
		}
		else if (pixels > 20) {
			scaleunit.innerHTML = "1m";
			scalewidth.setAttribute("style","width: "+Math.round(pixels)+"px;");
		}
		else if (pixels > 10) {
			scaleunit.innerHTML = "2m";
			scalewidth.setAttribute("style","width: "+Math.round(2*pixels)+"px;");
		}
		else if (pixels > 1) {
			scaleunit.innerHTML = "10m";
			scalewidth.setAttribute("style","width: "+Math.round(10*pixels)+"px;");
		}
		else if (pixels > 0.1) {
			scaleunit.innerHTML = "100m";
			scalewidth.setAttribute("style","width: "+Math.round(100*pixels)+"px;");
		}
		else {
			scaleunit.innerHTML = "1km";
			scalewidth.setAttribute("style","width: "+Math.round(1000*pixels)+"px;");
		}*/
	}
	var meterInPixels = function() {
		var T = getTransformation();
		var point1 = new vec4(1,0,1,0);
		point1.mulM(T);
		var point2 = new vec4(0,0,1,0);
		point2.mulM(T);
		var x = point1.x-point2.x;
		var y = point1.y-point2.y;
		return Math.sqrt(x*x+y*y);
	}
}
