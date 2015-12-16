GV.Filter = GV.Filter || {};

GV.Filter.listFilterInstances = []; // aktive filter
GV.Filter.filtertypes = ["id", "vp", "creator", "type", "subject", "predicate", "object", "sparql", "selection"]; // TODO alles ergänzen, wonach gefiltert werden kann
var filtervalues = []; // possible values for a filtertype // TODO werte aus json lesen statt liste
var navigationmapvisible = true;

GV.Filter.tablecolumnscategories = ["vp", "creator", "lastedit", "type", "img", // possible column headers SS
    "subLabel", "predLabel", "objLabel", "subType", "objType", "subNote", "objNote"]; // possible column headers TS
GV.Filter.tablecolumnsinactive = GV.Filter.tablecolumnscategories;    
GV.Filter.tablecolumns = []; // aktive spalten (instanzen von GV.Filter.Tablecolumn)
var tblheaders = []; // namen aktiver spalten

GV.Filter.tablecontent = [];
var columnsizesdef = [['columnid',110],['id',110],['predLabel',300],['objLabel',300],['subLabel',300],['creator',300],['img',133],['lastedit',300],['type',300],['subType',100],['type',300],['subNote',300],['vp',300],['objType',300],['objNote',300]];
var columnsizes = [];
var expandedheight = false;

GV.Filter.URL = function () {
    if (!GV.setting.spatialstore.getSpatialcontext() || GV.setting.spatialstore.getSpatialcontext() === 'undefined') {
        return false;
    } else {
        return GV.setting.spatialstore.getSpatialcontext().getID() + "/filter";
    }
};

/**
 * sends inputJSON to GV.Filter.URL and 
 * calls callback function with response JSON 
 */
GV.Filter.getJSON = function (inputJSON, callback, htmltype, position) {
    var url = GV.Filter.URL();
    if (!url) {
        setTimeout(function(){GV.Filter.getJSON(inputJSON, callback, htmltype, position);}, 1000);
    } else {
        var jsonAsString = JSON.stringify(inputJSON);
        $.ajax({
            beforeSend: function (req) {
                req.setRequestHeader("Content-Type", "text/plain");
            },
            type: 'POST',
            url: url,
            data: {json: jsonAsString},
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            },
            success: function (json) {
                try {
                    json = JSON.parse(json);
                } catch (e) {
                    alert("Error on parsing JSON (filter.js).");
                }
                callback(json, htmltype, position);
                GV.Filter.tableCleanup();
                GV.Filter.setTableWidth(); 
            }
        });
    }
}

GV.Filter.getValuesFor = function (filtertype) {
    // JSON bauen um Werte dafür abzufragen:
    var json = JSON.parse('{ "valuesfor":"' + filtertype + '"}');
    return GV.Filter.getJSON(json, GV.Filter.setValuesFor);
};

GV.Filter.setValuesFor = function (json) {

    var values = json["valuesfor"];
    console.log(json);
    filtervalues = [];
    $.each(values, function (index, val) {
        $.each(val, function (k, v) {
            filtervalues.push(v);
        });
    });
    GV.HTML.constructFlyout("nochntest", "interfacelist", "interfacecontainer", filtervalues);
    listFilter($("#nochntest ul"));
    $(".filterinput").focus();
};

GV.Filter.checkQuery = function (query) {
    $.ajax({
       beforeSend: function (req) {
           req.setRequestHeader("Content-Type", "text/plain");
       },
       type: 'POST',
       url: GV.Config.spatialstoreURL + "query",
       data: {query: query},
       error: function (jqXHR, textStatus, errorThrown) {
           alert("SPARQL-Query überprüfen!");
       },
       success: function() {
           GV.Filter.filterinterface.manage(query);
           $("#sparqltabflyout").remove();
       }
    });
    
}



var sortdirection = 1; // -1 = aufsteigend (a-z)
/** sorts the 2dim array arr by the values in the column col */
GV.Filter.sortContent = function (sortIndex) {
    if (typeof lastSortIndex === 'undefined' || lastSortIndex === sortIndex) {
        lastSortIndex = sortIndex;
        sortdirection *= -1;
    } else {
        lastSortIndex = sortIndex;
        sortdirection = -1;
    }

    return GV.Filter.tablecontent.sort(function (a, b) {
        return (a[sortIndex] < b[sortIndex] ? sortdirection : (a[sortIndex] > b[sortIndex] ? -sortdirection : 0));
    });
}

GV.Filter.updateTable = function () {
    var headers = [];
    for (var c in GV.Filter.tablecolumns) {
        headers.push(GV.Filter.tablecolumns[c].getCategory());
    }
    //var filterqueryjson = GV.Filter.buildFilterQueryJSON();
    var filterqueryjson = {"properties": headers};
    filterqueryjson["filter"] = GV.Filter.getFilterArray();

    GV.Filter.getJSON(filterqueryjson, GV.HTML.generate, GV.HTML.table, $('#table'));

}

GV.Filter.getFilterArray = function () {
    // build and return the json for the filter query
    // use selected filters and properties
    var filterArray = [];
    $.each(GV.Filter.listFilterInstances, function (index, f) {
        var obj = {};
        obj[f.getType()] = f.getKeyword();
        filterArray.push(obj);
    });
    //var filterarrayexample = [{"creator": "alexmue90@gmail.com"}, {"creator": "steffen.schneider90@gmail.com"}, {"type": "POLYGON"}];
    return filterArray;
}



// GV.filterinterface steuert den Prozess der Filterauswahl
GV.Filter.filterinterface = {
    state: 0,
    filtertype: "?",
    filteroption: "?",
    clickvalue: "",
    filterid: 1,
    manage: function (clickvalue) {
        if (typeof clickvalue == 'string' && clickvalue.startsWith('SELECT')) {
            index = 'sparql';
        } else {
            this.clickvalue = clickvalue;
            index = clickvalue.parent().index();
        }

        switch (this.state) {

            case 0:
                this.state = 1;
                $("#annotateflyoutwrapper").hide();
                $(".activebox").removeClass("activebox");
                $(".interfacecontainerwrapper").removeClass("emptyheight");
                this.createFilterSelect();
                GV.Annotate.annotationinterface.flyout = false;
                break;
            case 1:
                this.filtertype = index;
                if(index < 4){
                    this.createFilterOptions();
                    this.state = 2;
                }
                else if(index == 7){ // sparql
                    console.log("sparql");
                    this.createSparqlTabDiv();
                    this.state = 2;
                } else if(index == 8){ // selected features
                    this.state = 2;
                    GV.Filter.filterinterface.manage(clickvalue);
                }
                else {
                    this.createFilterTabDiv();
                    GV.Annotate.annotationinterface.rootdiv = index;
                    GV.Annotate.annotationinterface.makeFlyout(true);
                }
                break;
            case 2:
                var newfilter;
                if (index === 'sparql') {
                    newfilter = new GV.Filter.filterClass(this.filterid, GV.Filter.filtertypes[this.filtertype], clickvalue);
                } else if (index == 8) { // selected features
                    var selectedFeatureIDs = [];
                    var selectedFeatures = GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures();

                    Object.keys(selectedFeatures).forEach(function (key) {
                        selectedFeatureIDs.push(selectedFeatures[key].getName());
                    });

                    newfilter = new GV.Filter.filterClass(this.filterid, GV.Filter.filtertypes[this.filtertype], selectedFeatureIDs);
                }
                else {
                    this.filteroption = index;
                    //console.log(this.filteroption);
                     newfilter = new GV.Filter.filterClass(this.filterid, GV.Filter.filtertypes[this.filtertype], filtervalues[this.filteroption]);

                }
                GV.Filter.listFilterInstances.push(newfilter);
                newfilter.addFrontendFilter();
                this.reset();
                GV.Filter.updateTable();
        }
    },
    createFilterSelect: function () {
        this.clickvalue.remove();
        GV.HTML.constructFlyout("nochntest", "interfacelist", "interfacecontainer", GV.Filter.filtertypes);
        listFilter($("#nochntest ul"));
        //var closetabhtml = "<a id='closeflyout'>x</a>";
        //$(closetabhtml).prependTo(".interfacecontainerwrapper");
        $(".nano").nanoScroller();
    },
    createFilterTabDiv: function(){
        if ($("#filtertabflyout").length == 0){
            var FilterTabDivHtml = "<div id='filtertabflyout' class='nano'><div id='filtertabcontent' class='nano-content'></div></div>";
            FilterTabDivHtml = $(FilterTabDivHtml);
            FilterTabDivHtml.appendTo("#controls");
            $(".nano").nanoScroller();
        }
    },
    createSparqlTabDiv: function(){
            var SparqlTabDivHtml = "<div id='sparqltabflyout' class='nano'><div id='filtertabcontent' class='nano-content'><p>SELECT ?feature WHERE {</p><textarea id='sparqlquery'>?feature ?predicate ?object. </textarea><p>}</p><span id='sparqlsend'>Send Sparql</span></div></div>";
            SparqlTabDivHtml = $(SparqlTabDivHtml);
            SparqlTabDivHtml.appendTo("#controls");
            $(".nano").nanoScroller();

    },
    createFilterOptions: function () {
        var filterboxdiv = this.clickvalue.closest(".filterdiv");
        this.clickvalue.closest('div').remove();
        filtervalues = GV.Filter.getValuesFor(GV.Filter.filtertypes[this.filtertype]);
        $(".nano").nanoScroller();
    },
    executeTabFilter: function (uri, text){
        var newfilter = new GV.Filter.filterClass(this.filterid, GV.Filter.filtertypes[this.filtertype], uri);
        GV.Filter.listFilterInstances.push(newfilter);
        newfilter.addFrontendFilter(text);
        this.reset();
        GV.Filter.updateTable();
        $("#filtertabflyout").remove();
    },
    removeEmptyBoxes: function (){
        $(".frontendfiltertype").each(function(){
            if ($(this).is(':empty')){
                remove($(this));
            }
        })
    },
    reset: function () {
        this.filterid++;
        this.state = 0;
        $(".interfacecontainerwrapper").remove();
        var interfacehtml = $("<div class='interfacecontainerwrapper nano emptyheight'><div class='interfacecontainer nano-content'><a class='plus2' href='#'><span class='labelselect'>Add Filter</span>+</a></div></div>");
        interfacehtml.prependTo($("#controls"));
    },
    cancel: function (){
        this.state = 0;
        $(".interfacecontainerwrapper").remove();
        var interfacehtml = $("<div class='interfacecontainerwrapper nano emptyheight'><div class='interfacecontainer nano-content'><a class='plus2' href='#'><span class='labelselect'>Add Filter</span>+</a></div></div>");
        interfacehtml.prependTo($("#controls"));
        $("#filtertabflyout").remove();
        

    }
}




//GV.tableinterface steuert die Eingaben / Clicks bei der Tabelle
GV.Filter.TableInterface = {
    selectedrow: 0,
    divmouseover: "",
    olddivtext: "",
    dragging: false,
    parentwidth: 0,
    oldoffset: 0,
    sorting: 0,
    columnid: 0,
    initIdColumn: function () {
        var column = new GV.Filter.Tablecolumn(this.columnid, "id");
        this.columnid++;

        GV.Filter.tablecolumns.push(column);
    },
    showOptions: function (divmouseover) {
        if (this.dragging == false){
            console.log("show normal options");
            this.divmouseover = divmouseover;
            this.olddivtext = this.divmouseover.text();
            this.divmouseover.text("");
            this.divmouseover.css("color", "black");
            this.divmouseover.css("background", " #FFFDBF");
            this.divmouseover.append("<a class='columnoptions sortcolumn' href='#'><span class='icon-colsort iconfont'></span></a><span class='icon-colsize iconfont draggable'></span><a class='columnoptions deletecolumn' href='#'><span class='icon-close iconfont'></span></a>");
        }
        $( ".draggable" ).draggable({
              start: function() {
                GV.Filter.TableInterface.dragging = true;
                this.parentwidth = $(this).parent().width();
                this.oldoffset = $(this).offset().left;
                 $(this).css("height", "1000px");

              },
              drag: function() {
                $(this).css("height", "1000px");
                
              },
              stop: function() {
              
                GV.Filter.TableInterface.dragging = false;
                this.newoffset = $(this).offset().left;
                var mousedistance = this.oldoffset - this.newoffset;

                this.parentwidth = this.parentwidth - mousedistance;  
                
                var parentclass = $(this).parent().attr('class').split(' ')[0];
                
                $("." + parentclass).css("width", this.parentwidth);
                for (i=0; i<columnsizesdef.length; i++){
                    if (columnsizesdef[i][0] == parentclass){
                        columnsizesdef[i][1] = this.parentwidth;
                    }
                }

                GV.Filter.calculatetablewidth();
                
                var dataoriginallength = 0;

                
                $("." + parentclass).each(function(){
                    if($(this).attr("data-original")){
                        var dataoriginal = $(this).attr("data-original");
                        if (dataoriginal.length > dataoriginallength)
                            { dataoriginallength = $(this).attr("data-original").length};
                        var width = $(this).width();
                        var charlength = width / 9;
                       
                       
                        if (dataoriginal.indexOf('http') != -1) {
                            var linkhtml = "<a class='tablelink' target='_blank' href='" + dataoriginal + "'><span class='icon-link iconfont'></span></a>";
                            if (dataoriginallength <= charlength){
                               $(this).html($(this).attr("data-original").substring(0, charlength)); 
                            }
                            else {
                               $(this).html($(this).attr("data-original").substring(0, charlength) + "..."); 
                            }
                            
                            $(this).append(linkhtml);
                        }

                        else {
                            if (dataoriginallength <= charlength){
                               $(this).html($(this).attr("data-original").substring(0, charlength)); 
                            }
                            else {
                               $(this).html($(this).attr("data-original").substring(0, charlength) + "..."); 
                            }
                        }
                    }
                });
                    
             
                GV.Filter.TableInterface.restoreDivText();
               

              },
              axis: "x"
        });
    },
    showOptionsWithoutDelete: function (divmouseover) {
        if (this.dragging == false){    
            this.divmouseover = divmouseover;
            this.olddivtext = this.divmouseover.text();
            this.divmouseover.text("");
            this.divmouseover.css("color", "black");
            this.divmouseover.css("background", " #FFFDBF");
            this.divmouseover.html("<a class='columnoptions sortcolumn' href='#'><span class='icon-colsort iconfont'></span></a><a class='columnoptions idtop' href='#'><span class='icon-markedtop iconfont'></span></a>");
            console.log("nur eine option eingeblendet");
        }
    },
    showCategories: function () {

        $('.plus').text("");
        GV.HTML.constructFlyout("4534", "tablecategorylist", "pluscontainer", GV.Filter.tablecolumnscategories);
        this.reduceCategories();
    },
    reduceCategories: function (){
        $('.tablecategorylist li a').each(function(){
            if (tblheaders.indexOf($(this).text()) != -1){
                var content = $(this).text();
                $(this).css("color", "red");
                $(this).replaceWith("<span class='inactiveoption'>" + content + "</span>");
            }
        })
    },
    restoreDivText: function () {
        console.log(this.dragging);
        if(this.dragging == false){
            this.divmouseover.css("background", "#E6E6E6");
            this.divmouseover.text(this.olddivtext);
            this.divmouseover.append("<span class='icon-dropdown iconfont'></span>");
        }

    },
    storeSorting: function (clickvalue) {

        clickindex = (clickvalue.closest("div").index());
        GV.Filter.sortContent(clickindex - 1);
        GV.HTML.generate(GV.Filter.tablecontent, GV.HTML.arrayToTable, $('#table'));
        GV.Filter.tableCleanup();

        this.sorting = GV.Filter.tablecolumns[clickindex - 1];
        console.log("Sortiert nach " + this.sorting.getCategory());
    },
    addColumn: function (clickvalue) {

        var clickindex = clickvalue.parent().index();
        var selectedcolumn = GV.Filter.tablecolumnscategories[clickindex];
        var column = new GV.Filter.Tablecolumn(this.columnid, selectedcolumn);
        this.columnid++;

        GV.Filter.tablecolumns.push(column);
        clickvalue.closest('div').remove();
        $('.plus').text("+");

        this.reload();
    },
    removeColumn: function (clickvalue) {

        var clickindex = (clickvalue.closest("div").index() - 1);
        console.log(clickindex);
        GV.Filter.tablecolumns.splice(clickindex, 1);
        $('.tablecategorylist').remove();
        this.reload();
    },
    reload: function () {

        var temp = "";
        for (var i = 0; i < GV.Filter.tablecolumns.length; i++) {
            temp += GV.Filter.tablecolumns[i].getCategory() + ",";
        }

        console.log(GV.Filter.tablecolumns);
        console.log(temp);
        console.log("Sortiert nach Spalte" + this.sorting);
        $("#table").empty();

        //Tabelle neu aufbauen
        GV.Filter.updateTable();

    }
}



GV.Filter.filterDelete = function (deletethis) {

    var deletethis = deletethis.substr(6, 7);

    for (i = 0; i < GV.Filter.listFilterInstances.length; i++) {
        var getid = GV.Filter.listFilterInstances[i].getId();
        if (getid == deletethis) {
            GV.Filter.listFilterInstances.splice(i, 1);
        }
    }

    GV.Filter.updateTable();
    $('#filter' + deletethis).remove();
    //GV.Filter.filterinterface.removeEmptyBoxes();
    $(".frontendfiltertype").each(function () {
        if ($(this).children().length == 1) {
            $(this).remove();
        }
    })
}

GV.Filter.tableCleanup = function(){

    //img Spalte -> expandedheight
    if (expandedheight == true){
         $(".row div").each(function(){
            if(!$(this).parent().hasClass("header")){
                $(this).css("height", "130px");
            }
        });
    }

    GV.Filter.calculatetablewidth();

   

    for (var i=0; i<columnsizesdef.length; i++){
        $('.' + columnsizesdef[i][0]).css("width", columnsizesdef[i][1]);
    }

    $('.row[data-id=""]').find("span").remove();
   

    if(tblheaders.indexOf("img") != -1){
        $(".row div").each(function(){
            if(!$(this).parent().hasClass("header")){
                $(this).css("height", "130px");
            }
        });
    }


     $('.row div').each(function() {
        var width = $(this).width();
        var content = $(this).text();


        var charlength = width / 9;
        if(!$(this).hasClass("link") && !$(this).parent().hasClass("header")){
            $(this).attr("data-original", content);
        }
        if (content.indexOf('http') != -1) {
           //console.log("has link");
           var linkhtml = "<a class='tablelink' target='_blank' href='" + content + "'><span class='icon-link iconfont'></span></a>";
           content = content.substring(0, charlength) + "..."; 
           $(this).text(content);
           $(this).css("color", "gray");
           $(linkhtml).appendTo($(this));
           //console.log("link gesetzt");
        }  
        
        else if(content.length > charlength) {
            content = content.substring(0, charlength) + "..."; 
            $(this).text(content);
        }
        
        
 
    });    
}

GV.Filter.calculatetablewidth = function(){
     var tablewidth = 0;
   
    for (var i=0; i<tblheaders.length; i++){
        for (var j=0; j<columnsizesdef.length; j++){
            if (tblheaders[i] == columnsizesdef[j][0]){
                tablewidth += columnsizesdef[j][1];
            }
        }
    }

    $('#table').css("width", tablewidth + 200);
    $('.headerwrapper').css("width", tablewidth + 200);

}







GV.Filter.filterClass = function (filterid, filtertype, keyword) {
    this.filterExe = function () {

    }

    this.addFrontendFilter = function (text) {
        if(!text){
            var frontendfilterhtml = $("<div id=" + 'filter' + filterid + " class='frontendfilter filterbox'><p class='filtertype'>" + filtertype + "</p><p>" + keyword + "</p><span class='icon-deletefilter iconfont'></span>");
        }
        else {
            var frontendfilterhtml = $("<div id=" + 'filter' + filterid + " class='frontendfilter filterbox'><p class='filtertype'>" + filtertype + "</p><p>" + text + "</p><span class='icon-deletefilter iconfont'></span>");
        }
        var frontendfilterinstances = [];
        var frontendfiltertypes = [];



        frontendfilterhtml.appendTo($('#controls'));
        $(".frontendfilter p.filtertype").each(function () {
            frontendfilterinstances.push($(this).text());
        })
        console.log(frontendfilterinstances);
        for (i = 0; i < frontendfilterinstances.length; i++) {
            if (frontendfiltertypes.indexOf(frontendfilterinstances[i]) == -1) {
                frontendfiltertypes.push(frontendfilterinstances[i]);
            }
        }
        var categoryhtml = "";
        for (i = 0; i < frontendfiltertypes.length; i++) {
            if ($("#frontendfiltertype" + frontendfiltertypes[i]).length < 1) {
                categoryhtml += "<div class='frontendfiltertype' id='frontendfiltertype" + frontendfiltertypes[i] + "'><h3>" + frontendfiltertypes[i] + "</h3></div>";
            }
        }

        $(categoryhtml).appendTo("#controls");

        for (i = 0; i < frontendfiltertypes.length; i++) {

            var f = $(".frontendfilter p.filtertype").filter(function () {
                return $(this).text() === frontendfiltertypes[i];
            });

            f.closest("div").prependTo($("#frontendfiltertype" + frontendfiltertypes[i]));
        }

    }

    this.getAmount = function () {
        return GV.Filter.listFilterInstances.length;
    }

    this.getId = function () {
        return filterid;
    }

    this.getType = function () {
        return filtertype;
    }

    this.getKeyword = function () {
        return keyword;
    }
}

GV.Filter.setTableWidth = function(){
 
    if(navigationmapvisible == false){
       $(".pluscontainer").css("margin-right", "0");
   } 
   else {
       $(".pluscontainer").css("margin-right", "450px");
       var calctablewidth = $(window).width() - 390;
      
   }
   GV.setting.setTab();

}




GV.Filter.Tablecolumn = function (id, category) {

    this.getCategory = function () {
        return category;
    }

    this.getId = function () {
        return id;
    }
}


GV.Filter.markSelectedFeatures = function () {
    $(".row").removeClass("selectedrow");
    // Mark Selection in Table
    Object.keys(GV.setting.spatialstore.getSpatialcontext().getSelectedFeatures()).forEach(function (key) {

        var rowattributes = $(".row[data-id=" + key.substring(key.indexOf('features/') + 9, key.length) + "]");
        rowattributes.addClass("selectedrow");
    });
}


//Dynamic Event Handlers auf Document
$(document).on("click", '.interfacecontainer a', function (e) {
    GV.Filter.filterinterface.manage($(this));
});

$(document).on("click", '.filterbox', function (e) {
    GV.Filter.filterDelete($(this).attr('id'));
});


// Event Listener
var textOverwritten = false;
$(document).on("mouseenter", 'div.header div', function (e) {
    console.log($(this) + "enter");
    
    if(textOverwritten == false){
        if ($(this).hasClass("columnid")) {
            GV.Filter.TableInterface.showOptionsWithoutDelete($(this));
            textOverwritten = true;
        }

        else if ($(this).hasClass("noflyout")) {
            return false;
        }

        else if (tblheaders.indexOf($(this).attr("class")) != -1) {
            GV.Filter.TableInterface.showOptions($(this));
            textOverwritten = true;
        }
    }
    

});

$(document).on("mouseleave", 'div.header div', function (e) {
    GV.Filter.TableInterface.restoreDivText();
    textOverwritten = false; 
});



$(document).on("click", '.deletecolumn', function (e) {
    GV.Filter.TableInterface.removeColumn($(this));
});

$(document).on("click", '.change', function (e) {
    $(".activebox").removeClass("activebox");
      $(".oldflyoutwrapper").hide();
    $(this).next().next("div").show();
    $(".nano").nanoScroller();
    $(this).closest(".mapselect").addClass("activebox");
});

$(document).on("click", '.mapselect .labelselect', function (e) {
    $(".activebox").removeClass("activebox");
    $(".oldflyoutwrapper").hide();
    $(this).next().next().next("div").show();
    $(".nano").nanoScroller();
    $(this).closest(".mapselect").addClass("activebox");
});

$(document).on("click", '.oldflyoutwrapper a', function (e) {
    $(this).closest(".oldflyoutwrapper").hide();
    $(".activebox").removeClass("activebox");
});

$(document).on("click", '.sortcolumn', function (e) {
    GV.Filter.TableInterface.storeSorting($(this));
});


/*
$(document).on("click", '.mark', function (e) {
    
    if($(this).parent().hasClass("selectedrow")){
        $(this).parent().insertAfter(".header");
        $(".row").removeClass("first");
        $(this).parent().addClass("first");
        var thisid = $(this).parent().attr("data-id");
        $(".row[data-id=" + thisid + "]").insertAfter(".header");
        console.log($(".row[data-id=" + thisid + "]").length);
        $(".row div").removeClass("rowmarker");
        $(".row div").removeClass("idhighlight");
        $(".selectedrow").insertAfter(".header");
        $(".columnid").css("font-weight", "400");
        $(document).scrollTop(0);
    }

});

*/

$(document).on("click", '.idtop', function (e) {
        if($(".selectedrow").length){    
            $(".selectedrow").insertBefore(".first");
            $(".row").removeClass("first");
            $(".selectedrow").eq(0).addClass("first")
            $(".columnid").css("font-weight", "400");
            $(document).scrollTop(0);
        }
});

$(document).on("click", '#hidesidebar', function (e) {
    if(navigationmapvisible == true){
       $("#hidesidebar").html("<span class='icon-showsidebar iconfont'></span>");
       $("#hidesidebar").addClass("nosidebar");
       $("#tablewrapper").addClass("fullscreen");
       $(this).css("border", "0");
       navigationmapvisible = false;
    } 
    else {
       $("#hidesidebar").html("<span class='icon-close iconfont'></span>");
        $("#hidesidebar").removeClass("nosidebar");
       $("#tablewrapper").removeClass("fullscreen");
        $(this).css("border-bottom", "1px solid #cacaca");
       navigationmapvisible = true;
    }
    GV.Filter.setTableWidth(); 
});

$(document).on("click", '.pluscontainer .plus', function (e) {
    GV.Filter.TableInterface.showCategories();
});

$(document).on("click", '.biggercolumn', function (e) {
    var parentwidth = $(this).parent().width();
    var parentclass = $(this).parent().attr('class').split(' ')[0];
    console.log(parentclass);
   
    var dataoriginallength = 0;
    $(".row div").each(function(){
        if($(this).attr("data-original") && !$(this).hasClass("columnid")){
            var dataoriginal = $(this).attr("data-original");
            if (dataoriginal.length > dataoriginallength)
                { dataoriginallength = $(this).attr("data-original").length};
            $(this).text($(this).attr("data-original"));
        }
    });

    $(".row div").each(function(){
            if(!$(this).parent().hasClass("header")){
                $(this).css("height", "130px");
            }
        });
    expandedheight = true;


    $( ".biggercolumn" ).replaceWith( "<h2>New heading</h2>" );
    //var colsize = dataoriginallength * 9;
    // $("." + parentclass).css("width", colsize);
});


$(document).on("click", '.tablecategorylist a', function (e) {
    GV.Filter.TableInterface.addColumn($(this));
});

$(document).on("click", '.tabfilterlist', function (e) {
   GV.Filter.filterinterface.executeTabFilter($(this).attr("id"), $(this).text());
});


$(document).on("click", '#Featurefilter', function (e) {
    $(".tabnavigation a").removeClass("activetab");
    $(this).addClass("activetab");
    GV.HTML.constructAllFeaturesList();
});

$(document).on("click", '#Instancefilter', function (e) {
    $(".tabnavigation a").removeClass("activetab");
    $(this).addClass("activetab");
    var query = {};
    query["valuesfor"] = "instance";
    GV.Annotate.sendQuery(query, function(result){GV.Annotate.annotationinterface.readValues(result, "example", true)});

});

$(document).on("click", '#Classfilter', function (e) {
    $(".tabnavigation a").removeClass("activetab");
    $(this).addClass("activetab");
    var query = {};
    query["valuesfor"] = "concept";
    GV.Annotate.sendQuery(query, function(result){GV.Annotate.annotationinterface.readValues(result, "predicate", true)});
});

$(document).on("click", '#closeflyout', function (e) {
    
    GV.Filter.filterinterface.cancel();   
    $("#annotateflyoutwrapper").hide();      
    $("#sparqltabflyout").remove();    
    GV.Annotate.annotationinterface.flyout = false;
    $(".activebox").removeClass("activebox");

    
});

$(document).on("click", '#sparqlsend', function (e) {
    var query = "SELECT ?feature WHERE {" + document.getElementById('sparqlquery').value + "}";
    GV.Filter.checkQuery(query);
});

GV.Filter.TableInterface.initIdColumn();


var lastPos = 0;


function fixheader(){
    
   
   
    var currPos = $('#tablewrapper').scrollLeft();
    console.log(lastPos + currPos);

    if (lastPos != currPos) {
        $('.headerwrapper').removeClass('fixed');
        $('.headerwrapper').css('margin-left', 0);
        $('.headerwrapper').css('width', $("#table").width());
        $('.headerwrapper').css('margin-top', $('#tablewrapper').scrollTop());
    } 
    else {
        $('.headerwrapper').addClass('fixed'); 
        $('.headerwrapper').css('width', $("#tablewrapper").width() + currPos - 16);
        $('.headerwrapper').css('overflow', 'scroll');
        $('.headerwrapper').css('margin-top', 0);
        $('.headerwrapper').css('margin-left', -1 * currPos);
    }
   

    lastPos = currPos;

}


