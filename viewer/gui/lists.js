GV.GUI = GV.GUI || {};

GV.GUI.execute = function(selectID,value) {
	
	if (selectID == "spatialcontext")
		GV.setting.spatialstore.setSpatialcontext(value);
	if (selectID == "viewpoint")
		GV.setting.spatialstore.getSpatialcontext().setViewpoint(value);
	if (selectID == "floorplanmedia")
		GV.setting.spatialstore.getSpatialcontext().setFloorplan(value);
	if (selectID == "panorama")
		GV.setting.spatialstore.getSpatialcontext().getViewpoint().setPanorama(value);
}

GV.GUI.fillSelect = function(selectID,list) {
	var ul = document.getElementById(selectID);
	ul.className = ul.className + " nano-content";
	while (ul.previousSibling) {
		ul.parentNode.removeChild(ul.previousSibling);
	}
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}
	for (var i in list) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.href = "javascript:GV.GUI.execute('"+selectID+"','"+list[i].getID()+"')";
		a.appendChild(document.createTextNode(list[i].getName()));
		li.appendChild(a);
		ul.appendChild(li);

		
	}

}

GV.GUI.select = function(selectID,object) {
	var ul = document.getElementById(selectID);
	while (ul.previousSibling) {
		ul.parentNode.removeChild(ul.previousSibling);
	}
	if (object){
		
		$("<span class='icon-dropdown iconfont'></span>").insertAfter($("#" + selectID).parent().prev(".change"));
		$("#" + selectID).parent().prev().prev(".change").text(object.getName(),ul);
	}
}
