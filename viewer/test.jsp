<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	
	<!-- meta information -->
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta http-equiv="Last-Modified" content="Wed, 04 Mar 2015 12:50:01 GMT"/>
	<title>GenericViewer</title>
	
	<!-- css -->
	<link href="gvstyle.css" rel="stylesheet" type="text/css">
	<link href='http://fonts.googleapis.com/css?family=Nobile' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Roboto:300,400' rel='stylesheet' type='text/css'>
	<link href="flyout.css" rel="stylesheet" type="text/css">
	<link href="pundit.css" rel="stylesheet" type="text/css">
	
	<!-- external javascript libraries -->
	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="http://code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
	<script src="http://softwaremaniacs.org/playground/showdown-highlight/showdown.js"></script>
	
	<!-- pundit javascript -->
	<script type="text/javascript" src="geo2pundit_03.js"></script>
	
	<!-- generic viewer javascript -->
	<script type="text/javascript" src="init.js"></script>
	<script type="text/javascript" src="setting.js"></script>
	<script type="text/javascript" src="communicator.js"></script>
	<script type="text/javascript" src="math.js"></script>
	<script type="text/javascript" src="filter.js"></script>
	<script type="text/javascript" src="annotationstore/annotationstore.js"></script>
	<script type="text/javascript" src="annotationstore/collection.js"></script>
	<script type="text/javascript" src="annotationstore/resource.js"></script>
	<script type="text/javascript" src="triplestore/createTriple.js"></script>
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
	<script type="text/javascript" src="input/keyboard.js"></script>
	<script type="text/javascript" src="input/mouseV.js"></script>
	<script type="text/javascript" src="input/mouseF.js"></script>
	<script type="text/javascript" src="openid/register.js"></script>
	
	<!-- init -->
	<script type="text/javascript">
		function init() {
			// generic viewer general init
			GV.init();
			
			// pundit init
			if(window['_PUNDIT']==undefined){loadPundit();}
			
			<!-- GUI init -->
			$("#tabs").tabs({activate:function(e){if(e.currentTarget) e.currentTarget.blur();}});
			$("#dialog-link, #icons li").hover(
				function () {
					$(this).addClass("ui-state-hover");
				},
				function () {
					$(this).removeClass("ui-state-hover");
				}
			);
			$("#filterDateFrom").datepicker();
			$("#filterDateTo").datepicker();
		}
		
		function onSubmitImport(){
			document.form_import.action = GV.setting.spatialstore.getSpatialcontext().getID();
			console.log(document.form_import.action);
			return true;
		}
	</script>
	<script type="text/javascript">
		function initspatialcontext() {
			var furi = '<%=request.getParameter("furi") %>';
			var start = furi.indexOf(GV.Spatialstore.URL);
			if (start >= 0) {
				start += GV.Spatialstore.URL.length;
				var length = furi.substr(start).indexOf("/");
				console.log(furi.substr(start,length));
				GV.GUI.execute("spatialcontext", GV.Spatialstore.URL + furi.substr(start,length));
				return true;
			}
		}
		function initfeature() {
			GV.GUI.showFeature('<%=request.getParameter("furi") %>');
		}
	</script>
	
</head>

<body onload="init()">
	<div id="tabs">
		<div id="toprow">
			<ul id="toprowUL" style="visibility: hidden">
				<li><a href="#tabs-menu" onclick="GV.setting.setTab('menu')">Menu<span>(F1)</span></a></li>
				<li><a href="#tabs-overview" onclick="GV.setting.setTab('overview')">Overview<span>(F2)</span></a></li>
				<li><a href="#tabs-sparql" onclick="GV.setting.setTab('sparql')">Filter<span>(F3)</span></a></li>
				<li><a href="#tabs-draw" onclick="GV.setting.setTab('draw')">Draw<span>(F4)</span></a></li>
				<li id="connectID"><a href="#tabs-connect" onclick="if (_PUNDIT!=undefined){currentFeaturesToTripleBrowser();tripleComposer.subjSuggestionPanel.hide();tripleComposer.objSuggestionPanel.hide();GV.setting.setTab('connect');}">Connect<span>(F5)</span></a></li><!---->
			</ul>
		</div>
		
		<div id="tabs-draw">
			<div id="toolbarbg"></div>
			<div id="toolbar">
				<a id="linestring" href="#" title="draw line"><img width="38" src="img/linestring.png"/></a>
				<a id="polygon" href="#" title="draw polygon"><img width="38" src="img/polygon.png"/></a>
				<a id="prism" href="#" title="draw extruded polygon"><img width="38" src="img/prism.png"/></a>
				<a id="export" href="#" title="export features"><img width="38" src="img/export.png"/></a>
				<a id="pointcloud" href="#" title="export pointcloud"><img width="38" src="img/pointcloud.png"/></a>
				<a id="delete" href="#" title="delete feature"><img width="38" src="img/delete.png"/></a>
				<a id="edit" href="#" title="edit feature"><img width="38" src="img/edit.png"/></a>
				<a id="save" href="#" title="save feature"><img width="38" src="img/save.png"/></a>
				<!--<a id="visibility" href="#" title="check visibility"><img width="38" src="img/visibility.png"/></a>
				<a id="planarize" href="#" title="planarize feature"><img width="38" src="img/planarize.png"/></a>
				<a id="missclick" href="#" title="detect missclicks"><img src="img/missclick.png"/></a>-->
				<a id="abort" href="#" title="abort"><img width="38" src="img/abort.png"/></a>
				<a id="editAdd" href="#" title="add point"><img width="38" src="img/editAdd.png"/></a>
				<a id="editDelete" href="#" title="delete point"><img width="38" src="img/editDelete.png"/></a>
				<a id="editDrag" href="#" title="drag point"><img width="38" src="img/editDrag.png"/></a>
				<a id="visible" href="#" title="set feature as visible"><img src="img/visible.png"/></a>
				<a id="invisible" href="#" title="set feature as invisible"><img width="38" src="img/invisible.png"/></a>
				
			</div>
			<div id="window">
				<canvas id="viewer"></canvas>
				<div class="projectselect panoramaselect">
					<p class="labelselect">Panorama</p>
					<ul>
						<li class="change2">
							<ul id="panorama">
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>
		
		<div id="tabs-overview">
			<div id="gvobjects"></div>
		</div>
		
		<div id="tabs-sparql">
			<div id="gvobjects2"></div>
			<div id="filterbox">
				<div class="projectselect">
					<ul>
						<li class="change2"><a href="#">add filter</a>
							<ul>
								<li><a href="javascript: GV.Filter.select('sparql')">sparql</a></li>
								<li><a href="javascript: GV.Filter.select('date')">date</a></li>
								<li><a href="javascript: GV.Filter.select('creator')">creator</a></li>
								<li><a href="javascript: GV.Filter.select('geom')">geometry</a></li>
								<li><a href="javascript: GV.Filter.select('viewpoint')">viewpoint</a></li>
								<li><a href="javascript: GV.Filter.select('default')">selection</a></li>
							</ul>
						</li>
					</ul>
				</div>
				<div>
					<ul id="activefilters">
					</ul>
				</div>
			</div>
			<div id="filterinput">
				<div id="filter_sparql" name="filter by SPARQL-query" style="display:none">
					<div id="saved_queries"></div>
					<textarea id="sparql" rows="20">SELECT * WHERE {?x ?y ?z.}</textarea>
					<a id="filterSparqlSubmit" href="javascript: GV.Filter.add('sparql')" title="filter"><span>SPARQL </span>Query</a>
				</div>
				<div id="filter_date" name="filter by date" style="display:none">
					<div id="filterDateFrom" ></div>
					<div id="filterDateTo" ></div>
					<a class="filterdatebutton" href="javascript: GV.Filter.add('date')" title="filter">filter</a>
					<a class="filterdatebutton" href="javascript: GV.Filter.add('date','today')" title="filter">today</a>
					<a class="filterdatebutton" href="javascript: GV.Filter.add('date','yesterday')" title="filter">yesterday</a>
				</div>
				<div id="filter_creator" name="filter by creator" style="display:none">
				</div>
				<div id="filter_geom" name="filter by geometry" style="display:none">
					<input id="filterGeomType" type="hidden" />
					<p class="labelselect">select type</p>
					<ul>
						<li><a href="javascript: document.getElementById('filterGeomType').value = 'POINT'; document.getElementById('filterGeomUnit').innerHTML=''; document.getElementById('filterGeomSize').setAttribute('style','display:none');">point</a></li>
						<li><a href="javascript: document.getElementById('filterGeomType').value = 'LINESTRING'; document.getElementById('filterGeomUnit').innerHTML='m'; document.getElementById('filterGeomSize').removeAttribute('style');">linestring</a></li>
						<li><a href="javascript: document.getElementById('filterGeomType').value = 'MULTIPOLYGON'; document.getElementById('filterGeomUnit').innerHTML='m²'; document.getElementById('filterGeomSize').removeAttribute('style');">polygon</a></li>
						<li><a href="javascript: document.getElementById('filterGeomType').value = 'GEOMETRYCOLLECTION'; document.getElementById('filterGeomUnit').innerHTML='m³'; document.getElementById('filterGeomSize').removeAttribute('style');">prism</a></li>
					</ul>
					<div id="filterGeomSize" style="display:none">
						size: <input id="filterGeomFrom"/> to <input id="filterGeomTo"/> <span id="filterGeomUnit"></span>
					</div>
					<a id="filterButton" href="javascript: GV.Filter.add('geom')" title="filter">filter</a>
				</div>
				<div id="filter_viewpoint" name="filter by viewpoint" style="display:none">
				</div>
				<div id="filter_default" name="filter by selection" style="display:none">
					<p class="labelselect">What should happen with the selected features?</p>
					<ul>
						<li><a href="javascript: GV.Filter.add('default');">Display only the selected ones.</a></li>
						<li><a href="javascript: GV.Filter.add('default','filter');">Display all the other ones.</a></li>
					</ul>
				</div>
			</div>
		</div>
		
		<div id="tabs-menu">
			<div id="menu-nav">
				<ul>
					<li class="alignleft"><a href="#">Settings</a></li>
					<li class="alignleft"><a href="#credits">Credits</a></li>
					<li class="alignleft"><a href="#documentation">Documentation</a></li>
				</ul>
			</div>
			<div id="settings">
				<div id="userdiv">
					<span>
						<a href="javascript:GV.openid.log()">
							<img id="logimg"/>
						</a>
						<span id="logtext"></span>
					</span>
					<br/>
					<span id="user"></span>
				</div>
				<div class="projectselect menuselect">
					<p class="labelselect">Spatialcontext</p>
					<ul>
						<li class="change2">
							<ul id="spatialcontext">
							</ul>
						</li>
					</ul>
				</div>
				<div id="form-div">
					<form>
						<p class="form-name">Pointcloud File Format</p>
						<p>
							<input type="radio" name="pointcloud_format" value="xyz" checked="checked" />XYZ<br />
							<input type="radio" name="pointcloud_format" value="pts" />PTS<br />
						</p>
					</form>
					<form>
						<p class="form-name">Features File Format</p>
						<p>
							<input type="radio" name="geometry_format" value="wkt" checked="checked" />Well Known Text (WKT)<br />
							<input type="radio" name="geometry_format" value="gml" />Geography Markup Language (GML)<br />
							<input type="radio" name="geometry_format" value="x3d" />X3D<br />
						</p>
					</form>
					<form>
						<p class="form-name">Coordinate System</p>
						<p>
							<input type="radio" name="export_system" value="4326" />WGS-84<br />
							<input type="radio" name="export_system" value="31467" />Gauß-Krüger Zone 3<br />
							<input type="radio" name="export_system" value="spatialcontext" checked="checked" />Spatialcontext<br />
							<input type="radio" name="export_system" value="pointcloud" />Original Scan Data<br />
						</p>
					</form>
					<form>
						<p class="form-name">Feature Display Setting</p>
						<p>
							<input type="checkbox" id="display_setting_screen" onclick="GV.Draw.changeSetting()" />Fixed Size on Screen<br />
							<input type="checkbox" id="display_setting_zoom" onclick="GV.Draw.changeSetting()" />Change Size when Zooming<br />
							<input type="checkbox" id="display_setting_polygon" onclick="GV.Draw.changeSetting()" />Draw Polygon Points<br />
						</p>
					</form>
					<form id="form" name="form_import" method="POST" enctype="multipart/form-data" onsubmit="return onSubmitImport();" >
						<p class="form-name">Feature Import</p>
						<p>
							<input type="file" id="feature_import_file" name="file" />
							<input type="submit" id="import" value="Import" />
						</p>
					</form>
<!--					<form>
						<p class="form-name">Feature Import</p>
						<p>
							<input type="file" id="feature_import_file" />
							<input type="button" value="Import" onclick="IO.importFeatures()" />
						</p>
					</form>	
-->
				</div>
				
			</div>
			<div id="credits">
			</div>
			<div id="documentation">
				<h1>Loading ... Please wait!</h1>
				The system is preparing the project content. This can take a few seconds dependent on the size of the project and the speed of your internet connection. You will see a manual here, as soon as the system is ready. Enjoy your work with the GenericViewer!
			</div>
		</div>
		
		<div id="tabs-connect">
			<div id="genv_pundit_container">
			</div>
		</div>
	</div>
	
	<div id="navigationmap">
		<canvas width="300" height="300" id="floorplan"></canvas>
		<div class="workspace">
			<div id="scale">
				<a id="fullscreenbutton" href="#"><img id="fullscreen" src="img/fullscreen.png" width="20" height="20"/></a>
				
				<div id="leftend"></div>
				<div id="scalewidth" style="width: 120px;">
					<p id="scaleunit"></p>
				</div>
				<div id="rightend"></div>
				<img id="north" src="img/arrow.png" width="20" height="20"/>
			</div>
			<div class="projectselect">
				<p class="labelselect">Viewpoint</p>
				<ul>
					<li class="change">
						<ul id="viewpoint">
						</ul>
					</li>
				</ul>
				<p class="labelselect">Floorplan</p>
				<ul>
					<li class="change">
						<ul id="floorplanmedia">
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<span id="info"></span>
		<div id="shortcuts">
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
				<p class="shortcut">(Strg+S)</p>
				<p class="shortcutaction">Save feature</p>
			</div>
			<div id="allKey">
				<p class="shortcut">(Strg+A)</p>
				<p class="shortcutaction">Select all features</p>
			</div>
			<div id="deleteKey">
				<p class="shortcut">(Entf)</p>
				<p class="shortcutaction">Remove feature</p>
			</div>
			<div id="tabKey">
				<p class="shortcut">(F1-F5)</p>
				<p class="shortcutaction">Tab-Navigation</p>
			</div>
			<div id="naviKey">
				<p class="shortcut">(←↑↓→)</p>
				<p class="shortcutaction">Turn around</p>
			</div>
			<div id="zoomKey">
				<p class="shortcut">(+ / -)</p>
				<p class="shortcutaction">Zoom</p>
			</div>
		</div>
	</div>
	<div id="footerwrapper">
		<div id="footer">
			<p id="brand">Generic Viewer Beta</p>
			<p id="version">Capturing and Annotation Tool / Triple Browser based on Pundit</p>
		</div>
	</div>
</body>
</html>