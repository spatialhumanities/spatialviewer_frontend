GV.Metadata = function(spatialcontext, result) {
    result = JSON.parse(result);
    
    this.place = spatialcontext.getName();
    this.uri = spatialcontext.getID();
    this.urilink = "<a href=\"" + this.uri + "\"\" target=\"_blank\">" + this.uri + "</a>";
    
    this.featurecount = size(spatialcontext.getFeatures());
    this.viewpointcount = size(spatialcontext.getViewpoints());
    
    this.date = result.date;
    
    this.coordinate = result.coordinate;
    this.coordsystem = result.coordsystem;
    
    this.workbench = result.workbench;
    this.workbenchlink = "<a href=\"" + this.workbench + "\" target=\"_blank\">" + this.workbench + "</a>";
    this.repository = result.repository;
    
    this.github = "https://github.com/spatialhumanities/spatialviewer";
    this.githublink = "<a href=\"" + this.github + "\" target=\"_blank\">" + this.github + "</a>";
    this.wiki = "https://github.com/spatialhumanities/spatialviewer/wiki";
    this.wikilink = "<a href=\"" + this.wiki + "\" target=\"_blank\">" + this.wiki + "</a>";
    
};

GV.Metadata.fillMetadata = function (spatialcontext, result) {
        var metadata = new GV.Metadata(spatialcontext, result);

        document.getElementById("metadata-place").textContent = metadata.place;
        document.getElementById("metadata-uri").innerHTML = metadata.urilink;
        document.getElementById("metadata-featurecount").textContent = metadata.featurecount;
        document.getElementById("metadata-viewpointcount").textContent = metadata.viewpointcount;
        document.getElementById("metadata-date").textContent = metadata.date;
        document.getElementById("metadata-coordinate").textContent = metadata.coordinate;
        document.getElementById("metadata-coordsystem").textContent = metadata.coordsystem;
        
        document.getElementById("metadata-workbench").innerHTML = metadata.workbenchlink;
        document.getElementById("metadata-repository").textContent = metadata.repository;
        
        document.getElementById("metadata-github").innerHTML = metadata.githublink;
        document.getElementById("metadata-wiki").innerHTML = metadata.wikilink;
    
};



GV.Metadata.getMetadata = function () {
    var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
    if (spatialcontext == 'undefined' || spatialcontext == null) {
        setTimeout(function () {
            GV.Metadata.getMetadata();
        }, 1000);

    } else {


        $.ajax({
            beforeSend: function (req) {
                req.setRequestHeader("Content-Type", "text/plain");
            },
            type: 'GET',
            url: spatialcontext.getID() + "/metadata/",
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            },
            success: function (result) {
                console.log(result);
                GV.Metadata.fillMetadata(spatialcontext, result);

            }
        });
    }
};