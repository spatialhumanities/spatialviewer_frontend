var spatialstore;

function init2() {
	
	// init spatialstore
	spatialstore = new Spatialstore();
	spatialstore.load(initSpatialstore);
	
}

function initSpatialstore() {
	var spatialcontexts = spatialstore.getSpatialcontexts();
	for (var i=0; i<spatialcontexts.length; i++) {
		addOption("projects",spatialcontexts[i].getPlace(),spatialcontexts[i].getID());
	}
}

function addOption(id,name,content) {
	var options = document.getElementById(id);
	var value = content;
	var option = new Option(name,value);
	options[options.length] = option;
}