function Spatialcontext(xml) {
	
    var viewpoints = [];
    var media = [];
    var id = xml.getAttribute("id");
    var place = xml.getElementsByTagName("place")[0].firstChild.data;
    var isLoaded = false;

    this.load = function(callback) {
        if (isLoaded) {
            callback();
        }
        else {
            var url = GV.Config.spatialstoreURL + id + "/viewerdata";
            IO.readXML(url,onload,callback);
        }
    }
	
    var onload = function(xml, callback) {
        var xmlGroundplans = xml.getElementsByTagName("grundplan");
        for (var i=0; i<xmlGroundplans.length; i++) {
        }
        var xmlViewpoints = xml.getElementsByTagName("viewpoint");
        for (var i=0; i<xmlViewpoints.length; i++) {
        }
        isLoaded = true;
        callback();
    }
	
    // get place [String]
    this.getID = function() {
        return id;
    }
    
    // get place [String]
    this.getPlace = function() {
        return place;
    }
	
    // get all viewpoints [Objektliste]
    this.getViewpoints = function() {
        return viewpoints;
    }
	
    // get all floorplans [String(Liste)]
    this.getFloorplans = function() {
        return media;
    }
	
}
