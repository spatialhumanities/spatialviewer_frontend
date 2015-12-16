function Spatialstore() {
	
    var spatialcontexts = [];
    var isLoaded = false;
	
    this.load = function(callback) {
        if (isLoaded) {
            callback();
        }
        else {
            var url = GV.Config.spatialstoreURL + "viewerdata";
            IO.readXML(url,onload,callback);
        }
    }
	
    var onload = function(xml,callback) {
        var xmlSpatialcontexts = xml.getElementsByTagName("spatialcontext"); 
        for (var i=0; i<xmlSpatialcontexts.length; i++) {
            var id = xmlSpatialcontexts[i].getAttribute("id");
            spatialcontexts.push(new Spatialcontext(xmlSpatialcontexts[i])); 
        }
        isLoaded = true;
        callback();
    }
	
    // get all spatialcontexts [Objektliste]
    this.getSpatialcontexts = function() {
        return spatialcontexts;
    }
	
}
