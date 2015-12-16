GV.Annotate = GV.Annotate || {};
GV.Annotate.AnnotationURL = GV.Config.spatialstoreURL + "annotate/";


// Interface Objekt, das alle Methoden des Annotationstools beinhaltet.
GV.Annotate.annotationinterface = {
    // Variablen
    listElements: [],

    origin: "",
    rootdiv: "",
    subjectvalue: "",
    predicatevalue: "",
    objectvalue: "",
    multipleannotation: false,
    
    subjectURI: "",
    predicateURI: "",
    objectURI:"",
    
    lastvalue: "+",
    lastclicked: "",
    flyout: false,
    savebutton: false,
    listactive: false,
    setvalue: 0,
    index: 0,
    
    // Liste wird geladen und in das div geschrieben
    makeFlyout: function (filter, origin) {
        //console.log("makeFlyout");

        if(filter == false){
            this.lastclicked = origin.parent();
            this.origin = origin.parent();
            this.rootdiv = origin.parent().attr('id');

        
            //Aktive Box wird markiert
            $(".annotationbox").removeClass("activebox");
            this.origin.addClass("activebox");
        }

        // bind this to variable
        var obj = this; 

        var query = {};

        if (this.rootdiv == "annotatepredicate" || this.rootdiv == 5) {
            query["valuesfor"] = "predicate";
           
            if(filter == false){
                //console.log("predicate");
                GV.Annotate.sendQuery(query, function(result){obj.readValues(result, "predicate")});
                GV.Filter.filterinterface.cancel();
                GV.HTML.constructTabHeader();
                this.showFlyout();
                this.flyoutPosition(this.origin);
            }
            else {
                GV.Annotate.sendQuery(query, function(result){obj.readValues(result, "predicate", true)});
                GV.HTML.constructTabHeaderFilter();
            }
            
            
        } else if (this.rootdiv == "annotateobject" || this.rootdiv == 6) {
          
            query["valuesfor"] = "concept";
            //var k = Object.keys(GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures());
            //k = k.length;
            //console.log(k + "lang");
            
            var markedfeatures = Object.keys(GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures()).length;
            if (markedfeatures > 0){
                if(filter == false){
                    GV.HTML.constructTabHeader(["Feature", "Class", "Instance", "Text"]);
                    GV.HTML.constructFeatureList();
                    $("#Feature").addClass("activetab");
                }
                else {
                    GV.HTML.constructTabHeaderFilter(["Feature", "Class", "Instance"]);
                    GV.HTML.constructAllFeaturesList();
                     $("#Featurefilter").addClass("activetab");
                }
            }
            else {
                if(filter == false){
                    GV.HTML.constructTabHeader(["Class", "Instance", "Text"]);
                    GV.Annotate.sendQuery(query, function(result){obj.readValues(result, "example")});
                    $("#Class").addClass("activetab");
                }
                else {
                    GV.HTML.constructTabHeaderFilter(["Feature", "Class", "Instance"]);
                    GV.HTML.constructAllFeaturesList();
                    $("#Featurefilter").addClass("activetab");
                }
            }

            if(filter == false){
                GV.Filter.filterinterface.cancel();
                this.showFlyout();
                this.flyoutPosition(this.origin);
            }
           

            
            
        } else if (this.rootdiv == "annotatesubject" || this.rootdiv == 4) {
            query["valuesfor"] = "instance";
         
            
            var markedfeatures = Object.keys(GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures()).length;
            if (markedfeatures > 0){
                if(!filter){
                    GV.HTML.constructTabHeader(["Feature", "Instance", "Text"]);
                    GV.HTML.constructFeatureList();
                    $("#Feature").addClass("activetab");
                }
                else {
                    GV.HTML.constructTabHeaderFilter(["Feature", "Instance"]);
                    GV.HTML.constructAllFeaturesList();
                    $("#Featurefilter").addClass("activetab");
                }
               
            }
            else {
                if(filter == false){
                    GV.HTML.constructTabHeader(["Instance", "Text"]);
                    GV.Annotate.sendQuery(query, function(result){obj.readValues(result, "example")});
                    $("#Instance").addClass("activetab");

                }
                else {
                    GV.HTML.constructTabHeaderFilter(["Feature", "Instance"]);
                    GV.HTML.constructAllFeaturesList();
                    $("#Featurefilter").addClass("activetab");
                }
            }
            if(filter == false){
                GV.Filter.filterinterface.cancel();
                this.showFlyout();
                this.flyoutPosition(this.origin);
            }
        }
    },

    flyoutPosition: function (rootdiv){

        var topmargin = rootdiv.offset();
        topmargin = topmargin.top;
//        console.log(topmargin);
        $("#annotateflyoutwrapper").css("position", "fixed");
        $("#annotateflyoutwrapper").css("top", "0");

    },

    
    // TODO HTML Generator
    readValues: function (result, type, filter) {
        //reset listElements
        
        this.listElements = [];
       
        
        // Write 2D array
        var arr = result["result"];
        for (var i in arr){
            var pred = arr[i];
            var array = new Array();
            array.push(pred["uri"]);
            array.push(pred["label"]);
            this.listElements.push(array);
        }
        
        if(!filter){
            GV.HTML.constructAnnotationList(type);
            $('#annotateflyout .filterinput').remove();
        }
        else {
            GV.HTML.constructAnnotationList(type, true);
            $('#filtertabcontent .filterinput').remove();

        }
        listFilterAnnotator($(".annotationswrapper"), $("#annotationsearch"));

    
        
    },

    showFlyout: function(){
        $("#annotateflyoutwrapper").show();
        this.flyout = true;
    },

    
    storeValue: function (clickval, uri) {
      
        switch (clickval) {
            // Funktion wird durch Selektion aufgerufen
            case "directuri": 
                this.multipleannotation = false;
                this.origin = $("#annotatesubject");
                this.origin.empty();
                var uri = String(uri);
                var label = uri.substring(uri.indexOf('features/') + 9, uri.length); 
                this.rootdiv = "annotatesubject";
                break;

            case "directuris": 
                this.multipleannotation = true;
                this.origin = $("#annotatesubject");
                this.origin.empty();
                var uri = String(uri);
                var uri = uri.split(",");
                var label = "";
                if(uri.length < 8){
                    for (i = 0; i < uri.length; i++){
                        label += " " + uri[i].substring(uri[i].indexOf('features/') + 9, uri[i].length);
                    }
                }
                else {
                    label = "Feature selection";
                }
                this.rootdiv = "annotatesubject";
                break;    

            case "literal":
                this.origin.empty();
                this.multipleannotation = false;
                var label = uri; // uri enthält eingegebenen text
                break;
                
            // Funktion wird durch Click aufgerufen
            default:
                if (this.rootdiv == "annotatesubject"){
                    this.multipleannotation = false;
                }
                //console.log("userclick");
//                console.log(this.multipleannotation);
                this.index = clickval.index();
                this.origin.empty();
                
                var triplepart;
                var uri = clickval.attr("id");

                // get label depending from data type
                var datatype = "";
                datatype = clickval.attr("data-type");

                if (datatype == "feature"){
                    var label = uri.substring(uri.indexOf('features/') + 9, uri.length); 
                }
                else {
                    var label = getLabelByURI(uri, this.listElements);
                }
        }

        

        if (this.rootdiv == "annotatepredicate") {
            this.predicatevalue = label;
            this.predicateURI = uri;
            triplepart = "Predicate";
        } else if (this.rootdiv == "annotateobject") {
            this.objectvalue = label;
            this.objectURI = uri;
            triplepart = "Object";
        } else {
            this.subjectvalue = label;
            this.subjectURI = uri;
            triplepart = "Subject";
        }

        var newhtml = $("<a class='addannotation'><span class='labelselect'>" + triplepart + "</span>" + label + "</a><span class='icon-dropdown iconfont'></span>");

        this.origin.append(newhtml);

        //check if save button
        if (/*this.setvalue != this.origin && this.setvalue != 0 && */this.predicateURI != "" && this.subjectURI != "" && this.objectURI != "" && this.savebutton == false) {
            this.makeSaveButton();
        }

        this.origin.removeClass("annotateflyout");
        $("#annotateflyout").empty();
        $("#annotateflyoutwrapper").hide();
        $(".annotationbox").removeClass("activebox");
        this.setvalue = this.origin;
        this.flyout = false;

//        console.log(this.predicateURI);
//        console.log(this.objectURI);
//        console.log(this.subjectURI);
       
    },

    successMessage: function () {

        var successmessage = $("<p class='success'>Annotations saved</p>");
        successmessage.appendTo("#annotator");
        setTimeout(function(){ 
            $("#annotator .success").remove(); }
        , 3000);

    },

    checkSaveButton: function (){
        //check if save button
        if (this.subjectURI == "") {
            this.removeSaveButton();
        }
    },

    // Löscht Save Button 
    removeSaveButton: function () {
        this.savebutton = false;
        $("#savebutton").remove();
    },


    
    // Fügt Save Button hinzu
    makeSaveButton: function () {
        this.savebutton = true;
        var savebuttonhtml = $("<a id='savebutton'>Save</a>");
        savebuttonhtml.insertBefore("#annotateflyoutwrapper");
        //$("#annotator").append(savebuttonhtml);
    },
    
    // Setzt alles zurück
    restart: function () {

        this.predicateURI = "";
        this.objectURI = "";
        this.subjectURI = "";

        $("#savebutton").remove();
        this.savebutton = false;
        $(".annotationbox").html("");
        $("#annotatesubject").append("<a class='addannotation'><span class='labelselect'>Subject</span></a><span class='icon-dropdown iconfont'></span>");
        $("#annotatepredicate").append("<a class='addannotation'><span class='labelselect'>Predicate</span></a><span class='icon-dropdown iconfont'></span>");
        $("#annotateobject").append("<a class='addannotation'><span class='labelselect'>Object</span></a><span class='icon-dropdown iconfont'></span>");
        
    },
    
    // Schreibt fertige Annotation in Objekt (json) und schickt es an Server.
    makeAnnotation: function () {
        if (this.multipleannotation == false){
        var triple = {};
        triple["subject"] = this.subjectURI;
        triple["predicate"] = this.predicateURI;
        triple["object"] = this.objectURI;      
        GV.Annotate.sendAnnotation(triple);
//        console.log(triple);
        this.setvalue = 0;
        this.restart();
    }
        else {
//            console.log("multipleannotation");
            for (i = 0; i < this.subjectURI.length; i++){
                var triple = {};
                triple["subject"] = this.subjectURI[i];
                triple["predicate"] = this.predicateURI;
                triple["object"] = this.objectURI;      
                GV.Annotate.sendAnnotation(triple);
//                console.log(triple);
            }
            this.setvalue = 0;
            this.restart();
        }
    }
};

/**
 * Send triple as json to annotation url.
 * 
 * @param {type} triple triple as json
 * @returns {undefined}
 */
GV.Annotate.sendAnnotation = function (triple) {
    var jsonAsString = JSON.stringify(triple);
    $.ajax({
        beforeSend: function (req) {
            req.setRequestHeader("Content-Type", "text/plain");
        },
        type: 'POST',
        url: GV.Annotate.AnnotationURL,
        data: {json: jsonAsString},
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        },
        success: function (answer) {
//            console.log(answer);
            GV.Annotate.annotationinterface.successMessage();
        }
    });
}

/** TODO: sollte mit GV.Filter.getJSON ersetzt werden können!? **/
GV.Annotate.sendQuery = function (query, callback) {
    var jsonAsString = JSON.stringify(query);
    $.ajax({
        beforeSend: function (req) {
            req.setRequestHeader("Content-Type", "text/plain");
        },
        type: 'POST',
        url: GV.Filter.URL(),
        data: {json: jsonAsString},
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        },
        success: function (result) {
            try {
                result = JSON.parse(result);
            } catch (e) {
                alert("Error on parsing JSON (annotate.js). ")
            }
            callback(result);
        }
    });
}



// index of multidimensional array
function getLabelByURI(id, matrix) {
  for (var i=0; i<matrix.length; i++) {
    if (matrix[i][0] == id){
        return matrix[i][1];
    }
  }
  return -1;
}



//Dynamic Event Handlers
// auf Document

$(document).on("click", '.annotationlist', function (e) {
    GV.Annotate.annotationinterface.storeValue($(this));
    //sendJSON(jsonTest);
});

$(document).on("click", '.addannotation', function (e) {
    GV.Annotate.annotationinterface.makeFlyout(false, $(this));
    //sendJSON(jsonTest);
});

$(document).on("click", '#savebutton', function (e) {
    GV.Annotate.annotationinterface.makeAnnotation();
    //sendJSON(jsonTest);
});

$(document).on("click", '#Feature', function (e) {
    $(".tabnavigation a").removeClass("activetab");
    $(this).addClass("activetab");
    GV.HTML.constructFeatureList();
});

$(document).on("click", '#Text', function (e) {
    $(".tabnavigation a").removeClass("activetab");
    $(this).addClass("activetab");
    GV.HTML.constructTextBox();
});

$(document).on("click", '#Instance', function (e) {
    $(".tabnavigation a").removeClass("activetab");
    $(this).addClass("activetab");
    var query = {};
    query["valuesfor"] = "instance";
    GV.Annotate.sendQuery(query, function(result){GV.Annotate.annotationinterface.readValues(result, "example")});

});

$(document).on("click", '#Class', function (e) {
    $(".tabnavigation a").removeClass("activetab");
    $(this).addClass("activetab");
    var query = {};
    query["valuesfor"] = "concept";
    GV.Annotate.sendQuery(query, function(result){GV.Annotate.annotationinterface.readValues(result, "predicate")});
});

$(document).on("click", '#textsend', function (e) {
    var literal = $("#textbox").val();
    GV.Annotate.annotationinterface.storeValue("literal", literal);
    
});