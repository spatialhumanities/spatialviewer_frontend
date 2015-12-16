GV.Setting = function () {

    /*   
    var initDocumentation = function (text) {
        var converter = new Showdown.converter();
        document.getElementById("documentation").innerHTML = converter.makeHtml(text);
        var h2 = document.getElementById("documentation").getElementsByTagName("h2");
        var contents = document.getElementById("contents");
        for (var i = 1; i <= h2.length; i++) {
            h2[i - 1].setAttribute("id", i);
            contents.innerHTML += "<li><a href='#" + i + "'>" + h2[i - 1].innerHTML + "</a></li>";
        }
        var h3 = document.getElementById("documentation").getElementsByTagName("h3");
        var menunav = document.getElementById("menu-nav").getElementsByTagName("ul")[0];
        for (var i = 1; i <= h3.length; i++) {
            h3[i - 1].setAttribute("id", "C" + i);
            menunav.innerHTML += "<li><a href='#C" + i + "'>" + h3[i - 1].innerHTML + "</a></li>";
        }
    }

    */

    // visualizer
    var viewer;
    var floorplan;
    this.init = function () {
        viewer = new GV.Viewer.Main();
        floorplan = new GV.Floorplan.Main();
        viewer.updateMeasurement();
        // IO.loadDocumentation(initDocumentation);
        GV.setting.resize();
    }
    var buttons = new GV.GUI.Buttons();
    this.buttonVisible = function (buttonID) {
        return buttons.isVisible(buttonID);
    }
    var tab = "menu";
    this.getTab = function () {
        return tab;
    }
    this.setTab = function (_tab) {
        if (!GV.setting.spatialstore.getSpatialcontext())
            return;
        if (_tab) {
            tab = _tab;
            //console.log(tab);
            if (tab == "connect") {

            }
        }
        buttons.updateTab(tab);
        //console.log(tab);
    }

    this.changeFloorplanViewpoint = function () {
        floorplan.changeViewpoint(GV.setting.spatialstore.getSpatialcontext().getViewpoint());
    }
    this.changeFloorplan = function () {
        floorplan.changeFloorplan(GV.setting.spatialstore.getSpatialcontext().getFloorplan());
        floorplan.changeViewpoint(GV.setting.spatialstore.getSpatialcontext().getViewpoint());
    }
    this.changeViewerPanorama = function () {
        viewer.changePanorama(GV.setting.spatialstore.getSpatialcontext().getViewpoint().getPanorama());
    }
    this.changeViewerFeatures = function () {
        viewer.changeFeatures();
        floorplan.changeFeatures();
    }
    this.changeViewerMeasurement = function () {
        viewer.updateMeasurement();
        floorplan.changeFeatures();
    }

    this.setHighlightedFeature = function(uri) {
        floorplan.setHighlightedFeature(uri);
        floorplan.update();
    }

    // spatialstore
    this.spatialstore = new GV.Spatialstore.Main();
    GV.Spatialstore.fillSelect("spatialcontext");

    // expert data
    /*var annotationstore = new GV.Annotationstore.Main();
     this.getAnnotationstore = function() { return annotationstore; }
     var cid = false;
     this.getCollection = function() { return cid; }
     var rid = false;
     this.getResource = function() { return rid; }*/

    // viewer
    var azim = 0;
    var elev = Math.PI / 2;
    this.getAzim = function () {
        return azim;
    }
    this.getElev = function () {
        return elev;
    }
    this.rotate = function (dAzim, dElev) {
        azim += zoom * dAzim;
        elev -= zoom * dElev;
        if (elev > Math.PI)
            elev = Math.PI;
        if (elev < 0)
            elev = 0;
        floorplan.update();
        viewer.update();
    }
    this.setAzim = function (_azim) {
        azim = _azim;
        floorplan.update();
        viewer.update();
    }
    this.setElev = function (_elev) {
        elev = _elev;
        if (elev > Math.PI)
            elev = Math.PI;
        if (elev < 0)
            elev = 0;
        floorplan.update();
        viewer.update();
    }
    var zoom = Math.PI / 4;
    this.getZoom = function () {
        return zoom;
    }
    this.setZoom = function (_zoom) {
        zoom = _zoom;
        if (zoom > Math.PI / 3)
            zoom = Math.PI / 3;
        floorplan.update();
        viewer.update();
        zoomLastModify = new Date();
        window.setTimeout(zoomUpdate, 1000);
    }
    var zoomLastModify = new Date();
    var zoomUpdate = function () {
        var now = new Date();
        if (now - zoomLastModify > 500) {
            zoomLastModify = now;
            if (measurement)
                measurement.update();
            viewer.update(true);
        }
    }


    // status
    var measurement = false;
    this.getMeasurement = function () {
        return measurement;
    }
    this.setMeasurement = function (_measurement) {
        measurement = _measurement;
        //GV.Filter.filter(GV.setting.spatialstore.getSpatialcontext());
        GV.setting.setTab();
        //viewer.changeFeatures();
    }

    this.resize = function () {
        canvas = document.getElementById("viewer");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var tabs2width = window.innerWidth - 350;
        viewer.resize();
    }
}
