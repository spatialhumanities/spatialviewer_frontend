var GV = GV || {};

GV.fillSelectWithSpatialcontexts = function(selectID) {
	var callback = function(xml,selectID) {
		var select = document.getElementById(selectID);
		var sc = xml.getElementsByTagName("spatialcontext");
		for (var i=0; i<sc.length; i++) {
			var option = document.createElement("option");
			option.value = sc[i].getAttribute("id");
			option.text = sc[i].getAttribute("place");
			select.add(option);
		}
	}
	IO.readXML(GV.Config.spatialstoreURL,callback,selectID);
}
