GV.Input = GV.Input || {};

document.onkeydown = function(event) {
	
	var SPEED = 0.1;

	switch(event.keyCode) {
	/*case 86: // V
		GV.GUI.Buttons.displayViewpoint();
		break;
	case 65: // A
		GV.GUI.Buttons.displayAll();
		break;
	case 79: // O
		GV.GUI.Buttons.displayOwn();
		break;
	case 84: // T
		GV.GUI.Buttons.display48();
		break;*/
	case 27: // ESC
		if (!GV.setting.getMeasurement()) {
			var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
			spatialcontext.setSelectedFeatures([]);
			GV.Annotate.annotationinterface.checkSaveButton();
		}
		if (GV.setting.buttonVisible("abort"))
			GV.GUI.Buttons.abort();
		break;
	case 83: // Strg+S
		if (event.ctrlKey && GV.setting.buttonVisible("save")) {
			event.preventDefault();
			IO.saveFeature();
		}
		break;
	case 65: // Strg+A
		if (!GV.setting.getMeasurement() && event.ctrlKey) {
			event.preventDefault();
			var spatialcontext = GV.setting.spatialstore.getSpatialcontext();
			spatialcontext.setSelectedFeatures(keys(spatialcontext.getDisplayedFeatures()));
			GV.setting.changeViewerFeatures();
			GV.setting.setTab();
		}
		break;
	case 32: // SPACE
		if (GV.setting.getMeasurement() && !GV.setting.getMeasurement().closed())
			GV.GUI.Buttons.close();
		break;
	case 46: // Entf
		if (GV.setting.buttonVisible("delete"))
			IO.deleteFeatures();
		break;
//	case 37: // LEFT ARROW
//		GV.setting.rotate(SPEED,0);
//		break;
//	case 38: // UP ARROW
//		GV.setting.rotate(0,SPEED);
//		break;
//	case 39: // RIGHT ARROW
//		GV.setting.rotate(-SPEED,0);
//		break;
//	case 40: // DOWN ARROW
//		GV.setting.rotate(0,-SPEED);
//		break;
	case 171: // +
    case 107:
		GV.setting.setZoom(GV.setting.getZoom() * (1-SPEED));
		break;
	case 173: // -
    case 109:
		GV.setting.setZoom(GV.setting.getZoom() * (1+SPEED));
		break;
	case 112: //F1
		event.preventDefault();
		$("#tabs").tabs({active:0});
		GV.setting.setTab("menu");
		break;
	case 113: //F2
		event.preventDefault();
		$("#tabs").tabs({active:1});
		GV.setting.setTab("overview");
		break;
	case 114: //F3
		event.preventDefault();
		$("#tabs").tabs({active:2});
		GV.setting.setTab("sparql");
		break;
//	case 115: //F4
//		event.preventDefault();
//		$("#tabs").tabs({active:3});
//		GV.setting.setTab("draw");
//		break;
//	case 116: //F5
//		event.preventDefault();
//		$("#tabs").tabs({active:4});
//		GV.setting.setTab("connect");
//		break;
	}
};



// get keycodes from http://keycode.info/