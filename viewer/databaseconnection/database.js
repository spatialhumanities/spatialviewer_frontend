function DataBase() {

	this.handleFileSelect = function(evt) {
		var files = evt.target.files; // FileList object
	
		//console.log(files[0].name);
		//console.log(files[0].type);
		//console.log(files[0].size);
		startRead(files[0]); 
	}

	function startRead(projectFile) {  
		if(projectFile){
			getAsText(projectFile);
		}
	}

	function getAsText(readFile) {
		var reader = new FileReader();
  
		// Read file into memory as UTF-8      
		reader.readAsText(readFile, "UTF-8");
  
		// Handle progress, success, and errors
		reader.onprogress = updateProgress;
		reader.onload = loaded;
		reader.onerror = errorHandler;
	}

	function updateProgress(evt) {
		if (evt.lengthComputable) {
			// evt.loaded and evt.total are ProgressEvent properties
			var loaded = (evt.loaded / evt.total);
			if (loaded < 1) {
				// Increase the prog bar length
				// style.width = (loaded * 200) + "px";
			}
		}
	}

	function loaded(evt) {  
		// Obtain the read file data    
		var fileString = evt.target.result;   
		//console.log(fileString);
	
		//Senden an das Servlet
		var projectXML = fileString;
		IO.sendProject(GV.Config.spatialstoreURL, projectXML, showString);
	}

	function errorHandler(evt) {
		if(evt.target.error.name == "NotReadableError") {
			console.err("not readable");
		}
	}
	
	this.handleClearDatabaseAll = function(evt) {
		
		// Dialog ob wirklich gel�scht werden soll
		Check = confirm("Delete ALL Database values?");
		if (Check == true) {
			IO.clearDatabase(GV.Config.spatialstoreURL, "all", showString);
		} else {
			alert('Nothing deleted!');
		}
	}
	
	this.handleClearDatabaseSC = function(evt) {
		
		var sc = document.getElementById("projects").value;
		// Dialog ob wirklich gel�scht werden soll
		Check = confirm("Delete all Project values of " + sc + " ?");
		if (Check == true) {
			IO.clearDatabase(GV.Config.spatialstoreURL, sc, showString);
		} else {
			alert('Nothing deleted!');
		}
	}
	
    // zeigt den Ergebnisstring an
    function showString(xml) {
        var string = (new XMLSerializer()).serializeToString(xml);
		alert(string);
    }
	
}