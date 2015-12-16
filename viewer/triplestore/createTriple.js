function createTriple2() {
	var resource = GV.gui.getSelected("resource");
	GV.annotationstore.openResource(resource);
}

function blabla() {
	var actArticleURL = GV.gui.getSelected("resource").getURL();
	var verbURL = "http://voc.spatialhumanities.de/";
	var verb = "has";
	
	var store = "http://t.spatialhumanities.de/openrdf-sesame/repositories/ibr";
	var sparql = "SELECT * WHERE {<"+actArticleURL+"> <"+verbURL+verb+"> ?uri}";
	readTriples(store,sparql,getTripleResourceCallback);
}

function readTriples(filename, content, callback, info) {
	$.ajax({
		dataType: 'json',
		data: {
			queryLn: 'SPARQL',
			query: content,
			limit: 'none',
			infer: 'true',
			Accept: 'application/sparql-results+json'
		},
		url: filename,
		error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		},
		success: function (xml) {
			callback(xml,info);
		}
	});
}

function getTripleFeature() {
	var actFeatureURL = GV.gui.getSelected("feature").getURL();
	var verbURL = "http://voc.spatialhumanities.de/";
	var verb = "has";
	
	var store = "http://t.spatialhumanities.de/openrdf-sesame/repositories/ibr";
	var sparql = "SELECT * WHERE {?uri <"+verbURL+verb+"> <"+actFeatureURL+">}";
	readTriples(store,sparql,getTripleFeatureCallback);
}
function getTripleFeatureCallback(json) {
	var list = json.results.bindings;
	GV.html.reset();
	for (var i=0; i<list.length; i++) {
		GV.html.addResource(list[i].uri.value);
	}
	/*if (actArticleURL.length > 0) {
		var collection = GV.Annotationstore.getCollection(actArticleURL[0]);
		var resource = GV.Annotationstore.getResource(actArticleURL[0]);
		GV.gui.setSelected("collection",collection);
		GV.gui.setSelected("resource",resource);
	}*/
}

function getTripleResourceCallback(json) {
	var list = json.results.bindings;
	if (list.length > 0) {
		var fid = list[0].uri.value.replace(/http:\/\/s.spatialhumanities.de\/[^\/]*\/features\/([^\/]*).*/,"$1");
		GV.gui.setSelected("feature",fid);
	}
}

function createTriple(_mode) {

	var actFeatureURL = GV.gui.getSelected("feature").getURL();
	var actArticleURL = GV.gui.getSelected("resource").getURL();
	var verbURL = "http://voc.spatialhumanities.de/";
	var verb = "has";
	
	var triple_turtle = "<"+actArticleURL+">" +" "+ "<"+verbURL+verb+">" +" "+ "<"+actFeatureURL+">" +" .";
	var triple_rdfxml = '<?xml version="1.0"?>' + '\n' +
						'<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:voc="'+verbURL+'">' + '\n\t' +
						'<rdf:Description rdf:about="'+actArticleURL+'">' + '\n\t\t' +
						'<voc:'+verb+' rdf:resource="'+actFeatureURL+'" />' + '\n\t' +
						'</rdf:Description>' + '\n' +
						'</rdf:RDF>';
	
	console.log(triple_turtle);
	console.log(triple_rdfxml);
	//alert(triple_turtle + '\n' + triple_rdfxml);
	//alert(triple_turtle);
	//IO.writeXML("s.spatialhumanities.de/openrdf-workbench/repositories/ibr/statements",triple_rdfxml);
	IO.writeXML("http://t.spatialhumanities.de/openrdf-sesame/repositories/ibr/statements",triple_turtle);
	
}

