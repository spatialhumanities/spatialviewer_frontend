GV.Viewer.addMouse = function(canvas,screenToCartesian) {
	
	var SPEED = 0.01;
	
	var leftDown = false;
	var clicked = false;
	var flag;
	var height = 1;
	var width = 1;
	var selectCounter = 0;
	
	this.resize = function() {
		width = canvas.width;
		height = canvas.height;
	}
	
	var onClick = function(event) {
		var measurement = GV.setting.getMeasurement();
		var point = getCartesian(event);
		if (measurement) {
			var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
			var features = mapIntersect(spatialcontext.getViewpoint().getFeatures(),spatialcontext.getDisplayedFeatures());
			for (var i in features) {
				var snap = features[i].getGeometry().snaps(point);
				if (snap) {
					point = snap;
					break;
				}	
			}
			measurement.click(point);
			GV.setting.changeViewerMeasurement();
		}
		else {
			var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
			var features = mapIntersect(spatialcontext.getViewpoint().getFeatures(),spatialcontext.getDisplayedFeatures());
			var clicked = [];
			for (var i in features) {
				if (features[i].getGeometry().intersects(point))
					clicked.push(i);
			}
			selectCounter++;
			spatialcontext.setSelectedFeatures([clicked[selectCounter%clicked.length]],event.ctrlKey);
		}
	}
	
	var onDblClick = function(event) {
		var measurement = GV.setting.getMeasurement();
		if (measurement)
			close();
	}
	
	var onDown = function(event) {
		if (leftEvent(event)) {
			clicked = true;
			leftDown = true;
			flag = getScreen(event);
			var measurement = GV.setting.getMeasurement();
			if (!measurement)
				canvas.style.cursor = 'move';
				canvas.style.cursor = 'grabbing';
		}
		return false;
	}
	
	var onMove = function(event) {
		var measurement = GV.setting.getMeasurement();
		if (leftDown) {
			var s = getScreen(event);
			clicked = false;
			if (measurement && measurement.drag(screenToCartesian(flag),screenToCartesian(s))) {
				GV.setting.changeViewerMeasurement();
			}
			else {
				GV.setting.rotate((s.getX()-flag.getX())*SPEED/3,(s.getY()-flag.getY())*SPEED/3);
				canvas.style.cursor = 'move';
				canvas.style.cursor = 'grabbing';
			}
			flag = s;
		}
		else if (measurement) {
			var point = getCartesian(event);
			measurement.update(point);
			if (measurement.able(point))
				canvas.style.cursor = 'pointer';
			else if (measurement.closed())
				canvas.style.cursor = 'default';
			else {
				var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
				var features = mapIntersect(spatialcontext.getViewpoint().getFeatures(),spatialcontext.getDisplayedFeatures());
				canvas.style.cursor = 'crosshair';
				for (var i in features) {
					if (features[i].getGeometry().snaps(point))
						canvas.style.cursor = 'pointer';
				}
			}
			GV.setting.changeViewerMeasurement();
		}
		else {
			var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
			var features = mapIntersect(spatialcontext.getViewpoint().getFeatures(),spatialcontext.getDisplayedFeatures());
			var point = getCartesian(event);
			for (var i in features) {
				if (features[i].getGeometry().intersects(point)) {
					canvas.style.cursor = 'pointer';
					return;
				}
			}
			canvas.style.cursor = 'default';
		}
	}
	
	var onUp = function(event) {
		if (leftEvent(event)) {
			var measurement = GV.setting.getMeasurement();
			if (measurement && leftDown)
				measurement.drag(getCartesian(event));
			leftDown = false;
			canvas.style.cursor = 'default';
		}
		if (clicked) {
			onClick(event);
		}
		clicked = false;
	}
	
	var onWheel = function(event) {
		var amount = event.detail ? event.detail : -event.wheelDelta/10;
		GV.setting.setZoom(GV.setting.getZoom() * Math.pow(1+SPEED,amount));
	}
	
	// utils
	var getScreen = function(event) {
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left - parseInt($("#viewer").css("border-left-width"),10);
		var y = event.clientY - rect.top  - parseInt($("#viewer").css("border-top-width"),10);
		return new Screen(x,y);
	}
	var getCartesian = function(event) {
		return screenToCartesian(getScreen(event));
	}
	var leftEvent = function(event) {
		return (event.which == 1);
	}
	var rightEvent = function(event) {
		return (event.which == 3);
	}
	
	canvas.onmousedown = onDown;
	canvas.onmousemove = onMove;
	canvas.onmouseup = onUp;
	canvas.ondblclick = onDblClick;
	canvas.addEventListener('mousewheel',onWheel,false);
	canvas.addEventListener('DOMMouseScroll',onWheel,false);
	canvas.addEventListener('mouseout',onUp,false);
	
}

	/*var cartesianToScreen = function(cartesian) {
		var copy = cartesian.copy();
		copy.mulM(getCTSMatrix());

		var tz = Math.tan(GV.setting.getZoom());
		var sX = 0;
		var sY = 0;
		if (copy.z > 0) { // sonst liegt der Punkt hinter dem Betrachter
			sX = copy.x/copy.z;
			sY = copy.y/copy.z;
			sX = Math.round(( sX/(2*tz)*height/width+0.5)*(width-1));
			sY = Math.round((-sY/(2*tz)             +0.5)*(height-1));
		}
		return new Screen(sX,xY);
	}
	// Cartesian To Screen: [sX sY w] = Matrix * Cart
	var getCTSMatrix = function() {
		var sv = Math.sin(GV.setting.getElev());
		var cv = Math.cos(GV.setting.getElev());
		var sh = Math.sin(GV.setting.getAzim());
		var ch = Math.cos(GV.setting.getAzim());
		var matrix = new mat3();
		matrix.a00 = sh;     matrix.a01 = -ch;    matrix.a02 = 0;
		matrix.a10 = -cv*ch; matrix.a11 = -cv*sh; matrix.a12 = sv;
		matrix.a20 = sv*ch;  matrix.a21 = sv*sh;  matrix.a22 = cv;
		return matrix;
	}*/
