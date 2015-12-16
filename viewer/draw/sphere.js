GV.Draw.Sphere = function(center) {
	
	var data = [];
	var index = [];
	var m = center;
	var r = 0;
	
	this.setRadius = function(radius) {
		r = radius;
		create();
	}
	this.setCenter = function(center) {
		m = center;
		create();
	}
	this.getCenter = function() {
		return m;
	}
	
	this.fill = function(vertexData,colorData,indexData,col) {
		var k = vertexData.length/3;
		for (var i=0; i<data.length; i++) {
			data[i].push(vertexData);
			col.push(colorData);
		}
		for (var i=0; i<index.length; i++) {
			indexData.push(k+index[i]);
		}
	}
	
	this.intersects = function(point) {
		var cartesian = point.copy();
		cartesian.mulS(1/cartesian.norm());
		cartesian.mulS(Math.sqrt(m.dot(m)));
		return (cartesian.dist2(m) < 4*r*r);
	}
	
	var create = function() {
		data.length = 0;
		index.length = 0;
		for (var i=0; i<=GV.Draw.DETAIL; i++) {
			var theta = Math.PI*i/GV.Draw.DETAIL;
			for (var j=-GV.Draw.DETAIL; j<=GV.Draw.DETAIL; j+=2) {
				var phi = Math.PI*j/GV.Draw.DETAIL;
				var x = r*Math.sin(theta)*Math.cos(phi);
				var y = r*Math.sin(theta)*Math.sin(phi);
				var z = r*Math.cos(theta);
				var vertex = new vec3(x,y,z);
				vertex.addV(m);
				data.push(vertex);
			}
		}
		var k = GV.Draw.DETAIL+1;
		for (var i=0; i<GV.Draw.DETAIL; i++) {
			for (var j=0; j<GV.Draw.DETAIL; j++) {
				index.push(k*i+j);
				index.push(k*i+j+1);
				index.push(k*(i+1)+j);
				index.push(k*i+j+1);
				index.push(k*(i+1)+j);
				index.push(k*(i+1)+j+1);
			}
		}
	}
}
