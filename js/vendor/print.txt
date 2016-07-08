
          dojo.require("dojo.parser");
      dojo.require("esri.map");
      dojo.require("esri.tasks.query");
      dojo.require("esri.toolbars.navigation");
      dojo.require("dijit.form.Button");
      dojo.require("dijit.Toolbar");
      dojo.require("esri.dijit.Scalebar");
      dojo.require("dijit.Tooltip");
      dojo.require("esri.dijit.Popup");
      dojo.require("dojo.data.ItemFileReadStore");
      dojo.require("esri.tasks.find");
      dojo.require("esri.dijit.Legend");
      //dojo.require("agsjs.dijit.TOC");

      
      var layer;
      var map, queryTask, query, navToolbar, loading, visible=[];
      var symbol, infoTemplate;
      var handle,startExtent;
      var currentGraphic;//This variable is used to store symbol highlighted by hyperlink tool.
      //var popupTemplate;
      
      var findTask, findParams;
      
      var tempcells=-1;
      var tempnav;
      

        
    
     
      function init() {
      	
      	loading = dojo.byId("mapLoadingImg");
      	//define custom popup options
        var popupOptions = {
          'markerSymbol': new esri.symbol.SimpleMarkerSymbol('circle', 32, null, new dojo.Color([0, 0, 0, 0.25])),
          'marginLeft': '20', 
          'marginTop': '20'
        };
        //create a popup to replace the map's info window
        var popup = new esri.dijit.Popup(popupOptions, dojo.create("div"));
      	//define a popup template(Doesn't Work!)
        /*popupTemplate = new esri.dijit.PopupTemplate({
          title: "{PRINTKEY_1}",
          fieldInfos: [
          {fieldName: "ONAME1", visible: true, label:"Owner"},
          {fieldName: "STREETADD", visible:true, label:"Address"}
          ],
          showAttachments:true
        });*/
        esri.config.defaults.map.sliderLabel = null;
        esri.config.defaults.map.slider = { left:"80px", top:"20px", width:null, height:"200px" };
       /*startExtent = new esri.geometry.Extent({"xmin": -8788822,
          "ymin": 5310873,
          "xmax": -8747130,
          "ymax": 5325802,
          "spatialReference": {
            "wkid": 102100
          }});
        map = new esri.Map("map",{extent:startExtent,nav:false,infoWindow:popup});*/
       startExtent = new esri.geometry.Extent({"xmin":  1080503.518,
          "ymin": 1072362.123,
          "xmax": 1119457.511,
          "ymax": 1126182.568,
          "spatialReference": {
            "wkid": 2262
          }});
        map = new esri.Map("map",{infoWindow:popup});
        dojo.connect(map,"onUpdateStart",showLoading);
        dojo.connect(map,"onUpdateEnd",hideLoading);
        
        //var anno = new esri.layers.ArcGISTiledMapServiceLayer("http://map.amherst.ny.us/ArcGISNET/rest/services/Basemap/CacheClipAnnoMXD/MapServer"); //fistannocache
        //map.addLayer(anno);
        //var basemap0=new esri.layers.ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us/ArcGISNET/rest/services/Basemap/AmherstTownBoundary_MXD/MapServer");
        //var basemap = new esri.layers.ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us/ArcGISNET/rest/services/Basemap/BasemapWGS84_MSD/MapServer"); //test1
        //var basemap = new esri.layers.ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us/ArcGISNET/rest/services/Basemap/BasemapWGS84_MSD2/MapServer"); //test2
        //var basemap = new esri.layers.ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us/ArcGISNET/rest/services/Basemap/Basemap_NOAnno_09_04_2012/MapServer"); //road
        //var basemap = new esri.layers.ArcGISTiledMapServiceLayer("http://map.amherst.ny.us/ArcGISNET/rest/services/Basemap/AmherstStreets_MSD/MapServer"); //road test

        //var basemap = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer");
        //var basemap = new esri.layers.ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us/ArcGISNET/rest/services/Basemap/BBFL_BaseRouteMap/MapServer");
        //map.addLayer(basemap0);
        //map.addLayer(basemap);
        
        
         //Use the ImageParameters to set the visible layers in the map service during ArcGISDynamicMapServiceLayer construction. (Doesn't work.)
        var imageParameters = new esri.layers.ImageParameters();
        imageParameters.layerIds = [6,7];
        imageParameters.layerOption = esri.layers.ImageParameters.LAYER_OPTION_SHOW;
        //can also be: LAYER_OPTION_EXCLUDE, LAYER_OPTION_HIDE, LAYER_OPTION_INCLUDE
        layer=new esri.layers.ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us/ArcGISNET/rest/services/Basemap/BaseMapAug29/MapServer", {"imageParameters":imageParameters});
        //layer=new esri.layers.ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us:8399/arcgis/rest/services/Basemap/BasemapJava/MapServer", {"imageParameters":imageParameters});
       
        //map.addLayer(layer);
        //visible=["5"];
        //layer.setVisibleLayers(visible);
        //map.addLayer(new esri.layers.ArcGISDynamicMapServiceLayer("http://map.amherst.ny.us/ArcGISNET/rest/services/HyperLinks/Links/MapServer"));
        
        /* dojo.connect(map, 'onLayersAddResult', function(results) {
                var standardTOC = new agsjs.dijit.TOC({
                  map: map
                }, 'legendDiv');
                standardTOC.startup();
              });*/

        
        map.addLayers([layer]);
        
        
        //Legend Here
        dojo.connect(map,'onLayersAddResult',function(results){
          var layerInfo = dojo.map(results, function(layer,index){
            return {layer:layer.layer,title:layer.layer.name};
          });
          if(layerInfo.length > 0){
            var legendDijit = new esri.dijit.Legend({
              map:map,
              layerInfos:layerInfo
            },"legendDiv");
            legendDijit.startup();
          }
        });
        
        
        
        navToolbar = new esri.toolbars.Navigation(map);
        dojo.connect(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);
        /*dojo.connect(map, "onExtentChange", function(extent){
        	var currentext=extent;
        	
        });*/

        
        queryTask = new esri.tasks.QueryTask("http://map.amherst.ny.us:8399/arcgis/rest/services/Basemap/BasemapJava/MapServer/5");

        //Can listen for onComplete event to process results or can use the callback option in the queryTask.execute method.
        //dojo.connect(queryTask, "onComplete", showResults);

        //build query filter
        query = new esri.tasks.Query();
        query.outSpatialReference = {"wkid":102100};
        query.returnGeometry = true;
        query.outFields = ["PRINTKEY_1", "PARCELID", "Glink", "ONAME1", "STREETADD"];
        
        
        
        queryLinkTask = new esri.tasks.QueryTask("http://map.amherst.ny.us:8399/arcgis/rest/services/HyperLinks/Links/MapServer/8");

        //Can listen for onComplete event to process results or can use the callback option in the queryTask.execute method.
        //dojo.connect(queryTask, "onComplete", showResults);

        //build query filter
        queryLink = new esri.tasks.Query();
        queryLink.outSpatialReference = {"wkid":102100};
        queryLink.returnGeometry = true;
        queryLink.outFields = ["CPILink"];

        //create the infoTemplate to be used in the infoWindow.
        //All ${attributeName} will be substituted with the attribute value for current feature.
        //infoTemplate = new esri.InfoTemplate("${STATE_NAME}", "State Fips: ${STATE_FIPS}<br />Abbreviation: ${STATE_ABBR}<br />Area: ${AREA}");

        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.5]));
        
        //Create Find Task using the URL of the map service to search
        findTask = new esri.tasks.FindTask("http://map.amherst.ny.us:8399/arcgis/rest/services/Basemap/BasemapJava/MapServer");
        
        //Create the find parameters
        findParams = new esri.tasks.FindParameters();
        findParams.returnGeometry = true;
        findParams.layerIds = [5];
        findParams.searchFields = ["PrintKey"];
        findParams.outSpatialReference = map.spatialReference;
        
        
        
       
        
        dojo.connect(map, 'onLoad', function(theMap) {
          var scalebar = new esri.dijit.Scalebar({
            map: map,
            scalebarUnit:'english'
          });
         
          //resize the map when the browser resizes
         // dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
        
        window.onresize = function () {
        	map.resize();
        	map.reposition();
        	$("#map").css("height",window.innerHeight-20+"px");
        	$('#mapLoadingImg').css("left",window.innerWidth/2-16+"px");
    		$('#mapLoadingImg').css("top",window.innerHeight/2-16+"px");
    		$("#alert").css("left",window.innerWidth/2-225+"px");
    		
        	
		}
		
		map.setExtent(startExtent);
		
        });

      }
