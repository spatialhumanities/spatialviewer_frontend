GV.Annotationstore.Resource = function(xml,cid) {
	
	// identifiers
	var id = xml.getAttribute("id");
	var uri = xml.getAttribute("href");
	var name = xml.getAttribute("id");
	
	// load
	this.load = function() { }
	
	// get ID Name
	this.getID = function() {
		return id;
	}
	this.getName = function() {
		return name;
	}
	this.getCollection = function() {
		return collection;
	}
	
	// get data
	this.getURL = function() {
		return uri;
	}
	
	this.open = function() {
		var ending = uri.substr(uri.lastIndexOf("/"));
		var htmlurl = "http://www.inschriften.net/zeige/suchergebnis/treffer/set/0/nr" + ending + ".html";
		var newwindow = window.open(htmlurl, 'IBR Generic Viewer - Artikel', 'width=1100,height=700,scrollbars=yes');
		newwindow.focus();
	}
}
