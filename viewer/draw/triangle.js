GV.Draw.Triangle = function(a,b,c) {
	
	var data = c ? (GV.Draw.Triangle.isClockwise(a,b,c) ? [a,b,c] : [c,b,a]) : [a,b,b.copy()];
	var index = [0,1,2];
	
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
		var sab = data[0].cross(data[1]).dot(point);
		var sbc = data[1].cross(data[2]).dot(point);
		var sca = data[2].cross(data[0]).dot(point);
		return (sab >= 0 && sbc >= 0 && sca >= 0);
	}
}

GV.Draw.Triangle.isClockwise = function(a,b,c) {
	var sab = a.cross(b).dot(c);
	var sbc = b.cross(c).dot(a);
	var sca = c.cross(a).dot(b);
	return (sab >= 0);
}
