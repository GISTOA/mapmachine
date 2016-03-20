/*global define*/
/*jshint laxcomma:true*/
define([
    'esri/layers/FeatureLayer', "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ImageParameters",
    "esri/tasks/Geoprocessor", "esri/tasks/QueryTask", "esri/tasks/IdentifyTask", "esri/tasks/FindTask",
    'utils/symbolutil'
], function(FeatureLayer, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer,ImageParameters,
    Geoprocessor, QueryTask,IdentifyTask,FindTask
    ) {
        var _exportMapGP = new Geoprocessor("http://map.amherst.ny.us/gallifrey/rest/services/BaseMap/ExportToPDF/GPServer/ExportToPDF");
        var _contactGP = new Geoprocessor("http://map.amherst.ny.us/gallifrey/rest/services/BaseMap/Contact/GPServer/Contact");
        var _queryTask = new QueryTask("http://map.amherst.ny.us/gallifrey/rest/services/BaseMap/MapMachineMain/MapServer/22");
        var _identifyTask = new IdentifyTask("http://map.amherst.ny.us/gallifrey/rest/services/BaseMap/MapMachineMain/MapServer");
        var _findTask = new FindTask("http://map.amherst.ny.us/gallifrey/rest/services/BaseMap/MapMachineMain/MapServer");

         var _parcelLayer = new FeatureLayer("http://map.amherst.ny.us/gallifrey/rest/services/BaseMap/MapMachineMain/MapServer/22", {
            mode: FeatureLayer.MODE_SELECTION,
            outFields: ["*"]
        });

        var _orthoLayer = new ArcGISTiledMapServiceLayer("http://map.amherst.ny.us/gallifrey/rest/services/OrthoBase/NYS_Imagery_2014/MapServer", {
            id: "2011nys_true_color",
            opacity: 1.0,
            visible: true
        });

        //Add Hydrant Layer MJiang 03.03.2015
        var imageParametersF = new ImageParameters();
        imageParametersF.layerIds = [0, 1, 2, 3];
        var _hydrantLayer = new ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us/gallifrey/rest/services/Fire/FireHydrants/MapServer", {
            "imageParameters": imageParametersF
        });

        var imageParameters = new ImageParameters();
        imageParameters.layerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 17, 18, 19, 22, 23, 29, 30];
        imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
        imageParameters.transparent = true;
        var _layers = new ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us/gallifrey/rest/services/BaseMap/MapMachineMain/MapServer", {
            "imageParameters": imageParameters
        });
        _layers.setImageFormat("png32");


    return {
        exportMapGP:_exportMapGP,
        contactGP:_contactGP,
        queryTask: _queryTask,
        identifyTask: _identifyTask,
        findTask: _findTask,
        parcelLayer: _parcelLayer,
        orthoLayer: _orthoLayer,
        hydrantLayer: _hydrantLayer,
        layers: _layers,
    };
});
