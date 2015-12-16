function Mark(xml) {
	
	var edgeList = [];
	var zoomlevel = gl.zoom;
	var type = 0;
	
	if (arguments.length > 0) {
		zoomlevel = Number(xml.getElementsByTagName("zoomlevel")[0].firstChild.data);
		var coordinates = xml.getElementsByTagName("gml:coordinates")[0].firstChild.data;
		var split = coordinates.split(" ");
		for (var i=0; i<split.length; i++) {
			var splitXY = split[i].split(",");
			var edgeSph = new Spherical(Number(splitXY[0]),Number(splitXY[1]));
			edgeList.push(edgeSph.toCartesian());
		}
	}
	
	this.add = function(edge) {
		edgeList.push(edge);
	}
	
	this.setType = function(t) {
		type = t;
	}
	
	this.push = function(vertexData,colorData,indexData) {
		var col = new vec4(0.1,0.9,0.9,0.1);
		switch(type) {
			case 1: col = new vec4(0.9,0.1,0.1,0.1); break;
			default: col = new vec4(0.1,0.9,0.9,0.1);
		}
		var index = vertexData.length/3;
		for (var i=0; i<edgeList.length; i++) {
			edgeList[i].push(vertexData);
			col.push(colorData);
			if (i>=2) {
				indexData.push(index+0);
				indexData.push(index+i-1);
				indexData.push(index+i);
			}
		}
	}
	
}


