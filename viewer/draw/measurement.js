﻿GV.Draw.Measurement = function(mode,f) {
	
	var feature = f;
	var type = mode;
	var clickList = [];
	var pointList = [];
	var spheres = [];
	var lines = [];
	var finished = f ? "drag" : false;
	
	var update = function() {
		var zoom = GV.Draw.SIZE*GV.setting.getZoom();
		for (var i in spheres) {
			spheres[i].setRadius(zoom);//0.02);
		}
		for (var i in lines) {
			lines[i].setRadius(zoom/4);//0.005);
		}
	}
	
	if (feature) {
		var t = GV.setting.spatialstore.getSpatialcontext().getViewpoint().getTransformation().inverse();
		var tmpPoints = feature.getGeometry().getPointList();
		for (var i=0; i<tmpPoints.length; i++) {
			var point = new vec4(tmpPoints[i].x,tmpPoints[i].y,tmpPoints[i].z,1);
			point.mulM(t);
			pointList.push(point.toVec3());
		}
		for (var i=0; i<pointList.length; i++) {
			clickList[i] = pointList[i].toSpherical();
		}
		for (var i=0; i<pointList.length; i++) {
			/*spheres[i] = new GV.Draw.Sphere(pointList[i]);
			if (i<pointList.length-1)
				lines[i] = new GV.Draw.Line(pointList[i],pointList[i+1]);*/
			spheres[i] = new GV.Draw.Sphere(clickList[i].toCartesian());
			if (i<pointList.length-1)
				lines[i] = new GV.Draw.Line(clickList[i].toCartesian(),clickList[i+1].toCartesian());
		}
		if (type == "polygon" || type == "prism")
			lines[pointList.length-1] = new GV.Draw.Line(clickList[pointList.length-1].toCartesian(),clickList[0].toCartesian());
			//lines[pointList.length-1] = new GV.Draw.Line(pointList[pointList.length-1],pointList[0]);
		update();
	}
	
	this.drag = function(from,to) {
		var nr = dragable(from);
		if (finished == "drag" && nr >= 0) {
			if (to) {
				clickList[nr] = to.toSpherical();
				pointList[nr] = to;
				spheres[nr].setCenter(to);
				if (lines[nr])
					lines[nr].setStart(pointList[nr]);
				if (lines[nr-1])
					lines[nr-1].setEnd(pointList[nr]);
				if (nr == 0 && lines[pointList.length-1])
					lines[pointList.length-1].setEnd(pointList[nr]);
				update();
			}
			else {
				var spherical = from.toSpherical();
				clickList[nr] = spherical;
				info(spherical,nr,true);
			}
			return true;
		}
		return false;
	}
	
	this.update = function(point) {
		if (!finished && point && lines.length > 0)
			lines[lines.length-1].setEnd(point);
		if (!point)
			update();
	}
	this.click = function(point) {
		if (!point || closeable(point) )
			close();
		if (!finished) {
			var spherical = point.toSpherical();
			var nr = clickList.length;
			clickList[nr] = spherical;
			pointList[nr] = point;
			spheres[nr] = new GV.Draw.Sphere(pointList[nr]);
			lines[nr] = new GV.Draw.Line(pointList[nr]);
			info(spherical,nr);
			update();
		}
		if (finished == "delete" && (spheres.length>1)) {
			var nr = dragable(point);
			if (nr >= 0) {
				for (var i=nr+1; i<pointList.length; i++) {
					clickList[i-1] = clickList[i];
					pointList[i-1] = pointList[i];
					spheres[i-1] = spheres[i];
					if (lines[i])
						lines[i-1] = lines[i];
				}
				clickList.length--;
				delete clickList[clickList.length];
				pointList.length--;
				delete pointList[pointList.length];
				spheres.length--;
				delete spheres[spheres.length];
				lines.length--;
				delete lines[lines.length];
				if (lines[nr-1] && pointList[nr])
					lines[nr-1].setEnd(pointList[nr]);
				if (lines[nr-1] && !pointList[nr])
					lines[nr-1].setEnd(pointList[0]);
				if (nr == 0 && lines[pointList.length-1])
					lines[pointList.length-1].setEnd(pointList[0]);
				update();
				GV.info.measurement();
			}
		}
		if (finished == "add") {
			var nr = addable(point)+1;
			if (nr > 0) {
				for (var i=pointList.length; i>nr; i--) {
					clickList[i] = clickList[i-1];
					pointList[i] = pointList[i-1];
					spheres[i] = spheres[i-1];
					if (lines[i-1])
						lines[i] = lines[i-1];
				}
				var spherical = point.toSpherical();
				clickList[nr] = spherical;
				pointList[nr] = point;
				spheres[nr] = new GV.Draw.Sphere(pointList[nr]);
				if (pointList[nr+1])
					lines[nr] = new GV.Draw.Line(pointList[nr],pointList[nr+1]);
				else
					lines[nr] = new GV.Draw.Line(pointList[nr],pointList[0]);
				lines[nr-1].setEnd(pointList[nr]);
				info(spherical,nr,true);
				update();
			}
		}
	}
	var closeable = function(point) {
		if (!finished) {
			if (type == "polygon" || type == "prism")
				if (spheres[0] && spheres[0].intersects(point))
					return true;
			if (type == "linestring")
				if (spheres[spheres.length-1] && spheres[spheres.length-1].intersects(point))
					return true;
		}
		return false;
	}
	var dragable = function(point) {
		if (finished) {
			for (var i=0; i<spheres.length; i++) {
				if (spheres[i].intersects(point))
					return i;
			}
		}
		return -1;
	}
	var addable = function(point) {
		if (finished) {
			for (var i=0; i<lines.length; i++) {
				if (lines[i].intersects(point))
					return i;
			}
		}
		return -1;
	}
	this.closeable = function(point) {
		return closeable(point);
	}
	this.dragable = function(point) {
		return dragable(point)>=0;
	}
	this.deleteable = function(point) {
		return ((spheres.length>1) && (dragable(point)>=0));
	}
	this.addable = function(point) {
		return addable(point)>=0;
	}
	this.able = function(point) {
		if (!finished)
			return closeable(point);
		if (finished == "drag")
			return dragable(point)>=0;
		if (finished == "delete")
			return ((spheres.length>1) && (dragable(point)>=0));
		if (finished == "add")
			return addable(point)>=0;
	}
	var close = function(mode) {
		if (!mode) {
			if (type == "polygon" || type == "prism")
				lines[lines.length-1].setEnd(pointList[0].toSpherical().toCartesian());
			if (type == "linestring")
				delete lines[lines.length-1];
		}
		finished = mode ? mode : "drag";
		GV.setting.setTab();
	}
	this.close = function(mode) {
		close(mode);
	}
	
	this.closed = function() {
		return finished;
	}
	this.planarizable = function() {
		return false; // (feature && feature.getGeometry().planarizable());
	}
	this.missclick = function() {
		return false;
	}
	this.visible = function() {
		var viewpoint = GV.setting.spatialstore.getSpatialcontext().getViewpoint();
		if (feature)
			return viewpoint.getFeature(feature.getID());
		else
			return -1;
	}
	
	var info = function(spherical,nr,edit) {
		var sid = GV.setting.spatialstore.getSpatialcontext().getID();
		var vid = GV.setting.spatialstore.getSpatialcontext().getViewpoint().getID();
		IO.infoPoint(sid,vid,spherical,callbackInfo,nr);
	}
	var callbackInfo = function(xml,nr) {
		var x = Number(xml.getElementsByTagName("x")[0].firstChild.data);
		var y = Number(xml.getElementsByTagName("y")[0].firstChild.data);
		var z = Number(xml.getElementsByTagName("z")[0].firstChild.data);
		//var m = Number(xml.getElementsByTagName("i")[0].firstChild.data);
		pointList[nr] = new vec3(x,y,z);
		clickList[nr] = pointList[nr].toSpherical();
		spheres[nr].setCenter(clickList[nr].toCartesian());
		if (lines[nr])
			lines[nr].setStart(clickList[nr].toCartesian());
		if (lines[nr-1])
			lines[nr-1].setEnd(clickList[nr].toCartesian());
		if (finished && nr == 0 && lines[pointList.length-1])
			lines[pointList.length-1].setEnd(clickList[nr].toCartesian());
		GV.info.measurement();
		GV.setting.changeViewerMeasurement();
	}
	
	this.getXML = function() {
		var fid = feature ? feature.getID().substring(feature.getID().lastIndexOf("/")+1) : "";
		var pid = GV.setting.spatialstore.getSpatialcontext().getViewpoint().getPanorama().getID();
		var vid = GV.setting.spatialstore.getSpatialcontext().getViewpoint().getName();
		var TYPE = type.toUpperCase();
		if (clickList.length==1)
			TYPE = "POINT";
		if (clickList.length==2)
			TYPE = "LINESTRING";
		
		var xml  = "";
		xml +="<imgmeasurement>";
		xml +=	"<zoom>"+GV.setting.getZoom()+"</zoom>";
		xml +=	"<width>"+document.getElementById("viewer").width+"</width>";
		xml +=	"<height>"+document.getElementById("viewer").height+"</height>";
		xml +=	"<geomtype>"+TYPE+"</geomtype>";
		xml +=	"<viewpoint>"+vid+"</viewpoint>";
		xml +=	"<panorama>"+pid+"</panorama>";
		xml +=	"<feature>"+fid+"</feature>";
		xml +=	"<points>";
		for (var i in clickList) {
			xml +=	"<point>";
			xml +=		"<elev>"+clickList[i].getVerAngle()+"</elev>";
			xml +=		"<azim>"+clickList[i].getHorAngle()+"</azim>";
			xml +=	"</point>";
		}
		xml +=	"</points>";
		xml +="</imgmeasurement>";
		return xml;
	}
	this.getFid = function() {
		return feature ? feature.getID() : false;
	}
	
	this.getMessage = function() {
		if (!finished)
			return "Mode<br><br>Draw " + type + "<br />Click on panorama for drawing";
		if (finished == "drag")
			return "Mode<br><br>Move anchorpoints<br>Drag & drop anchorpoints";
		if (finished == "delete")
			return "Mode<br><br>Remove anchorpoints<br /><br />Click on anchorpoints to remove them";
		if (finished == "add")
			return "Mode<br><br>Add anchorpoints<br /><br />Click on outline to add anchorpoints";
	}
	
	this.memory = function() {
		var memory = 0;
		memory += size(spheres)*(10+1)*(10+1);
		memory += size(lines)*(10+1)*2;
		return memory;
	}
	this.fill = function(vertexData,colorData,indexData) {
		for (var i in spheres) {
			spheres[i].fill(vertexData,colorData,indexData,GV.Draw.SPHERE_EDIT);
		}
		for (var i in lines) {
			lines[i].fill(vertexData,colorData,indexData,GV.Draw.LINE_EDIT);
		}
	}
}
