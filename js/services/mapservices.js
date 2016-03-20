/*global define*/
/*jshint laxcomma:true*/
define([
    'esri/layers/FeatureLayer',"esri/tasks/Geoprocessor",
    'utils/symbolutil'
], function(FeatureLayer,Geoprocessor, symbolUtil) {

    function _loadServices(config) {

        var layers = [],
            requestLayer = new FeatureLayer('http://services1.arcgis.com/QKasy5M2L9TAQ7gs/arcgis/rest/services/Requests/FeatureServer/0', {
                id: 'Requests',
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ['*']
            });
        layers.push(requestLayer);

        return layers;
    }



    return {
        loadServices: _loadServices,

    };
});
