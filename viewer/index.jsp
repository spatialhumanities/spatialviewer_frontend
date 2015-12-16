<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
		
        <!-- meta information -->
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta http-equiv="Last-Modified" content="Wed, 04 Mar 2015 12:50:01 GMT"/>
        <title>Spatial Viewer</title>

        <!-- css -->
        <link href="css/iconfont.css" rel="stylesheet" type="text/css"/>
        <link href="css/gvstyle.css" rel="stylesheet" type="text/css"/>
        <link href="css/nanoscroller.css" rel="stylesheet" type="text/css"/>
        <link href="css/jquery-filestyle.css" rel="stylesheet" type="text/css"/>

        <!-- media Queries css -->
        <link rel='stylesheet' media='screen and (min-width: 401px) and (max-width: 1400px)' href='css/medium.css' />

        <!-- google fonts -->
       <link href='http://fonts.googleapis.com/css?family=Roboto:400,100italic,100,300,300italic,400italic,500,500italic,700,700italic,900italic,900' rel='stylesheet' type='text/css'>
     

        <!-- external javascript libraries -->
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
        <script type="text/javascript" src="http://code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
        <script type="text/javascript" src="http://softwaremaniacs.org/playground/showdown-highlight/showdown.js"></script>

      

        <!-- generic viewer javascript -->
        <script type="text/javascript" src="init.js"></script>
        <script type="text/javascript" src="setting.js"></script>
        <script type="text/javascript" src="communicator.js"></script>
        <script type="text/javascript" src="math.js"></script>
        <script type="text/javascript" src="filter/filter.js"></script>
        <script type="text/javascript" src="filter/filterInitial.js"></script>
        <script type="text/javascript" src="filter/htmlGenerator.js"></script>
        <!--script type="text/javascript" src="annotationstore/annotationstore.js"></script> <!-- -->
        <!--script type="text/javascript" src="annotationstore/collection.js"></script> <!-- -->
        <!--script type="text/javascript" src="annotationstore/resource.js"></script> <!-- -->
        <script type="text/javascript" src="annotate/annotate.js"></script>
        <!--script type="text/javascript" src="triplestore/createTriple.js"></script> <!-- -->
        <script type="text/javascript" src="report/exportReport.js"></script>
        <script type="text/javascript" src="floorplan/floorplan.js"></script>
        <script type="text/javascript" src="floorplan/floorplanpoint.js"></script>
        <script type="text/javascript" src="floorplan/tooltip.js"></script>
        <script type="text/javascript" src="viewer/viewer.js"></script>
        <script type="text/javascript" src="viewer/shader.js"></script>
        <script type="text/javascript" src="viewer/panorama.js"></script>
        <script type="text/javascript" src="viewer/imagepyramid.js"></script>
        <script type="text/javascript" src="viewer/polygons.js"></script>
        <script type="text/javascript" src="draw/utils.js"></script>
        <script type="text/javascript" src="draw/colors.js"></script>
        <script type="text/javascript" src="draw/geometry.js"></script>
        <script type="text/javascript" src="draw/line.js"></script>
        <script type="text/javascript" src="draw/measurement.js"></script>
        <script type="text/javascript" src="draw/sphere.js"></script>
        <script type="text/javascript" src="draw/triangle.js"></script>
        <script type="text/javascript" src="spatialstore/config.js"></script>
        <script type="text/javascript" src="spatialstore/spatialstore.js"></script>
        <script type="text/javascript" src="spatialstore/spatialcontext.js"></script>
        <script type="text/javascript" src="spatialstore/floorplanmedia.js"></script>
        <script type="text/javascript" src="spatialstore/feature.js"></script>
        <script type="text/javascript" src="spatialstore/viewpoint.js"></script>
        <script type="text/javascript" src="spatialstore/panorama.js"></script>
        <script type="text/javascript" src="gui/lists.js"></script>
        <script type="text/javascript" src="gui/buttons.js"></script>
        <script type="text/javascript" src="gui/togglemenu.js"></script>
        <script type="text/javascript" src="gui/listfilter.js"></script>
        <script type="text/javascript" src="gui/smalltab.js"></script>
        <script type="text/javascript" src="gui/tablehighlighter.js"></script>
        <script type="text/javascript" src="gui/jquery-filestyle.min.js"></script>
        <script type="text/javascript" src="gui/jquery.nanoscroller.js"></script>
        <script type="text/javascript" src="input/keyboard.js"></script>
        <script type="text/javascript" src="input/mouseV.js"></script>
        <script type="text/javascript" src="input/mouseF.js"></script>
        <script type="text/javascript" src="openid/register.js"></script>
        <script src="metadata.js" type="text/javascript"></script>
        
        <!-- init -->
        <script type="text/javascript">

            function init() {
                // generic viewer general init
                GV.init();
                GV.Filter.updateTable();

                // GUI init
                $("#tabs").tabs(
                        {activate: function (e) {
                                if (e.currentTarget)
                                    e.currentTarget.blur();
                            }});
                $("#dialog-link, #icons li").hover(
                        function () {
                            $(this).addClass("ui-state-hover");
                        },
                        function () {
                            $(this).removeClass("ui-state-hover");
                        }
                );

                //console.log("clickevent");

                $(":file").jfilestyle({buttonText: "Find file"});

                $(document).click(function(event) { 
                    
                    if(!$(event.target).is('.interfacecontainer') && !$(event.target).is('#annotateflyout') && !$(event.target).is('#annotateflyout')
                        && !$(event.target).is('.labelselect') && !$(event.target).is('.plus2') && !$(event.target).is('.change')
                        && !$(event.target).is('.addannotation') && !$(event.target).is('.mapselect') && !$(event.target).is('.interfacelist')
                        && !$(event.target).is('.interfacelist a') && !$(event.target).is('.interfacelist li') && !$(event.target).is('.filterinput') 
                        && !$(event.target).is('#Feature') && !$(event.target).is('#Instance') && !$(event.target).is('#Text') 
                        && !$(event.target).is('.interfacelist li') && !$(event.target).is('#Class') && !$(event.target).is('#textbox')
                        && !$(event.target).is('.tabnavigation a') && !$(event.target).is('textarea') && !$(event.target).is('#sparqltabflyout') 
                        && !$(event.target).is('#sparqlsend')    )
                        {
                            //console.log(event.target);
                            GV.Filter.filterinterface.cancel();   
                            $("#annotateflyoutwrapper").hide();      
                            $("#sparqltabflyout").remove();    
                            $(".oldflyoutwrapper").hide();    
                            GV.Annotate.annotationinterface.flyout = false;
                            $(".activebox").removeClass("activebox");
                        }  
                });
                GV.Metadata.getMetadata();

                $(".nano").nanoScroller();
                $(".change").click(function(){
                    $(this).next("div").show();
                    console.log("show");
                });
            }

            function onSubmitImport() {
                document.form_import.action = GV.setting.spatialstore.getSpatialcontext().getID();
                console.log(document.form_import.action);
                return true;
            }
            
             function initfeature() {
                 var furi = '<%=request.getParameter("furi") %>';
                return furi;
            }
             
       </script>

    </head>

    <body onload="init()">
        <div id="preloader">
            <div id="wait" style="font-style: italic;">Please wait</div>
            <div id="viewertitle">Spatial Viewer<br>Capturing and Annotation Tool<br></div>

            developed in 2015<br>
            <div id="viewercredits">
                 <span style="margin-top: 30px;">
                    <p class="form-name">Generic Viewer</p>
                    <span class="jfilestyle">    
                        Kai-Christian Bruhn<br>
                        Matthias Dufner<br>
                        Julia Ganitševa<br>
                        Fredie Kern<br>
                        Felix Lange<br>
                        Alexandra Müller<br>
                        Torsten Schrade<br>
                        Frithjof Schwartz<br>
                        Martin Unold
                    </span>

                    </span>
                    <span style="float: left; clear: none; margin-left: 80px; margin-top: 30px;">
                    <p class="form-name">Spatial Viewer</p>
                    <span class="jfilestyle">    
                        Kai-Christian Bruhn<br>
                        Matthias Dufner<br>
                        Fredie Kern<br>
                        Alexandra Müller<br>
                    </span>
                    </span>

            </div>
        </div>
        <div id="tabs">
            <div id="tabbackground"></div>
            <div id="toprow">
                <div id="tabunderline"></div>
                <ul id="toprowUL" style="visibility: hidden">
                    <li><a href="#tabs-menu" onclick="GV.setting.setTab('menu')">Menu<span>(F1)</span></a></li>
                    <li><a href="#tabs-draw" onclick="GV.setting.setTab('draw')">Draw<span>(F2)</span></a></li>
                    <li><a href="#tabs-filter" onclick="GV.setting.setTab('Filter')">Query<span>(F3)</span></a></li>
                </ul>
            </div>

            <div id="tabs-draw">
                <div id="toolbarbg"></div>
                <div id="toolbar">
                    <a id="linestring" href="#" title="Draw line"><span class="icon-linestring iconfont"></span></a>
                    <a id="polygon" href="#" title="Draw polygon"><span class="icon-polygon iconfont"></span></a>
                    <a id="prism" href="#" title="Draw extruded polygon"><span class="icon-extrudedpolygon iconfont"></span></a>
                    <!--<a id="export" href="#" title="export features"><span class="icon-downloadfeature iconfont"></span></a>
                    <a id="pointcloud" href="#" title="export pointcloud"><span class="icon-downloadpointcloud iconfont"></span></a>-->
                    
                    <a id="delete" href="#" title="delete feature"><span class="icon-trash iconfont"></span></a>
                    <a id="edit" href="#" title="edit feature"><span class="icon-edit iconfont"></span></a>
                    <a id="abort" href="#" title="delete changes"><span class="icon-abort iconfont"></span></a>
                    <a id="save" href="#" title="save feature"><span class="icon-save iconfont"></span></a>
                    <!--<a id="visibility" href="#" title="check visibility"><img width="38" src="img/visibility.png"/></a>
                    <a id="planarize" href="#" title="planarize feature"><img width="38" src="img/planarize.png"/></a>
                    <a id="missclick" href="#" title="detect missclicks"><img src="img/missclick.png"/></a>-->
                   
                    <a id="editAdd" href="#" title="add point"><span class="icon-addpoint iconfont"></span></a>
                    <a id="editDelete" href="#" title="delete point"><span class="icon-deletepoint iconfont"></span></a>
                    <a id="editDrag" href="#" title="drag point"><span class="icon-movepoint iconfont"></span></a>
                    <a id="visible" href="#" title="Set feature as visible from this viewpoint"><span class="icon-visible iconfont"></span></a>
                    <a id="invisible" href="#" title="Set feature as invisible from this viewpoint"><span class="icon-invisible iconfont"></span></a> 

                </div>
                <div id="window">
                    <canvas id="viewer"></canvas>
                    <div class="projectselect panoramaselect">
                        <p class="labelselect">Panorama</p>
                        <p class="change"></p>

                        <div class="oldflyoutwrapper" class="nano">
                            <div id="panorama" class="interfacelist">
                            </div>  
                        </div>
                            
                        
                    </div>
                </div>
            </div>


            <div id="tabs-filter">

               

                <!-- Datentabelle -->
                 <div id="tablewrapper" onScroll="javascript:fixheader();">
                <div id="table">

                </div>
               


                <div class="pluscontainer">
                    <div class="plus">
                        +
                    </div>
                    <div class="sizeproblem">
                        +
                    </div>
                </div> 
                </div>
            </div>

            <div id="tabs-menu">
                <div id="menunav">
                    <ul>
                        <li><a href="#documentation">Tutorials</a></li>
                        <li><a href="#settings">Settings</a></li>
                        <li><a href="#exporth1">Export</a></li>
                        <li><a href="#importh1">Import</a></li>
                        <li><a href="#systemrequirements">System Requirements</a></li>
                        <li><a href="#imprint">Imprint</a></li>
                        <li><a href="#credits">Credits</a></li>
                        <li><a href="#license">License</a></li>
                       
                    </ul>
                    
                   
                </div>

                <div id="documentation">
                    <div id="userdiv">
                        <span>
                            <a href="javascript:GV.openid.log()">
                                <span class="icon-login iconfont"></span>
                            </a>
                            <span id="logtext"></span>
                        </span>
                       
                        <span id="user"></span>
                    </div>
                    
                    <div id="metadata">
                        <div class="meta-label">Spatial Context</div><div id="metadata-place"></div>
                        <div class="meta-label">Feature Count</div><div id="metadata-featurecount"></div>
                        <div class="meta-label">Viewpoint Count</div><div id="metadata-viewpointcount"></div>
                        <div class="meta-label">Date</div><div id="metadata-date"></div>
                        <div class="meta-label">Coordinate</div><div id="metadata-coordinate"></div>
                        <div class="meta-label">Coordinate System/ SRID</div><div id="metadata-coordsystem"></div>
                        <div class="meta-label">Spatial Context URI</div><div id="metadata-uri"></div>
                        <div class="meta-label">OpenRDF Workbench</div><div id="metadata-workbench"></div>
                        <div class="meta-label">Triplestore Repository</div><div id="metadata-repository"></div>
                        <div class="meta-label" style="margin-top: 20px;">Github Repository</div><div style="margin-top: 20px;" id="metadata-github"></div>
                        <div class="meta-label">Spatial Viewer Wiki</div><div id="metadata-wiki"></div>
                        
                    </div>
                    <h1>Intro / Tutorials</h1>
                    <span id="introtext"> 
                        Spatial Viewer is a tool to exploit 3D data in a virtual research environment. <br>
                        Objects can be captured as geometric Features. <br>
                        The Features then can be enriched with information by the help of triples.
                    </span>

                    <iframe width="720" height="315" src="https://www.youtube.com/embed/T0QVVwSYFCk?vq=1080" frameborder="0" allowfullscreen></iframe>
                    <iframe width="720" height="315" src="https://www.youtube.com/embed/8zwYC_oYxAQ?vq=1080" frameborder="0" allowfullscreen></iframe>
                    <iframe width="720" height="315" src="https://www.youtube.com/embed/boracG7utWE?vq=1080" frameborder="0" allowfullscreen></iframe>
                    
                </div>
               
                <div id="settings">
                    <h1>Settings</h1>
                     <form id="featuredisplaysetting" class="menusettingsbox marginbottom">
                        <p class="form-name">Feature Display Setting</p>
                        <p>
                            <input type="checkbox" id="display_setting_screen" onclick="GV.Draw.changeSetting()" />
                            <label for="display_setting_screen">Fixed Size on Screen</label><br>
                            <input type="checkbox" id="display_setting_zoom" onclick="GV.Draw.changeSetting()" />
                            <label for="display_setting_zoom">Change Size when Zooming</label><br>
                            <input type="checkbox" id="display_setting_polygon" onclick="GV.Draw.changeSetting()" />
                            <label for="display_setting_polygon">Draw Polygon Points</label>
                        </p>
                        <span class="docushorttext">
                            Adjust how features are <br>
                            rendered in the Draw tab.
                        </span>
                    </form>
                    
                    
                    <div class="projectselect menuselect" style="display: none;">
                        <p class="labelselect">Spatialcontext</p>
                        <ul>
                            <li class="change2" class="nano">
                                <ul id="spatialcontext">
                                </ul>
                            </li>
                        </ul>
                    </div>

                
                    
                    <h1 id="exporth1">Export</h1>
                    <form class="menusettings clear">
                        <p class="form-name">Pointcloud File Format</p>
                        <p>
                            <input type="radio" name="pointcloud_format" value="xyz" checked="checked" id="xyz" />
                            <label for="xyz">XYZ</label><br>
                            <input type="radio" name="pointcloud_format" value="pts" id="pts" />
                            <label for="pts">PTS</label>
                        </p>
                        <span class="docushorttext">
                            Set file format for the <br>
                            pointcloud export in the <br>
                            Draw tab.
                        </span>
                    </form>
                    <form class="menusettings">
                        <p class="form-name">Features File Format</p>
                        <p>
                            <input type="radio" name="geometry_format" value="wkt" id="wkt" checked="checked" />
                            <label for="wkt">Well Known Text (WKT)</label><br>
                            <input type="radio" name="geometry_format" value="gml" id="gml" />
                            <label for="gml">Geography Markup Language (GML)</label><br>
                            <input type="radio" name="geometry_format" value="x3d" id="x3d" />
                            <label for="x3d">X3D</label>
                        </p>
                        <span class="docushorttext">
                            Set file format for the <br>
                            feature export in the <br>
                            Draw tab.
                        </span>
                    </form>
                    <form class="menusettings">
                        <p class="form-name">Coordinate System</p>
                        <p>
                            <input type="radio" name="export_system" value="4326" id="4326" />
                            <label for="4326">WGS-84</label><br>
                            <input type="radio" name="export_system" value="31467" id="31467" />
                            <label for="31467">Gauß-Krüger Zone 3</label><br>
                            <input type="radio" name="export_system" value="spatialcontext" id="spatialc" checked="checked" />
                            <label for="spatialc">Spatialcontext</label><br>
                            <input type="radio" name="export_system" value="pointcloud" id="pointcl" />
                            <label for="pointcl">Original Scan Data</label>
                        </p>
                        <span class="docushorttext">
                            Set the coordinate <br>
                            system for the export <br>
                            files of pointclouds <br>
                            and features.
                        </span>
                    </form>
                    
                   
                    <div id="reportwrapper">
                         <p class="form-name">Session Export</p>
                        <button type="button" id="downloadreport">Download Report File</button>
                        <span class="docushorttext">
                            The report file contains <br>
                            information about the <br>
                            current session and the <br>
                            data table that was con-<br>
                            figured in the Query tab.
                        </span>
                    </div> 
                    <h1 class="margintop" id="importh1">Import</h1>
                     <form id="form" name="form_import" method="POST" enctype="multipart/form-data" onsubmit="return onSubmitImport();" >
                         <p class="form-name">Import Features</p>
                       
                        <!-- span class="docushorttext">Import Features<br> (wkt objects)</span -->
                        <input type="file" id="feature_import_file" name="feature_import_file" class="jfilestyle" data-buttonText="Find file"/>
                        
                        <input class="jfilestyle" class="button" type="submit" id="import" value="Import" />
                        
                        <span class="docushorttext">
                            Only the import of <br>
                            features in WKT and <br>
                            EWKT is possible.
                        </span>
                        
                       
                    </form>
                    <h1 id="systemrequirements" class="margintop">System Requirements</h1>
                    <span>
                        The "Spatial Viewer" software was developed for <br>Mozilla Firefox (version 42).<br><br>
                        The user interface is optimized for <br>Full HD screens (1920 Pixels width).<br><br>

                        Any other combination of software and screen resolution is currently not supported and
                        may not work properly.
                    </span>
                    <h1 id="imprint" class="margintop">Imprint</h1>
                    <span>Developed based on the "<a href="http://oberwesel.spatialhumanities.de/viewer/">Generic Viewer</a>", 
                        a product of the joint project "<a href="http://www.spatialhumanities.de/ibr/">IBR - Inschriften im Bezugssystem des Raumes</a>" 
                        of "<a href="http://www.adwmainz.de/">Akademie der Wissenschaften und der Literatur</a>" and 
                        "<a href="http://i3mainz.de/">i3mainz - Institut für Raumbezogene Informations- und Messtechnik</a>",
                        funded by "<a href="https://www.bmbf.de/">Bundesministerium für Bildung und Forschung</a>".
                    </span>
                    <span>
                    <h1 id="credits" class="margintop">Credits</h1>   
                    <span style="margin-top: 30px;">
                    <p class="form-name">Generic Viewer</p>
                    <span class="jfilestyle">    
                        Kai-Christian Bruhn<br>
                        Matthias Dufner<br>
                        Julia Ganitševa<br>
                        Fredie Kern<br>
                        Felix Lange<br>
                        Alexandra Müller<br>
                        Torsten Schrade<br>
                        Frithjof Schwartz<br>
                        Martin Unold
                    </span>

                    </span>
                    <span style="float: left; clear: none; margin-left: 80px; margin-top: 30px;">
                    <p class="form-name">Spatial Viewer</p>
                    <span class="jfilestyle">    
                        Kai-Christian Bruhn<br>
                        Matthias Dufner<br>
                        Fredie Kern<br>
                        Alexander Klauss<br>
                        Alexandra Müller<br>
                    </span>
                    </span>
                    
                    
                    <h1 id="license" class="margintop">License</h1>
                    <span>
                        The MIT License (MIT)<br><br>

                        Copyright (c) 2015 Projekt Inschriften im Bezugssystem des Raumes<br><br>

                        Permission is hereby granted, free of charge, to any person obtaining a copy
                        of this software and associated documentation files (the "Software"), to deal
                        in the Software without restriction, including without limitation the rights
                        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                        copies of the Software, and to permit persons to whom the Software is
                        furnished to do so, subject to the following conditions:<br>

                        The above copyright notice and this permission notice shall be included in all
                        copies or substantial portions of the Software.<br><br>

                        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                        SOFTWARE.

                    </span>
                </div>

                
            </div>


        </div>

    
        <div id="navigationmap">
             <a class="togglebutton activetab"><span class="icon-minimieren iconfont"></span><span>Console</span></a>
            <div id="info" class="toggleheight">
            


            </div>
            <div id="exportbuttons">
                <a id="export" href="#" title="export features"><span class="icon-export iconfont"></span>Export Features (wkt)</a>
                <a id="pointcloud" href="#" title="export pointcloud"><span class="icon-export iconfont"></span>Export Pointcloud (xyz)</a>
            </div>
            <a class="togglebutton firsttogglebutton activetab"><span class="icon-minimieren iconfont"></span><span>Map</span></a>
            <div id="geonavigation" class="toggleheight">
                <canvas width="350" height="300" id="floorplan"></canvas>
                <div class="workspace">
                    <div class="scaleiconsbg"></div>
                    <div id="scale">
                        <div id="leftend"></div>
                        <div id="scalewidth" style="width: 120px;">
                            <p id="scaleunit"></p>
                        </div>
                        <div id="rightend"></div>
                         
                         <div class="scaleicons2">
                            <a id="fullscreenbutton" href="#"><span class="icon-zoomout iconfont"></span></a>
                        </div>
                        <div class="scaleicons">
                            <span id="north" class="icon-north iconfont"></span>
                        </div>
                       
                    </div>
                    <div class="projectselect">
                        <div class="mapselect">
                            <p class="labelselect">Viewpoint</p>
                            <p class="change"></p>
                            <div class="oldflyoutwrapper nano">
                                <div id="viewpoint" class="interfacelist">
                                </div>  
                            </div>
                        </div>
                        <div class="mapselect">        
                            
                            <p class="labelselect">Floorplan</p>
                            <p class="change"></p>
                            <div class="oldflyoutwrapper nano">
                                <div id="floorplanmedia" class="interfacelist">
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <a class="togglebutton activetab"><span class="icon-minimieren iconfont"></span><span>Filter</span></a>
             <!-- Filterbox -->
            <div id="controls">
                <div class="interfacecontainerwrapper nano emptyheight">
                    <div class="interfacecontainer nano-content">
                        <a class="plus2" href="#"><span class="labelselect">Add Filter</span>+</a>
                    </div>
                </div>
            </div>
            <a class="togglebutton activetab"><span class="icon-minimieren iconfont"></span><span>Annotate</span></a>
            <div id="annotator">
                <div class="annotationbox" id="annotatesubject">
                    <a class='addannotation'><span class='labelselect'>Subject</span></a><span class='icon-dropdown iconfont'></span>
                </div>

                <div class="annotationbox" id="annotatepredicate">
                    <a class='addannotation'><span class='labelselect'>Predicate</span></a><span class='icon-dropdown iconfont'></span>
                </div>

                <div class="annotationbox" id="annotateobject">
                    <a class='addannotation'><span class='labelselect'>Object</span></a><span class='icon-dropdown iconfont'></span>
                </div>
                <div id="annotateflyoutwrapper" class="nano">
                    <div id="annotateflyout" class="nano-content">
                        <a id="closeannotateflyout"><span class="icon-icons-02 iconfont"></span></a>
                    </div>
                </div>
            </div>
           
            

            <a class="togglebutton closedtab"><span class="icon-maximieren iconfont"></span><span>Shortcuts</span></a>
            <div id="shortcuts" class="toggleheight">
                <div id="abortKey">
                    <p class="shortcut">(Esc)</p>
                    <p class="shortcutaction">Abort edit</p>
                </div>
                <div id="deselectKey">
                    <p class="shortcut">(Esc)</p>
                    <p class="shortcutaction">Deselect features</p>
                </div>
                <div id="closeKey">
                    <p class="shortcut">(Space)</p>
                    <p class="shortcutaction">Close measurement</p>
                </div>
                <div id="saveKey">
                    <p class="shortcut">(Strg + S)</p>
                    <p class="shortcutaction">Save feature</p>
                </div>
                <div id="allKey">
                    <p class="shortcut">(Strg + A)</p>
                    <p class="shortcutaction">Select all features</p>
                </div>
                <div id="deleteKey">
                    <p class="shortcut">(Entf)</p>
                    <p class="shortcutaction">Remove feature</p>
                </div>
                <div id="tabKey">
                    <p class="shortcut">(F1 - F3)</p>
                    <p class="shortcutaction">Tab-Navigation</p>
                </div>
                <div id="naviKey">
                    
                </div>
                <div id="zoomKey">
                    <p class="shortcut">(+ / -)</p>
                    <p class="shortcutaction">Zoom</p>
                </div>
            </div>
        </div>
        <a id="hidesidebar" href="#"><span class="icon-close iconfont"></span></a>

        <div id="footerwrapper">
            <div id="footer">
                Spatial Viewer<span></span><span></span>
            </div>
        </div>
       
    </body>
</html>