GV.Draw.eps = 0.000001;

GV.Draw.Geometry = function(geom) {
	
	var pointList = [];
	var triangleList = [];
	var spheres = [];
	var lines = [];
	var triangles = [];
	var type = GV.Draw.Geometry.getType(geom);
	
	var computePolygon = function(wkt) {
		var tmpTriangles = [];
		for (var i=0; i<wkt.length; i++) {
			var triangle = GV.Draw.Geometry.split(wkt[i]);
			triangle = GV.Draw.Geometry.split(triangle[0]);
			var a = GV.Draw.Geometry.readPoint(triangle[0]);
			var b = GV.Draw.Geometry.readPoint(triangle[1]);
			var c = GV.Draw.Geometry.readPoint(triangle[2]);
			if (a.dist2(b) > GV.Draw.eps && b.dist2(c) > GV.Draw.eps && c.dist2(a) > GV.Draw.eps) {
				tmpTriangles.push([a,b]);
				tmpTriangles.push([b,c]);
				tmpTriangles.push([c,a]);
			}
		}
		var tmpLines = [];
		for (var i=0; i<tmpTriangles.length; i++) {
			var found = false;
			for (var j=0; j<tmpTriangles.length; j++) {
				if (i != j && tmpTriangles[i][0].dist2(tmpTriangles[j][0]) < GV.Draw.eps && tmpTriangles[i][1].dist2(tmpTriangles[j][1]) < GV.Draw.eps)
					found = true;
				if (i != j && tmpTriangles[i][0].dist2(tmpTriangles[j][1]) < GV.Draw.eps && tmpTriangles[i][1].dist2(tmpTriangles[j][0]) < GV.Draw.eps)
					found = true;
			}
			if (!found) {
				tmpLines.push(tmpTriangles[i]);
			}
		}
		var pi = 0;
		var pj = 0;
		var securityCounter = 0;
		var oldPointList = pointList.length;
		do {
			pointList.push(tmpLines[pi][pj]);
			for (var i=0; i<tmpLines.length; i++) {
				if (i != pi && tmpLines[pi][pj].dist2(tmpLines[i][0]) < GV.Draw.eps) {
					pi = i;
					pj = 1;
					break;
				}
				if (i != pi && tmpLines[pi][pj].dist2(tmpLines[i][1]) < GV.Draw.eps) {
					pi = i;
					pj = 0;
					break;
				}
			}
			securityCounter++;
		} while (tmpLines[pi][pj].dist2(tmpLines[0][0]) > GV.Draw.eps && securityCounter <= tmpLines.length);
		for (var i=0; i<tmpTriangles.length; i+=3) {
			var ia,ib,ic;
			for (var j=oldPointList; j<pointList.length; j++) {
				if (pointList[j].dist2(tmpTriangles[i][0]) < GV.Draw.eps)
					ia = j;
				if (pointList[j].dist2(tmpTriangles[i+1][0]) < GV.Draw.eps)
					ib = j;
				if (pointList[j].dist2(tmpTriangles[i+2][0]) < GV.Draw.eps)
					ic = j;
			}
			triangleList.push([ia,ib,ic]);
		}
	}
	
	this.create = function() {
		spheres.length = lines.length = triangles.length = 0;
		var t = GV.setting.spatialstore.getSpatialcontext().getViewpoint().getTransformation().inverse();
		var tmpPoints = [];
		for (var i=0; i<pointList.length; i++) {
			var point = new vec4(pointList[i].x,pointList[i].y,pointList[i].z,1);
			point.mulM(t);
			tmpPoints.push(point.toVec3());
		}
		for (var i=0; i<tmpPoints.length; i++)
			spheres.push(new GV.Draw.Sphere(tmpPoints[i]));
		if (type == "GEOMETRYCOLLECTION") {
			for (var i=1; i<tmpPoints.length/2; i++) {
				lines.push(new GV.Draw.Line(tmpPoints[i-1],tmpPoints[i]));
				lines.push(new GV.Draw.Line(tmpPoints[tmpPoints.length/2+i-1],tmpPoints[tmpPoints.length/2+i]));
			}
			lines.push(new GV.Draw.Line(tmpPoints[tmpPoints.length/2-1],tmpPoints[0]));
			lines.push(new GV.Draw.Line(tmpPoints[tmpPoints.length-1],tmpPoints[tmpPoints.length/2]));
			for (var i=0; i<tmpPoints.length/2; i++)
				lines.push(new GV.Draw.Line(tmpPoints[i+tmpPoints.length/2],tmpPoints[i]));
		}
		else {
			for (var i=1; i<tmpPoints.length; i++)
				lines.push(new GV.Draw.Line(tmpPoints[i-1],tmpPoints[i]));
			if (type == "MULTIPOLYGON")
				lines.push(new GV.Draw.Line(tmpPoints[tmpPoints.length-1],tmpPoints[0]));
		}
		for (var i=0; i<triangleList.length; i++)
			triangles.push(new GV.Draw.Triangle(tmpPoints[triangleList[i][0]],tmpPoints[triangleList[i][1]],tmpPoints[triangleList[i][2]]));
	}
	
	if (type == "POINT") {
		var wkt = GV.Draw.Geometry.split(geom);
		pointList.push(GV.Draw.Geometry.readPoint(wkt[0]));
	}
	if (type == "LINESTRING") {
		var wkt = GV.Draw.Geometry.split(geom);
		for (var i=0; i<wkt.length; i++) {
			pointList.push(GV.Draw.Geometry.readPoint(wkt[i]));
		}
	}
	if (type == "MULTIPOLYGON") {
		computePolygon(GV.Draw.Geometry.split(geom));
	}
	if (type == "GEOMETRYCOLLECTION") {
		var parts = GV.Draw.Geometry.split(geom);
		computePolygon(GV.Draw.Geometry.split(parts[0]));
		computePolygon(GV.Draw.Geometry.split(parts[1]));
		var wkt = GV.Draw.Geometry.split(parts[2]);
		for (var i=0; i<wkt.length; i++) {
			var triangle = GV.Draw.Geometry.split(wkt[i]);
			triangle = GV.Draw.Geometry.split(triangle[0]);
			var a = GV.Draw.Geometry.readPoint(triangle[0]);
			var b = GV.Draw.Geometry.readPoint(triangle[1]);
			var c = GV.Draw.Geometry.readPoint(triangle[2]);
			var ia,ib,ic;
			for (var j=0; j<pointList.length; j++) {
				if (pointList[j].dist2(a) < GV.Draw.eps)
					ia = j;
				if (pointList[j].dist2(b) < GV.Draw.eps)
					ib = j;
				if (pointList[j].dist2(c) < GV.Draw.eps)
					ic = j;
			}
			triangleList.push([ia,ib,ic]);
		}
	}
	var center = GV.Draw.Geometry.centroid(pointList);
	
	this.getTransformedCenter = function() {
		var t = GV.setting.spatialstore.getSpatialcontext().getViewpoint().getTransformation().inverse();
		var point = new vec4(center.x,center.y,center.z,1);
		point.mulM(t);
		return point.toVec3();
	}
	this.getCenter = function() {
		return new vec4(center.x,center.y,1,1);
	}
	/*this.getWKT = function() {
		return center.x.toFixed(3) + " " + center.y.toFixed(3) + " " + center.z.toFixed(3);
	}*/
	
	this.memory = function() {
		var memory = 0;
		memory += size(spheres)*(10+1)*(10+1);
		memory += size(lines)*(10+1)*2;
		memory += size(spheres);
		return memory;
	}
	this.fill = function(vertexData,colorData,indexData,selected) {
		if (GV.Draw.POLYGON_WITH_SPHERES || type == "POINT" || type == "LINESTRING") 
		for (var i in spheres) {
			spheres[i].fill(vertexData,colorData,indexData,selected ? GV.Draw.SPHERE_SELECTED : GV.Draw.SPHERE_DEFAULT);
		}
		for (var i in lines) {
			lines[i].fill(vertexData,colorData,indexData,selected ? GV.Draw.LINE_SELECTED : GV.Draw.LINE_DEFAULT);
		}
		for (var i in triangles) {
			triangles[i].fill(vertexData,colorData,indexData,selected ? GV.Draw.TRIANGLE_SELECTED : GV.Draw.TRIANGLE_DEFAULT);
		}
	}
	
	this.updateRadius = function() {
		var radius = GV.Draw.SIZE;
		if (GV.Draw.SIZE_CHANGEWHENZOOM)
			radius *= GV.setting.getZoom();
		if (GV.Draw.SIZE_CONSTANTONSCREEN)
			radius *= this.getTransformedCenter().norm();
		for (var i in spheres) {
			spheres[i].setRadius(radius);//0.02);//zoom/50);
		}
		for (var i in lines) {
			lines[i].setRadius(radius/4);//0.005)//zoom/200);
		}
	}
	
	this.intersects = function(point) {
		for (var i in spheres) {
			if (spheres[i].intersects(point))
				return true;
		}
		for (var i in lines) {
			if (lines[i].intersects(point))
				return true;
		}
		for (var i in triangles) {
			if (triangles[i].intersects(point))
				return true;
		}
		return false;
	}
	
	this.snaps = function(point) {
		for (var i in spheres) {
			if (spheres[i].intersects(point))
				return spheres[i].getCenter();
		}
		return false;
	}
	
	this.getType = function() {
		return type;
	}
	
	this.getPointList = function() {
		return type == "GEOMETRYCOLLECTION" ? pointList.slice(0,pointList.length/2) : pointList;
	}
	
	/*this.getSize = function() {
		var info = GV.Draw.info(type,pointList);
		return Number(info[3]);
	}*/
}

GV.Draw.Geometry.centroid = function(pointList) {
	var center = new vec3(0,0,0);
	for (var i in pointList) {
		center.addV(pointList[i]);
	}
	center.mulS(1.0/pointList.length);
	return center;
}

GV.Draw.Geometry.readPoint = function(wkt) {
	var split = wkt.split(" ");
	var x = Number(split[0]);
	var y = Number(split[1]);
	var z = Number(split[2]);
	return new vec3(x,y,z);
}

GV.Draw.Geometry.getType = function(wkt) {
	return wkt.slice(0,wkt.indexOf("(")).toUpperCase();
}

GV.Draw.Geometry.split = function(wkt) {
	var slice = wkt.slice(wkt.indexOf("(")+1,wkt.lastIndexOf(")"));
	var split = [];
	var brackets = 0;
	var lastSplit = 0;
	for (var i=0; i<slice.length; i++) {
		var charAt = slice.charAt(i);
		if (charAt == ',' && brackets == 0) {
			split.push(slice.slice(lastSplit,i));
			lastSplit = i+1;
		}
		if (charAt == '(') brackets++;
		if (charAt == ')') brackets--;
	}
	split.push(slice.slice(lastSplit));
	return split;
}
