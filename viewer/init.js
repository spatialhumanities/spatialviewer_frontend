var GV = GV || {}; // Generic Viewer Namespace

GV.init = function() {
	
	// init OpenID and check Login
	GV.openid = new GV.OpenID.Main();
	GV.openid.update();
	
	GV.setting = new GV.Setting();
	
	// init annotationstore
	//GV.annotationstore = new GV.Annotationstore.Main();
	//GV.annotationstore.init();
	
	window.onresize = function(event) {window.setTimeout("GV.setting.resize()",10)};

	GV.info = new GV.Info();
}

GV.Info = function() {
	var span = document.getElementById("info");
	this.allDisplayed = true;
	
	this.error = function(xmlhttp) {
		span.innerHTML = "An error occurred!<br />Please report the bug on GitHub<br /><a href='mailto:martin.unold@hs-mainz.de?subject=[IBR]Error&body="+xmlhttp.requestURL+"$$\n$$"+xmlhttp.responseText+"'>Fehler senden</a>";
		alertRed();
	}

	this.filterResultCount = function(count){
		span.innerHTML =  count + " Features filtered";
	}
	
	this.clientError = function(xmlhttp, calling) {
		span.innerHTML = "An error occurred!<br />";
        console.log("clienError called by " + calling);
		var messages = xmlhttp.responseXML.getElementsByTagName("message");
		for (var i=0; i<messages.length; i++) {
			if (messages[i].textContent)
				span.innerHTML += messages[i].textContent + "<br />";
		}
		alertRed();
	}
	
	this.select = function(features) {
		var s = size(features);
		if (s == 0) {
			if (GV.info.allDisplayed)
				span.innerHTML = "";
			else
				span.innerHTML = "Attention:<br/>There are too many features.<br/>Not every feature is displayed.<br/>Please use a filter.";
		}
		if (s == 1)
			first(features).displayInfo();
		if (s > 1) {
			var count = Object.keys(GV.setting.spatialstore.getSpatialcontext().getDisplayedFeatures()).length;
			span.innerHTML = "<p id='infofiltered' class='inforow'><span class='number'>" + count + "</span> Features filtered</p><p id='infoselected' class='inforow'><span class='number'>" + s + "</span> Features selected.</p>";
			

			/*if (GV.visibility.getState() == 0)
				span.innerHTML += "<br />Start visibility analysis here:<a href='javascript:GV.visibility.start();'>GO</a>";*/
		}
		/*if (GV.visibility.getState() == 2)
			span.innerHTML += "<br />Visibility analysis is computing.";*/
		alertYellow();
	}
	
	/*this.visibility = function(link) {
		span.innerHTML = "Download your visibility analysis here:<a href='"+link+"'>GO</a>";
	}*/
	
	this.create = function() {
		span.innerHTML = "Create feature ... <br />Please wait a moment.";
		alertYellow();
	}
	
	this.remove = function(feature) {
		span.innerHTML = "Remove feature " + feature.getName() + ".";
		alertYellow();
	}
	
	this.measurement = function() {
		span.innerHTML = GV.setting.getMeasurement().getMessage();
		alertYellow();
	}
	
	this.alertYellow = function() {
		alertYellow();
	}
	var alertYellow = function() {
		span.setAttribute("class","interaction");
		var controllKey = Math.random();
		key = controllKey;
		window.setTimeout(function(){removeBackground(controllKey)},2000);
	}
	
	var alertRed = function() {
		span.setAttribute("class","error toggleheight");
		var controllKey = Math.random();
		key = controllKey;
		window.setTimeout(function(){removeBackground(controllKey)},2000);
	}
	
	var key = false;
	var removeBackground = function(controllKey) {
		if (key == controllKey)
			span.setAttribute("class","default toggleheight");
	}
	
}
