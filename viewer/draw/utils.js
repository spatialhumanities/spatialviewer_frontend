GV.Draw = GV.Draw || {};

GV.Draw.DETAIL = 10;
GV.Draw.SIZE = 0.01;
GV.Draw.SIZE_CHANGEWHENZOOM = false;
GV.Draw.SIZE_CONSTANTONSCREEN = false;
GV.Draw.POLYGON_WITH_SPHERES = false;

GV.Draw.changeSetting = function() {
	GV.Draw.SIZE_CONSTANTONSCREEN = document.getElementById("display_setting_screen").checked;
	GV.Draw.SIZE_CHANGEWHENZOOM = document.getElementById("display_setting_zoom").checked;
	GV.Draw.POLYGON_WITH_SPHERES = document.getElementById("display_setting_polygon").checked;
	GV.setting.changeViewerFeatures();
}

/*
GV.Draw.info = function(type,pointList,measure) {
	if (type == "POINT" || type == "LINESTRING") type = "linestring";
	if (type == "MULTIPOLYGON") type = "polygon";
	if (type == "GEOMETRYCOLLECTION") type = "prism";
	var info1 = "";
	var info2 = "";
	var info3 = "";
	var size = 0;
	if (pointList.length == 1) {
		info1 = "Punkt";
		info3 = "( " + pointList[0].x.toFixed(2) + " , " + pointList[0].y.toFixed(2) + " , " + pointList[0].z.toFixed(2) + " )";
	}
	else if (pointList.length == 2 || type == "linestring") {
		var dist = 0;
		for (var i=1; i<pointList.length; i++) {
			if (pointList[i-1] && pointList[i])
				dist += Math.sqrt(pointList[i-1].dist2(pointList[i]));
		}
		info1 = "Strecke"
		info2 = dist.toFixed(2);
		info3 = "m";
		size = dist;
	}
	else if (type == "polygon" || type == "prism") {
		var area = 0;
		for (var i=2; i< ((type=="prism" && !measure) ? pointList.length/2 : pointList.length); i++) {
			var a2 = pointList[0].dist2(pointList[i-1]);
			var b2 = pointList[0].dist2(pointList[i]);
			var c2 = pointList[i].dist2(pointList[i-1]);
			var h = Math.sqrt(b2-(c2+b2-a2)*(c2+b2-a2)/(4*c2));
			if (!isNaN(h))
				area += Math.sqrt(c2)*h/2;
		}
		if (type == "polygon" || measure) {
			info1 = "Fläche";
			if (area<1) {
				info2 = (10000*area).toFixed(0);
				info3 = "cm²";
			}
			else {
				info2 = area.toFixed(1);
				info3 = "m²";
			}
		}
		else if (type == "prism") {
			info1 = "Volumen";
			area *= Math.sqrt(pointList[pointList.length/2].dist2(pointList[0]));
			if (area<0.001) {
				info2 = (1000000*area).toFixed(0);
				info3 = "ml";
			}
			else if (area<1) {
				info2 = (1000*area).toFixed(1);
				info3 = "l";
			}
			else {
				info2 = area.toFixed(1);
				info3 = "m³";
			}
		}
		size = area;
	}
	return [info1,info2,info3,size];
}
*/
