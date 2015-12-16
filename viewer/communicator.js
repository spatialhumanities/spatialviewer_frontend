var IO = {};
GV.Config = {};
GV.OpenID = GV.OpenID || {};

GV.Config.SpatialcontextID = "oberwesel";

//GV.Config.basicURL = "http://localhost:8084/";
GV.Config.basicURL = "http://ibr.spatialhumanities.de/"; // server spatialstore (test2)
GV.Config.viewer = GV.Config.basicURL + "spatialviewer/beta/";
GV.Config.spatialstore = GV.Config.basicURL + "spatialstore_beta/"; 


GV.Config.spatialstoreURL = GV.Config.spatialstore + "rest/";
GV.OpenID.url = GV.Config.spatialstore + "openid/";
GV.OpenID.data = GV.OpenID.url + "data";
GV.OpenID.login = GV.OpenID.url + "login";
GV.OpenID.logout = GV.OpenID.url + "logout";


// TODO GV.TRIPLESTORE_API = "http://ibr.spatialhumanities.de/openrdf-sesame/repositories/oberwesel";//EXTERNAL_SERVER_ADDRESS
// TODO GV.TRIPLESTORE_GUI = "http://ibr.spatialhumanities.de/openrdf-workbench/repositories/oberwesel";//EXTERNAL_SERVER_ADDRESS

IO.updateAll = function(callback) {
	var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
	var sid = spatialcontext.getID();
	var time = new Date(new Date().getTime() - 20000);
	IO.readXML(sid,callback,sid);
	//IO.readXML(sid+"/features?lastModify"+time,callback,sid);
}

IO.loadDocumentation = function(callback) {
	//var filename = GV.Config.spatialstore + "documentation.txt";
	var filename = "documentation.txt";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET",filename,true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200)
				callback(xmlhttp.responseText);
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp);
		}
	}
	xmlhttp.requestURL = filename;
	xmlhttp.send();
}

IO.importFeatures = function() {
	//RestResource.java -> importFeatures
	var file = document.getElementById("feature_import_file");
	var sid = GV.setting.spatialstore.getSpatialcontext().getID();
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST",sid,true);
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				GV.setting.spatialstore.update(xmlhttp.responseXML,sid);
                GV.Filter.updateTable();
            }
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp);
		}
		
	}
	xmlhttp.requestURL = sid;
	xmlhttp.send(file);
	
//	$.ajax({
//        beforeSend: function(req) {
//            req.setRequestHeader("Accept","application/xml");
//        },
//        type: 'POST',
//        contentType: 'text/plain',
//        dataType: 'wkt',
//        data: {file:file},
//        url: sid,
//        error: function(jqXHR, textStatus, errorThrown) {
//            alert(textStatus);
//        },
//        success: function (xml) {
//            callback(xml);
//        }
//    });
	
	
}

IO.deleteFeatures = function() {
	var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
	var selfids = spatialcontext.getSelectedFeatures();
	var geoURIs=new Array();//edit Felix
	if (confirm("Sollen " + size(selfids) + " Geometrien wirklich entfernt werden?")) {
		var sid = spatialcontext.getID();

		for (var id in selfids) {
			geoURIs.push(id);
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST",id+"/delete",false);
			//xmlhttp.withCredentials=true;//edit Felix
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 204) {
						GV.setting.spatialstore.update(false,sid,id);
                        GV.Filter.updateTable();
                    }
					else if (xmlhttp.status < 500)
						GV.info.clientError(xmlhttp);
					else
						GV.info.error(xmlhttp);
				}
			}
			GV.info.remove(selfids[id]);
			xmlhttp.requestURL = id+"/delete";
			xmlhttp.send();
		}
	}
}

IO.saveFeature = function() {
	var xml = GV.setting.getMeasurement().getXML();
	var fid = GV.setting.getMeasurement().getFid();
	if (fid)
		fid = fid.substring(fid.lastIndexOf("/")+1);
	var sid = GV.setting.spatialstore.getSpatialcontext().getID();
	var vid = GV.setting.spatialstore.getSpatialcontext().getViewpoint().getID();
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST",vid,true);
	xmlhttp.withCredentials=true;//edit Felix
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				IO.saveScreenshot(sid,GV.setting.spatialstore.update(xmlhttp.responseXML,sid),fid);
                GV.Filter.updateTable();
            }
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp);
		}
	}
	GV.info.create();
	xmlhttp.requestURL = vid+"?"+"xml="+xml + (fid ? "&feature="+fid : "");
	xmlhttp.send("xml="+xml + (fid ? "&feature="+fid : ""));
}

IO.saveScreenshot = function(sid,fid,edited) {
	var vid = GV.setting.spatialstore.getSpatialcontext().getViewpoint().getID();
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST",fid+"/screenshot",true);
	xmlhttp.withCredentials=true;//edit Felix
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200)
				GV.setting.spatialstore.update(xmlhttp.responseXML,sid);
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp);
		}
	}
	
	var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
	var displayed = spatialcontext.getDisplayedFeatures();
	var azim = GV.setting.getAzim();
	var elev = GV.setting.getElev();
	var selected = first(spatialcontext.getSelectedFeatures());
	spatialcontext.setDisplayedFeatures([selected.getID()]);
	var center = selected.getGeometry().getTransformedCenter().toSpherical();
	GV.setting.setAzim(center.getHorAngle());
	GV.setting.setElev(center.getVerAngle());
	var img = document.getElementById("viewer").toDataURL();
	GV.setting.setAzim(azim);
	GV.setting.setElev(elev);
	spatialcontext.setDisplayedFeatures(keys(displayed));
	

	xmlhttp.requestURL = fid+"/screenshot?img="+img + "&height=156&width=156";
	xmlhttp.send("img="+img + "&height=156&width=156");
	
	var xmlhttp2 = new XMLHttpRequest();
	xmlhttp2.open("POST",fid+"/visibility",true);
	//xmlhttp.withCredentials=true;//edit Felix
	xmlhttp2.onreadystatechange = function() {
		if (xmlhttp2.readyState == 4) {
			if (xmlhttp2.status == 200) {
				GV.setting.spatialstore.update(xmlhttp2.responseXML,sid);
				IO.setVisible(sid,fid,vid);
			}
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp2);
		}
	}
	xmlhttp2.send();
}

IO.checkVisibility = function(sid,fid) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST",fid+"/visibility");
xmlhttp.withCredentials=true;//edit Felix
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200)
				GV.setting.spatialstore.update(xmlhttp.responseXML,sid);
			else
				GV.info.error(xmlhttp);
		}
	}
	xmlhttp.requestURL = fid+"/visibility";
	xmlhttp.send();
}

IO.setVisible = function(sid,fid,vid) {
	vid = vid.substring(vid.lastIndexOf("/")+1);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST",fid+"/setvisible",true);
	xmlhttp.withCredentials=true;//edit Felix
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				GV.setting.spatialstore.update(xmlhttp.responseXML,sid);
                GV.Filter.updateTable();
            }
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp);
		}
	}
	xmlhttp.requestURL = fid+"/setvisible?viewpoint="+vid;
	xmlhttp.send("viewpoint="+vid);
}

IO.setInvisible = function(sid,fid,vid) {
	vid = vid.substring(vid.lastIndexOf("/")+1);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST",fid+"/setinvisible",true);
	xmlhttp.withCredentials=true;//edit Felix
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				GV.setting.spatialstore.update(xmlhttp.responseXML,sid);
                GV.Filter.updateTable();
            }
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp);
		}
	}
	xmlhttp.requestURL = fid+"/setinvisible?viewpoint="+vid;
	xmlhttp.send("viewpoint="+vid);
}

// Read sth. from Spatialstore ReST Interface
IO.readXML = function(filename, callback, info) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET",filename,true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status >= 200 && xmlhttp.status < 300)
				callback(xmlhttp.responseXML,info);
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp);
		}
	}
	xmlhttp.requestURL = filename;
	xmlhttp.send();
}

//IO.savedQueries = function() {
//	var filename = GV.TRIPLESTORE_GUI + "/saved-queries";
//	var xmlhttp = new XMLHttpRequest();
//	xmlhttp.open("GET",filename);
//	xmlhttp.onreadystatechange = function() {
//		if (xmlhttp.readyState == 4) {
//			if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
//				var results = xmlhttp.responseXML.getElementsByTagName("result");
//				var div = document.getElementById("saved_queries");
//				for (var i=0; i<results.length; i++) {
//					var queryName = "";
//					var queryText = "";
//					var bindings = results[i].getElementsByTagName("binding");
//					for (var j=0; j<bindings.length; j++) {
//						if (bindings[j].getAttribute("name") == "queryName")
//							queryName = bindings[j].getElementsByTagName("literal")[0].textContent;
//						if (bindings[j].getAttribute("name") == "queryText")
//							queryText = bindings[j].getElementsByTagName("literal")[0].textContent;
//					}
//					GV.Filter.savedQueries.list[queryName] = queryText;
//					var a = document.createElement("a");
//					//a.setAttribute("class","savedquery");
//					a.appendChild(document.createTextNode(queryName));
//					a.href = "javascript:GV.Filter.savedQueries('"+queryName+"')";
//					//a.href = "javascript:document.getElementById('sparql').value='"+queryText+"'";
//					div.appendChild(a);
//				}
//			}
//			else if (xmlhttp.status < 500)
//				GV.info.clientError(xmlhttp);
//			else
//				GV.info.error(xmlhttp);
//		}
//	}
//	xmlhttp.requestURL = filename;
//	xmlhttp.send();
//}

IO.sparql = function(query,callback) {
	var format = "&Accept=application/sparql-results%2Bxml";
	var filename = GV.TRIPLESTORE_API + "?query=" + encodeURIComponent(query) + format;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET",filename);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status >= 200 && xmlhttp.status < 300)
				callback(xmlhttp.responseXML);
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp);
		}
	}
	xmlhttp.requestURL = filename;
	xmlhttp.send();
}

IO.sendXML4 = function(filename, visible, vid, callback, sid) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST",filename,true);
	xmlhttp.withCredentials=true;//edit Felix
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status >= 200 && xmlhttp.status < 300)
				callback(xmlhttp.responseXML,sid);
			else if (xmlhttp.status < 500)
				GV.info.clientError(xmlhttp);
			else
				GV.info.error(xmlhttp);
		}
	}
	xmlhttp.send("featurevisiblefrom="+vid + "&type="+(visible ? "input" : "delete"));
}
	
// Clear Database / Remove Project
IO.clearDatabase = function(filename, clearMode, callback) {
        
    $.ajax({
        beforeSend: function(req) {
            req.setRequestHeader("Accept","application/xml");
        },
        type: 'POST',
        contentType: 'text/plain',
        dataType: 'xml',
        data: {clearMode:clearMode},
        url: filename,
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (xml) {
            callback(xml);
        }
    });	
}

// send project XML 
IO.sendProject = function(filename, projectXML, callback) {
        
    $.ajax({
        beforeSend: function(req) {
            req.setRequestHeader("Accept","application/xml");
        },
        type: 'POST',
        contentType: 'text/plain',
        dataType: 'xml',
        data: {projectXML:projectXML},
        url: filename,
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (xml) {
            callback(xml);
        }
    });
}

// Send Theta and Phi to get XYZ
IO.infoPoint = function(sid,vid,spherical,callback,info) {
	$.ajax({
		beforeSend: function(req) {
			req.setRequestHeader("Accept","application/xml");
		},
		type: 'GET',
		contentType: 'text/plain',
		dataType: 'xml',
		data: {viewpoint:vid.substring(vid.lastIndexOf("/")+1),elev:spherical.getTheta(),azim:spherical.getPhi()},
		url: sid + "/point",
		error: function(jqXHR, textStatus, errorThrown) {
			alert(textStatus);
		},
		success: function (xml) {
			callback(xml,info);
		}
	});
}

