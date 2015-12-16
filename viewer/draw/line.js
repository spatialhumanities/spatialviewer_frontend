GV.Draw.Line = function(start,end) {
	
	var data = [];
	var index = [];
	var s = start;
	var e = end ? end : start.copy();
	var r = 0;
	
	this.setRadius = function(radius) {
		r = radius;
		create();
	}
	this.setStart = function(start) {
		s = start;
		create();
	}
	this.setEnd = function(end) {
		e = end;
		create();
	}
	
	this.fill = function(vertexData,colorData,indexData,col) {
		if (e.dist2(s) > 0.00001) {
			var k = vertexData.length/3;
			for (var i=0; i<data.length; i++) {
				data[i].push(vertexData);
				col.push(colorData);
			}
			for (var i=0; i<index.length; i++) {
				indexData.push(k+index[i]);
			}
		}
	}
	
	this.intersects = function(point) {
		var s0 = point.copy();
		var ds = -point.dot(s)/point.dot(point);
		if (ds > 0)
			return false;
		s0.mulS(ds);
		s0.addV(s);
		var e0 = point.copy();
		var de = -point.dot(e)/point.dot(point);
		if (de > 0)
			return false;
		e0.mulS(de);
		e0.addV(e);
		var d0 = e0.copy();
		d0.mulS(-1);
		d0.addV(s0);
		var d = -s0.dot(d0)/d0.dot(d0);
		if (d > 0 || d < -1)
			return false;
		d0.mulS(d);
		d0.addV(s0);
		return d0.dot(d0) < 9*r*r;
	}
	
	var create = function() {
		/*for (var i=data.length-1; i>=0; i--) {
			delete data[i];
		}*/
		data.length = 0;
		/*for (var i=index.length-1; i>=0; i--) {
			delete index[i];
		}*/
		index.length = 0;
		if (e.dist2(s) < GV.Draw.eps) {
			return;
		}
		var dir = new vec3(-s.x,-s.y,-s.z); dir.addV(e); dir.mulS(1/dir.norm());
		var ry = r/Math.sqrt(1+dir.y*dir.y/(dir.z*dir.z));
		var rz = -ry*dir.y/dir.z;
		for (var i=0; i<=GV.Draw.DETAIL; i++) {
			var alpha = 2*Math.PI*i/GV.Draw.DETAIL;
			var sinA = Math.sin(alpha);
			var cosA = Math.cos(alpha);
			var px = (dir.x*dir.y*(1-cosA)-dir.z*sinA)*ry + (dir.x*dir.z*(1-cosA)+dir.y*sinA)*rz;
			var py = (dir.y*dir.y*(1-cosA)      +cosA)*ry + (dir.y*dir.z*(1-cosA)-dir.x*sinA)*rz;
			var pz = (dir.z*dir.y*(1-cosA)+dir.x*sinA)*ry + (dir.z*dir.z*(1-cosA)      +cosA)*rz;
			var point1 = new vec3(px,py,pz);
			var point2 = new vec3(px,py,pz);
			point1.addV(s);
			point2.addV(e);
			data.push(point1);
			data.push(point2);
		}
		for (var i=0; i<2*GV.Draw.DETAIL; i+=2) {
			index.push(i);
			index.push(i+1);
			index.push(i+2);
			index.push(i+1);
			index.push(i+2);
			index.push(i+3);
		}
	}
}
