//=========================================GLOBAL VARIABLES========================================================
var treeData = [{
    title: "Base Information",
    expand: true,
    key: "100",
    children: [{
        title: "Zoning",
        key: "20"
    }, {
        title: "Parcels",
        select: true,
        key: "22"
    }, {
        title: "Buildings",
        key: "24"
    }, {
        title: "Zip Code",
        key: "25"
    }, {
        title: "School Districts",
        key: "26"
    }, {
        title: "Fire Districts",
        key: "27"
    }, {
        title: "Fire Hydrant",
        select: true,
        key: "119"
    }]
}, {
    title: "Environmental Features",
    key: "129",
    expand: true,
    children: [{
        title: "Lakes, Ponds, Creeks",
        select: true,
        key: "29"
    }, {
        title: "Drainage Ditches & Creeks",
        key: "30",
        select: true
    }, {
        title: "Contours 2ft (LiDAR Based)",
        key: "31"
    }, {
        title: "Soils",
        key: "32"
    }, {
        title: "Wetlands",
        key: "134",
        children: [{
            title: "Wetlands - State (DEC)",
            key: "34"
        }, {
            title: "Wetlands - Federal (FWS)",
            key: "35"
        }]
    }, {
        title: "FEMA FLoodplain Information",
        key: "137",
        expand: true,
        children: [{
            title: "(Existing)FEMA Floodplain",
            expand: true,
            key: "138",
            children: [{
                title: "Existing Floodway",
                key: "38"
            }, {
                title: "Existing Floodplain",
                key: "39"
            }]
        }, {
            title: "(Proposed) FEMA Floodplain",
            expand: true,
            key: "141",
            children: [{
                title: "Proposed Floodway",
                key: "41"
            }, {
                title: "Proposed Floodplain",
                key: "42"
            }]
        }]
    }]
}, {
    title: "2014 NYS Aerial Photography",
    select: true,
    key: "118"
}];




//========================Exe part========================================
var OSName = "Unknown OS";
if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

navigator.sayswho = (function() {
    var N = navigator.appName,
        ua = navigator.userAgent,
        tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
    return M;
})();
var browser = '' + navigator.sayswho[0] + navigator.sayswho[1];


var winW = 1024,
    winH = 800;
if (document.body && document.body.offsetWidth) {
    winW = document.body.offsetWidth;
    winH = document.body.offsetHeight;
}
if (document.compatMode == 'CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth) {
    winW = document.documentElement.offsetWidth;
    winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
    winW = window.innerWidth;
    winH = window.innerHeight;
}




$(document).ready(function() {
    var mapheight = winH - 20 + "px";
    $("#map").css("height", mapheight);
    $("#alert").css("left", winW / 2 - 505 + "px");
    // $('#mapLoadingImg').css("left", winW / 2 - 16 + "px");
    // $('#mapLoadingImg').css("top", winH / 2 - 16 + "px");
    $('#table').css("top", 100 + "px");
    $('#table').css("right", winW / 2 + "px");
    $("#legendDiv").addClass("absolutePosition");
});

//jQuery light weight popup dialog box
$(function() {
    $('#popupinfo').modalPopLite({
        openButton: '#popupclicker',
        closeButton: '#close-btn',
        isModal: true
    });
});
$(function() {
    $('#popupinfo2').modalPopLite({
        openButton: '#popupclicker2',
        closeButton: '#close-btn2',
        isModal: true
    });
});
$(function() {
    $('#alertinfo').modalPopLite({
        openButton: '#alertclicker',
        closeButton: '#close-btn3',
        isModal: true
    });
});
$(function() {
    $('#contactinfo').modalPopLite({
        openButton: '#contactclicker',
        closeButton: '#close-btn4',
        isModal: true
    });
});

$(document).ready(function() {

    //Draggable Table from JQuery UI
    $("#table").draggable({
        containment: "parent",
        handle: ".title"
    });
    $("#LayerList").draggable({
        containment: "parent",
        handle: ".title"
    });
    $("#legend").draggable({
        containment: "parent",
        handle: ".title"
    });
    var printertest = $("#printerSettings");
    printertest.draggable({
        containment: "parent",
        handle: ".title"
    });

    //slimScroll Add-on
    $('#bigTable').slimScroll({
        alwaysVisible: true,
        railVisible: true,
        start: $('#large'),
        height: '370px',
        width: '100%',
        size: '10px'
    });
    //initializing search combo box
    enableSelectBoxes();
    $('#disclaimer-content').slimScroll({
        railVisible: true,
        height: '220px',
        width: '100%',
        size: '15px',
        color: "#000",
        railColor: "#666",
        opacity: .6,
        alwaysVisible: true,
        railOpacity: '0.5'
    });
    $('#legendDiv').slimScroll({
        railVisible: true,
        height: '400px',
        width: '100%',
        size: '15px',
        color: "#000",
        railColor: "#666",
        opacity: .6,
        alwaysVisible: true,
        railOpacity: '0.5'
    });
});

$(function() {
    Placeholder.init({
        normal: "#000000",
        placeholder: "#C0C0C0",
        wait: true
    });
});


$(function() {
    $("#tree3").dynatree({
        checkbox: true,
        selectMode: 3,
        children: treeData,
        onSelect: function(select, node) {
            var selKeys = $.map(node.tree.getSelectedNodes(), function(node) {
                return node.data.key;
            });
            var visible = $.map(selKeys, function(key) {
                return parseInt(key);

            });
            if (jQuery.inArray(22, visible) != -1) {
                visible.push(23);
            }
            identifyParams.layerIds = [22, 25, 26, 27, 32];
            if (jQuery.inArray(20, visible) != -1) {
                var zoningPre = getCookie("zoning");
                if (zoningPre != null && zoningPre != "") {
                    identifyParams.layerIds.push(20);
                    /*identifyParams.layerIds.push(20);//add zoning to identify layers*/
                } else {
                    visible.splice(jQuery.inArray(20, visible), 1);
                    //node.toggleSelect();
                    $("#tree3").dynatree("getTree").getNodeByKey("20").toggleSelect();
                    //layervisible=visible;
                    $("#popupinfo2").show();
                    $('#popupclicker2').trigger('click');
                }
            }

            //if there aren't any layers visible set the array value to = -1
            var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 17, 18, 19];
            dojo.forEach(arr, function(a, i) {
                visible.push(a);
            });

            if (visible.length === 0) {
                visible.push(-1);
            }
            layer.setVisibleLayers(visible);
            if (jQuery.inArray(118, visible) != -1) {
                ortho.show();
            } else {
                ortho.hide();
            }
            if (jQuery.inArray(119, visible) != -1) {
                hydrant.show();
            } else {
                hydrant.hide();
            }

            var selRootNodes = node.tree.getSelectedNodes(true);
            var selRootKeys = $.map(selRootNodes, function(node) {
                return node.data.key;
            });

        },
        onDblClick: function(node, event) {
            node.toggleSelect();
        },
        onKeydown: function(node, event) {
            if (event.which == 32) {
                node.toggleSelect();
                return false;
            }
        },
        cookieId: "dynatree-Cb3",
        idPrefix: "dynatree-Cb3-"
    });
});





//$("#close-btn").attr("disabled", "disabled");
$("#continue2").attr("disabled", "disabled");

$("#legendDiv").css("position", "none");
$("#alert").hide();
$("#alert").click(function() {
    $(this).hide();
});
$("#table").hide();
$("#closeTable").click(function() {
    //$("#table").hide('fast',function(){map.graphics.clear();});
    $("#table").hide();
    //$('thead').scrollIntoView();
    $('#table').css("top", 100 + "px");
    $('#table').css("left", 100 + "px");
    $("#bigTable").trigger('scrollContent', [-99]);
});
$("#closeList").click(function() {
    $("#LayerList").hide();
    //$("#LayerList").css("float","right");
    //$("#LayerList").css("right","0px");
    //$("#LayerList").css("top","100px");

    //untoggle layerList checkbox in mapinfo
    $("#mapInfo").find('span.selectOption').each(function() {
        if ($(this).attr('value') == 'LayerList') {
            $(this).find("span").addClass("hiddenspan");
        }
    });

});
$('#index').focus(function() {
    $(this).addClass("orangeBorder");
    var aa = $("#selectedOption")[0].textContent;
    if (aa == null) {
        aa = $("#selectedOption")[0].innerText;
    }
    var bb = "Enter " + aa + " here...";
    if (aa == "Search By:") {
        bb = "Select Search field";
    }
    $(this).attr("placeholder", bb);
    Placeholder.init();
    $(this).css("color", "black");
    //$(this).select();
});
$('#index').blur(function() {
    $(this).removeClass("orangeBorder");
    $(this).css("color", "white");
});
/*$('#index').change(function(){
        $("#go").trigger("mouseover");
        alert("b");
    });*/
$('#index').bind('input', function() {
    //alert("a");
});





$("#closeLegend").click(function() {
    $("#legend").hide();
    //untoggle layerList checkbox in mapinfo
    $("#mapInfo").find('span.selectOption').each(function() {
        if ($(this).attr('value') == 'legend') {
            $(this).find("span").addClass("hiddenspan");
        }
    });

});
//$("#closeLegend").click();

$("#closePrinter").click(function() {
    $("#printerSettings").hide();
    $("#pdfRequestFinished").hide();
    $("#pdfRequest").hide();
    $("#pdfRequestError").hide();
    //dojo.style("pdfRequestFinished", "display", "none");
    //dojo.style("pdfRequest", "display", "none");
    //dojo.style("pdfRequestError", "display", "none");
    document.getElementsByName("mapTitle")[0].value = "My Map";

    //untoggle layerList checkbox in mapinfo
});


$("#loading").hide();

// $("div[title='Maximize']").hide();
//shortcut key "Enter"
$(document).keyup(function(event) {
    if (event.which == 13) {
        gosearch();
    }
}).keydown(function(event) {
    if (event.which == 13) {
        event.preventDefault();
    }
});

//write for IE8
$(".close").click(function() {
    map.infoWindow.hide();
});

$(document).ready(function() {
    $("#popupclicker").hide();
    var mainDisclaimer = getCookie("main");

    if (mainDisclaimer== null || mainDisclaimer == "") {
        $("#popupinfo").show();
        $('#popupclicker').trigger('click');
}
    // $("#popupclicker2").hide();
    // $("#alertclicker").hide();
    // $("#close-btn2").hide();
    // $("#closePrinter").trigger('click');
    //$('.esriPopupWrapper').attr("id","aaaaaa");
    //dijit.byId("agree").setAttribute('disabled',false);
    //$("#agree").attr("disabled","false");

    //$("#submitting").hide();
    //activatePan();
});
//========================================================AMD start here=====================================
var symbol, loading;
var parcelLayer, ortho, hydrant;
var measurement; //06042015
var layer, layer2;
var map, queryTask, query, navToolbar; //, layervisible=[];//easy way to get visible layers in "layer"
var legendDijit;
var infoTemplate;
var handle, startExtent;
var currentGraphic; //This variable is used to store symbol highlighted by strView tool.
var tempGraphic;
//var popupTemplate;
var infoWindow;
var findTask, findParams;
var identifyTask, identifyParams;

var tempcells = -1;
var tempstatus; //control shown level id for selected parcel
var tempFeatures = []; //store graphics related with parcels's searching results
var tempnav, exportMapGP, contactGP;
var snapManager; //06172015
require(["dojo/parser", "dojo/ready", "dojo/dom", "dojo/dom-attr", "dojo/on", "dojo/_base/lang",
    "dojo/dom-construct", "dojo/dom-style", "dojo/data/ItemFileReadStore",
    "dijit/registry",
    "esri/config", "esri/domUtils",
    "esri/units", "esri/geometry/Extent",
    "esri/map","esri/geometry",
    "esri/layers/DynamicLayerInfo",
    "esri/SnappingManager", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/tasks/query", "esri/tasks/IdentifyParameters", "esri/toolbars/navigation",
    "esri/dijit/Scalebar", "esri/dijit/Measurement", "esri/dijit/InfoWindow", "esri/tasks/FindParameters", "esri/dijit/Legend",
    "dijit/Tooltip", "dijit/Dialog", "dijit/ProgressBar", "dijit/Toolbar",
    "dijit/form/FilteringSelect", "dijit/form/CheckBox", "dijit/form/TextBox",
    "myModules/InfoWindow", "utils/symbolutil", 'services/mapservices',
    "dijit/form/Button",
    "dojo/domReady!"
], function(parser, ready, dom, domAttr, on, lang,
    domConstruct, domStyle, ItemFileReadStore,
    registry,
    esriConfig, domUtils,
    units, Extent,
    Map,Geometry,
    DynamicLayerInfo,
    SnappingManager, SimpleFillSymbol, SimpleLineSymbol,
    Query, IdentifyParameters, Navigation,
    Scalebar, Measurement, InfoWindow, FindParameters, Legend,
    Tooltip, Dialog, ProgressBar, Toolbar,
    FilteringSelect, CheckBox, TextBox,
    myInfoWindow, SymbolUtil, mapServices
) {
    //prefered over parseOnload: true in dojoConfig.
    parser.parse();
    ready(function() {

        init();
        setTools();
        esriConfig.defaults.io.proxyUrl = "proxy.ashx";
        //esriConfig.defaults.map.sliderLabel = null;
        esriConfig.defaults.map.sliderStyle = 'large';
        esriConfig.defaults.map.slider = {
            left: "80px",
            top: "20px",
            width: null,
            height: "500px"
        };
        //unknow reason here/
        //$("#continue").text("Continue");
        //$("#ug").text("User Guide");
        $("#agree").removeAttr('disabled');
        $("div.myInfoWindow").draggable({
            containment: "parent",
            handle: ".title"
        }); //Include dojo contents. Has to wait until dojo is ready.
    });

    function init() {
        esriConfig.defaults.geometryService = new esri.tasks.GeometryService("http://map.amherst.ny.us/gallifrey/rest/services/Utilities/Geometry/GeometryServer");

        exportMapGP = mapServices.exportMapGP;
        contactGP = mapServices.contactGP;
        queryTask = mapServices.queryTask;
        identifyTask = mapServices.identifyTask;
        findTask = mapServices.findTask;

        parcelLayer = mapServices.parcelLayer;
        ortho = mapServices.orthoLayer;
        //orthoDummy=mapServices.orthoLayer11;
        hydrant = mapServices.hydrantLayer;
        layer = mapServices.layers;
        //layer.setImageFormat("png32");
        var usgslayer= mapServices.usgsTopo;
        //var usgslayer2=mapServices.usgsTopo2;
        loading = dom.byId("mapLoadingImg");
        symbol = SymbolUtil.renderSymbol();
        startExtent = new Extent({
            "xmin": 1081699,
            "ymin": 1073385,
            "xmax": 1117959,
            "ymax": 1124831,
            "spatialReference": {
                "wkid": 2262
            }
        });

        infoWindow = new myInfoWindow({
            domNode: domConstruct.create("div", null, dom.byId("map"))
        });
        console.log("infoTonggle: " + infoWindow.isContentShowing);
        map = new Map("map", {
            //autoResize:true,
            infoWindow: infoWindow,
            //sliderPosition: "bottom-left",
            //sliderStyle:"large",
        });

        navToolbar = new Navigation(map);
        on(navToolbar, "extent-history-change", extentHistoryChangeHandler);

        //build query filter
        query = new Query();
        query.outSpatialReference = {
            "wkid": 2262
        };
        query.returnGeometry = true;
        query.outFields = ["Printkey", "PARCELID", "GLink", "ONAME1", "PARCELADD", "CPILink"];

        identifyParams = new IdentifyParameters();
        //identifyParams.tolerance = 3;
        identifyParams.tolerance = 0; //prevent for multiple parcels selected
        identifyParams.returnGeometry = true;
        identifyParams.layerIds = [22, 25, 26, 27, 32];
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.width = map.width;
        identifyParams.height = map.height;
        //Create the find parameters
        findParams = new FindParameters();
        findParams.returnGeometry = true;
        findParams.layerIds = [22];
        findParams.searchFields = ["Printkey"];
        findParams.outSpatialReference = map.spatialReference;

        on(map, "update-start", showLoading);
        on(map, "update-end", hideLoading);
        /*06042015*/
        on(map, "load", loadMap);
        /* /06042015*/
        //These are regular buttons, but dijit buttons are different
        on(window, "resize", windowResize);
        //zoning data alert,
        on(dom.byId("return"), 'click', zreturn);
        on(dom.byId("continue2"), 'click', zcontinue);
        //contact dialog buttons
        on(dom.byId("contactclicker"), 'click', startContact);
        on(dom.byId("close-btn4"), 'click', clearContact);
        on(dom.byId("submitContact"), 'click', contact);
        //dry icon
        on(dom.byId("dryicon"), 'click', dryicons);
        //click tutorial
        on(dom.byId("tutorial"), 'click', function() { window.open('http://www.youtube.com/user/AmherstNYGIS', '_blank'); });
        on(dom.byId("helpUG"), 'click', userGuide);
        //contact button, is set as open button for contact dialog, the following set it for more function.
        //topright clicker;
        on(dom.byId("clicker"), 'click', userGuide);

        on(dom.byId("agree"), 'click', accept);
        on(dom.byId("ug"), 'click', userGuide);
        on(dom.byId("continue"), 'click', mcontinue);

        on(dom.byId("exportPDFBtn"), 'click', exportPDF);

        on(dom.byId("agree2"), 'click', accept2);

        //Toolbar
        on(infoWindow, "hide", function() {
            map.graphics.remove(currentGraphic);
        });

        on(dom.byId("go"), 'click', gosearch);

        on(dom.byId("close-btn3"),'click',searchAlertOK);
/*
        usgslayer2.on("load",function(e){
            dynamicLayerInfos = e.target.createDynamicLayerInfosFromLayerInfos();
dynamicLayerInfos[0].minScale=19000;
console.log(dynamicLayerInfos);
        });
        usgslayer2.setMinScale(19000);
console.log(usgslayer2);
*/

        //map.addLayer(orthoDummy);
        //map.addLayer(usgslayer2);
        map.addLayer(ortho);
        map.addLayer(usgslayer);
        map.addLayer(hydrant);
        map.addLayer(layer);

        //TODO
        var div = dom.byId('map_container');
        if (div.addEventListener) {
            //evt.preventDefault();
            div.addEventListener('contextmenu', CPILink, true);
        } else { //previous method, not in use anymore

            if ($.browser.msie && parseInt($.browser.version, 10) === 8) {
                dom.byId('map_container').attachEvent('oncontextmenu', function(evt) {
                    CPILink(evt);
                    window.event.returnValue = false;
                });
            } else {
                dom.byId('map_container').attachEvent('oncontextmenu', function(evt) {
                    CPILink(evt);
                    window.event.returnValue = false;
                });
            }
        }
    }

    function setTools() {
        registry.byId("zoomin").on("click", activateZoomIn);
        //on(dom.byId("zoomin"), 'click', activateZoomIn);
        registry.byId("zoomout").on("click", activateZoomOut);
        registry.byId("zoomfullext").on("click", function() { map.setExtent(startExtent) });
        registry.byId("zoomprev").on("click", function() {
            navToolbar.deactivate();
            navToolbar.zoomToPrevExtent();
        });
        registry.byId("zoomnext").on("click", function() { navToolbar.zoomToNextExtent(); });
        registry.byId("pan").on("click", activatePan);
        registry.byId("identify").on("click", function() {
            navToolbar.deactivate();
            defaultCursor();
            identify();
            tempnav = -1;
        });

        registry.byId("measure").on("click", function() {
            navToolbar.deactivate();
            measure();
            tempnav = -1;
        });
        registry.byId("strView").on("click", function() {
            navToolbar.deactivate();
            defaultCursor();
            startStrView();
            tempnav = -1;
        });
        registry.byId("clear").on("click", function() {
            if (map.graphics) map.graphics.clear();
        });
        registry.byId("printer").on("click", print);
        new Tooltip({ connectId: ["dryicon"], label: "dom" });
        new Tooltip({ connectId: ["zoomin"], label: "Zoom In" });
        new Tooltip({ connectId: ["zoomout"], label: "Zoom Out" });
        new Tooltip({ connectId: ["zoomfullext"], label: "Full Extent" });
        new Tooltip({ connectId: ["zoomprev"], label: "Previous Extent" });
        new Tooltip({ connectId: ["zoomnext"], label: "Next Extent" });
        new Tooltip({ connectId: ["pan"], label: "Pan" });
        new Tooltip({ connectId: ["identify"], label: "Identify" });
        new Tooltip({ connectId: ["measure"], label: "Measure Tool" });
        new Tooltip({ connectId: ["strView"], label: "TriView Tool" });
        new Tooltip({ connectId: ["clear"], label: "Clear Graphics" });
        new Tooltip({ connectId: ["printer"], label: "Print" });
    }

    function identify() {
        if (handle != null) {
            handle.remove();
        }
        handle = on(map, "click", executeQueryIdentifyTask);
        //Listent for infoWindow onHide event
        console.log(map.infoWindow);

        domStyle.set("map_layers", { cursor: "url(images/info_mid.png),help" });
    }

    function startStrView() {
        if (handle != null) {
            // dojo.disconnect(handle);
            handle.remove();
        }
        handle = on(map, 'click', executeQueryTask);
        domUtils.show(dom.byId("alert"));
        domStyle.set("map_layers", { cursor: "url(images/triview3.png),pointer" });
    }

    function activatePan() {
        tempnav = 2;
        //navToolbar.deactivate();
        navToolbar.activate(Navigation.PAN);
        domStyle.set("map_layers", { cursor: "url(images/hand_1.png),move" });
    }

    function activateZoomIn() {
        console.log("activateZoomin");
        tempnav = 0; // use for loading icon hide event.
        navToolbar.deactivate();
        // /dojo.disconnect(handle);
        if (handle != null) {
            handle.remove();
        }
        navToolbar.activate(Navigation.ZOOM_IN);
        domStyle.set("map_layers", { cursor: "url(images/blue_zoom_in.png),zoom-in" });
    }

    function activateZoomOut() {
        tempnav = 1;
        navToolbar.deactivate();
        if (handle != null) {
            handle.remove();
        }
        navToolbar.activate(Navigation.ZOOM_OUT);
        domStyle.set("map_layers", { cursor: "url(images/blue_zoom_out.png),zoom-out" });
    }

    function measure(evt) {
        navToolbar.deactivate();
        if (handle != null) {
            // dojo.disconnect(handle);
            handle.remove();
        }
        map.infoWindow.hide();
        measurement.setTool("area", false);
        measurement.setTool("distance", false);
        measurement.setTool("location", false);
        domUtils.toggle(dom.byId("measurement-div"));
        domStyle.set("map_layers", { cursor: "crosshair" });
    }

    function defaultCursor() {
        domStyle.set("map_layers", { cursor: "default" });

    }

    function showLoading() {
        domUtils.show(loading);
        map.disableMapNavigation();
        //map.hideZoomSlider();
    }

    function hideLoading(error) {
        var legendDiv = document.getElementById("legendUl"); //test
        legendDiv.innerHTML = "";
        makelegend(layer);
        domUtils.hide(loading);
        map.enableMapNavigation();
        if (tempnav == 0) {
            activateZoomIn();
        } else if (tempnav == 1) {
            activateZoomOut();
        } else if (tempnav == 2) {
            activatePan();
        }
        if (tempstatus == 99) {
            map.setLevel(7);
            tempstatus = 0;
        }

        $("#legendDiv").trigger('scrollContent', [-99]);
        $("#legendDiv").trigger('resetBar', [-99]);
    }
    //resize the map when the browser resizes
    // dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
    //TODO auto fill window.
    function windowResize() {
        map.resize();
        map.reposition();
        domStyle.set("map", { "height": window.innerHeight - 20 + "px" });
        domStyle.set("alert", { "left": window.innerWidth / 2 - 505 + "px" });
    }

    function loadMap() {
        measurement = new Measurement({
            map: map,
            defaultLengthUnit: units.FEET
        }, dom.byId('measurement-div'));
        domStyle.set("measurement-div", {
            "position": "absolute",
            "background": "#fff",
            "z-index": "100",
            "left": "115px",
            "top": "25px",
            "width": "290px",
            "height": "150px",
            "padding": "10px 10px 10px 10px",
            "display": "none"
        });
        measurement.startup();
        measurement.resultLabel.setContent("Measurement Result (hold CTRL to snap)"); //06182015
        /*06172015 snappingmanager*/
        snapManager = map.enableSnapping();
        var layerInfosSnap = [{
            layer: parcelLayer
        }];
        snapManager.setLayerInfos(layerInfosSnap);
        /*
        depreciate by Assessor, they perfer continuely measure.
                    measurement.on("measure-end", function(evt) {
                        this.setTool(evt.toolName, false);
                        console.log(evt.toolName+"measure-end event triggered");
                    });
        */
        map.setExtent(startExtent);
        var scalebar = new Scalebar({
            map: map,

        });
    }
    //todo//too verbose with dojo.


    function accept() {
        registry.byId('continue').setAttribute('disabled', !dom.byId("agree").checked);
    }

    function accept2() {
        registry.byId('continue2').setAttribute('disabled', !dom.byId("agree2").checked);
    }

    function dryicons() {
        window.open("http://www.dryicons.com", '_blank');
    }
function userGuide() {
    window.open("doc/User Guide.pdf", "_blank");
}
    function print() {
        domUtils.show(dom.byId("printerSettings"));
        dom.byId('exportPDFBtn').setAttribute('disabled', false);
        // dijit.byId("exportPDFBtn").set("disabled", false);
        dom.byId('pdfRequest').setAttribute('disabled', "none");
    }
function CPILink(evt) {
    map.infoWindow.hide();
console.log("CPI link right click");

    event.preventDefault ? event.preventDefault():(event.returnValue=false);
        var winx = evt.clientX;
        var winy = evt.clientY - 20;


    //var screenPoint=new esri.geometry.Point(evt.screenX, evt.screenY-80);//need to consider screen size as well.
    var screenPoint = new Geometry.Point(winx, winy); //new point
    var mapPoint = map.toMap(screenPoint);
    query.geometry = mapPoint;

    //Execute task and call showResults on completion
    queryTask.execute(query, function(fset) {
        var feature = fset.features[0];
        var attr = feature.attributes;
        map.graphics.remove(currentGraphic);
        //set symbol
        //var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 0, 197]), 2), new dojo.Color([255, 255, 0, 0.5]));
        feature.setSymbol(symbol);

        map.graphics.add(feature);
        currentGraphic = feature;

        window.open(attr['CPILink'], "_blank", 'scrollbars=1,toolbar=0,location=0,menubar=0,left=0px,top=0px,height=' + screen.height + 'px ,width=' + screen.width + 'px');
    console.log(attr['CPILink']);
    });

}
});


//=========================================GLOBAL FUNCTIONS========================================================

function searchAlertOK(){
    $("#close-btn3").trigger('click');
}


function zreturn() {
    setCookie("zoning", "", 1);
    $('#close-btn2').trigger('click');
}

function mcontinue() {
    setCookie("main", "True", 7);
    $('#close-btn').trigger('click');
}
    function zcontinue() {
        setCookie("zoning", "True", 0.125);
        $('#close-btn2').trigger('click');
        $("#tree3").dynatree("getTree").getNodeByKey("20").select();
    }


function setCookie(c_name, value, exdays) {

    var exdate = new Date();
    if (exdays < 1) {
        exdate.setTime(exdate.getTime() + exdays * 24 * 60 * 60 * 1000);
    } else {
        exdate.setDate(exdate.getDate() + exdays);
    }
    var exdate = exdate.toUTCString();

    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate);
    document.cookie = c_name + "=" + c_value;
}
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}


function sortByID(x, y) {
    return ((x.PARCELID == y.PARCELID) ? 0 : ((x.PARCELID > y.PARCELID) ? 1 : -1));
}

function sortByKey(x, y) {
    return ((x.Printkey == y.Printkey) ? 0 : ((x.Printkey > y.Printkey) ? 1 : -1));
}

//custom DataGrid
function fillTable(items) {
    var tdTagStart = '<td>';
    var tdTagEnd = '</td>';

    items.sort(sortByKey); //sort by ID

    var limit = items.length;

    for (var i = 0; i < limit; i++) {
        var row = '<tr width=100% onclick="shownMap(this)">';
        row += '<td width=20%>' + items[i].Printkey + tdTagEnd;
        row += '<td width=29%>' + items[i].PARCELADD + tdTagEnd;
        row += '<td width=41%>' + items[i].ONAME1 + tdTagEnd;

        row += '</tr>';
        var rowCount = $('#large >tbody >tr').length;
        $("#large > tbody:first").append(row);
    }

    $("#large").trigger('update');
}

//Zoom to the parcel when the user clicks a row
function shownMap(evt) {
    map.graphics.remove(tempGraphic);
    var clickedTaxLotId = evt.cells[0].textContent;
    if (clickedTaxLotId == null) {
        clickedTaxLotId = evt.firstChild.outerText;
    }
    var rowIndex = evt.rowIndex;
    //remove highlighted row
    if (tempcells != -1) {
        $('td').removeClass("hover");
    }
    //Highlight selected row
    $(evt.cells).addClass("hover");
    tempcells = rowIndex;

    var selectedTaxLot;

    dojo.forEach(tempFeatures, function(graphic) {
        if ((graphic.attributes) && graphic.attributes.Printkey == clickedTaxLotId) {
            selectedTaxLot = graphic;
            tempGraphic = graphic;
            map.graphics.add(tempGraphic);
            return;
        }
    });
    var taxLotExtent = selectedTaxLot.geometry.getExtent();
    map.setExtent(taxLotExtent, true);
    tempstatus = 99;
}

function clearTable(table) {
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}


function enableSelectBoxes() {
    $('div.selectBox').each(function() {
        $(this).children('span.selected').html("Search By:");
        $(this).attr('value', $(this).children('div.selectOptions').children('span.selectOption:first').attr('value'));

        $(this).children('span.selected,span.selectArrow,span.infoTitle').click(function() {
            if ($(this).parent().children('div.selectOptions').css('display') == 'none') {
                $(this).parent().children('div.selectOptions').css('display', 'block');
            } else {
                $(this).parent().children('div.selectOptions').css('display', 'none');
            }
        });

        $(this).find('span.selectOption').click(function() {
            $(this).parent().css('display', 'none');
            $(this).closest('div.selectBox').attr('value', $(this).attr('value'));
            $(this).parent().siblings('span.selected').html($(this).html());
            var aa = $(this)[0].textContent;
            if (aa == null) {
                aa = $(this)[0].innerText;
            }
            if (aa == "Address" || aa == "SBL" || aa == "Owner Name") {
                $("#index").trigger("focus");
            }
        });
    });
    $("#mapInfo").children('span.infoTitle').html("Map Info/Help");
    $("#mapInfo").find('span.selectOption').click(function() {
        var value = $(this).attr('value');
        $(this).find('span').toggleClass("hiddenspan");
        if ($(this).find('span').css('visibility') == 'hidden') {

            $("#" + value).hide();
        } else {
            $("#" + value).show();
        }
    });
}

function getDropdownValue(selectedOption) {
    var optionValues = ["Printkey", "PARCELADD", "ONAME1"];
    var options = ["SBL", "Address", "Owner Name"]
    var dropdownValue;
    jQuery.each(options, function(i, option) {
        if (option == selectedOption) {
            dropdownValue = optionValues[i];
            return;
        }
    })
    return dropdownValue;
}


function makelegend(layer) {
    var tocDOM = dojo.byId("legendDiv"); //changeto lengendDiv

    esri.request({
        url: layer.url + "/legend",
        content: {
            f: "json"
        },
        handleAs: "json",
        preventCache: true,
        callbackParamName: "callback",
        load: function(response, io) {

            //var newcontent = document.createElement('ul');
            dojo.forEach(response.layers, function(layerInfo, i) {
                var min = layerInfo.minScale;
                if (min == 0) {
                    min = 9999999;
                }
                if (jQuery.inArray(layerInfo.layerId, layer.visibleLayers) != -1 && map.getScale() > layerInfo.maxScale && map.getScale() <= min && layerInfo.layerId > 19) {

                    var legendUl = document.getElementById("legendUl");
                    var newcontent = document.createElement('li');

                    if (layerInfo.legend.length > 1) {
                        newcontent.innerHTML += "<span>" + layerInfo.layerName + "</span>";

                        var newcontent2 = document.createElement('ul');
                        dojo.forEach(layerInfo.legend, function(symbol, n) {
                            newcontent2.innerHTML += "<li><img style=\"vertical-align:middle;\" src='" + layer.url + "/" + layerInfo.layerId + "/images/" + layerInfo.legend[n].url + "'/>&nbsp;" + layerInfo.legend[n].label + "</li>";

                        });
                        newcontent.appendChild(newcontent2);

                    } else {
                        newcontent.innerHTML += "<img style=\"vertical-align:middle;\" src='" + layer.url + "/" + layerInfo.layerId + "/images/" + layerInfo.legend[0].url + "'/>&nbsp;" + layerInfo.layerName;

                    }

                    legendUl.appendChild(newcontent);

                }
            });
        },
        error: function(error, io) {
            tocDOM.innerHTML = "An error occured, please refresh your browser.";
        }
    });
    $("#legendDiv").trigger('resetBar', [-99]);
}

function extentHistoryChangeHandler() {
    dijit.byId("zoomprev").disabled = navToolbar.isFirstExtent();
    dijit.byId("zoomnext").disabled = navToolbar.isLastExtent();
}




function executeQueryIdentifyTask(evt) {
    map.infoWindow.hide();
    $("#mapLoadingImg").show();
    //map.graphics.clear();
    map.graphics.remove(currentGraphic);
    featureSet = null;

    //onClick event returns the evt point where the user clicked on the map.
    //This is contains the mapPoint (esri.geometry.point) and the screenPoint (pixel xy where the user clicked).
    //set query geometry = to evt.mapPoint Geometry
    identifyParams.geometry = evt.mapPoint;
    identifyParams.mapExtent = map.extent;

    //Execute task and call showResults on completion
    identifyTask.execute(identifyParams, function(fset) {
        showQueryIdentifyResult(fset, evt);
    });

}

function showQueryIdentifyResult(fset, evt) {

    map.graphics.remove(currentGraphic);
    var title = "";
    var content = "";
    var printkey = "";

    for (var i = 0, il = fset.length; i < il; i++) {
        var features = fset[i];

        var feature = features.feature;
        var attr = feature.attributes;
        switch (features.layerId) {
            case 22:
                //var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 0, 197]), 2), new dojo.Color([255, 255, 0, 0.5]));
                feature.setSymbol(symbol);
                map.graphics.add(feature);
                currentGraphic = feature;

                if (title != "") {
                    content += "<br />";
                } else {

                }
                printkey = attr.Printkey;
                title = "SBL: " + attr.Printkey;
                content += "Address: " + attr.PARCELADD + "<br />Owner Name: " + attr.ONAME1;

                break;
            case 20:

                if (title != "") {
                    content += "<br />";
                } else {
                    title = "Zoning: " + attr.Zoning;
                }
                content += "Zoning: " + attr.Zoning + "<br />Zoning Definition: " + attr.Definition;
                break;
            case 25:
                if (title != "") {
                    content += "<br />";
                } else {
                    title = "Zip Code: " + attr.ZIPCODE;
                }
                content += "Zip Code: " + attr.ZIPCODE;
                break;
            case 26:
                if (title != "") {
                    content += "<br />";
                } else {
                    title = "School District: " + attr.NAME;
                }
                //content+="School District: "+attr.DISTRICT_N;
                content += "School District: " + attr.NAME;
                break;
            case 27:
                if (title != "") {
                    content += "<br />";
                } else {
                    title = "Fire District: " + attr.DISTRICTNA;
                }
                content += "Fire District: " + attr.DISTRICTNA;
                break;
            case 32:
                if (title != "") {
                    content += "<br />";
                } else {
                    title = "Soil: " + attr.SOIL_NAME;
                }
                content += "Soil: " + attr.SOIL_NAME;
                break;
        }
    }

    if (printkey != "") {
        content += "<br /><br /><a onClick='getCurrentGraphicExtent()'>Zoom to</a>";
    }
    map.infoWindow.setTitle(title);
    map.infoWindow.setContent(content);

    var aa = map.getInfoWindowAnchor(evt.screenPoint);
    (evt) ? map.infoWindow.show(evt.screenPoint, esri.dijit.InfoWindow.ANCHOR_LOWERLEFT): null;
    $("#mapLoadingImg").hide();
}




function executeQueryTask(evt) {
    map.infoWindow.hide();
    map.graphics.remove(currentGraphic);
    featureSet = null;

    //onClick event returns the evt point where the user clicked on the map.
    //This is contains the mapPoint (esri.geometry.point) and the screenPoint (pixel xy where the user clicked).
    //set query geometry = to evt.mapPoint Geometry
    query.geometry = evt.mapPoint;

    //Execute task and call showResults on completion
    queryTask.execute(query, function(fset) {
        showQueryResult(fset.features[0], evt);
    });
    //stop event bubbling
    evt.stopPropagation();

}

function showQueryResult(feature, evt) {
    map.graphics.remove(currentGraphic);

    //set symbol
    //var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 0, 197]), 2), new dojo.Color([255, 255, 0, 0.5]));
    feature.setSymbol(symbol);

    map.graphics.add(feature);
    currentGraphic = feature;

    //construct infowindow title and content
    var attr = feature.attributes;
    //07282015 replace street view from dual map, with the customized google street web page
    ////window.open(attr["GLink"], '_blank','toolbar=0,location=0,menubar=0,left=0px,top=0px,height='+screen.height+'px ,width='+screen.width+'px');
    window.open(attr["GLink"], '_blank', 'toolbar=0,location=0,menubar=0,left=0px,top=0px,height=' + screen.height + 'px ,width=' + screen.width + 'px');
}

function getCurrentGraphicExtent() {
    map.setExtent(currentGraphic.geometry.getExtent(), true);
    tempstatus = 99;
}

function gosearch() {
    $("#mapLoadingImg").show();
    map.infoWindow.hide();
    map.graphics.clear();

    var selectedOption = document.getElementById('selectedOption').textContent;
    if (selectedOption == null) {
        selectedOption = document.getElementById('selectedOption').outerText;
    }
    if (selectedOption == "Search By:") {
        $("#mapLoadingImg").hide();
        return
    }
    var dropdownValue = getDropdownValue(selectedOption);

    var inputValue = document.getElementById("index").value;

    if (inputValue == "") {
        alert("Please input a value!");
        $("#mapLoadingImg").hide();
        return
    }


    findParams.searchFields = [dropdownValue];
    findParams.searchText = inputValue;
    findTask.execute(findParams, showSearchResults);
}

//original
function showSearchResults(results) {
    //This function works with an array of FindResult that the task returns
    map.graphics.clear();
    if (map.infowindow != null) {
        map.infowindow.hide();
    }
    //var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 0, 197]), 2), new dojo.Color([255, 255, 0, 0.5]));

    if (results.length == 0) {
        $("#mapLoadingImg").hide();
        $('#alertinfo').show()
        $('#alertclicker').trigger('click');
        return;
    }
    //create array of attributes
    var items = dojo.map(results, function(result) {
        var graphic = result.feature;
        graphic.setSymbol(symbol);
        tempFeatures.push(graphic);
        return result.feature.attributes;
    });

    //test clearTable
    clearTable(document.getElementById("large"));
    //test fillTable
    fillTable(items);

    if ($(".sorttable_sorted").length > 0) {
        $('.sorttable_sorted').find("span:first-child").remove();
        $('.sorttable_sorted').each(function() {
            $(this).removeClass("sorttable_sorted");
        });
    }
    if ($(".sorttable_sorted_reverse").length > 0) {
        $('.sorttable_sorted_reverse').find("span:first-child").remove();
        $('.sorttable_sorted_reverse').each(function() {
            $(this).removeClass("sorttable_sorted_reverse");
        });
    }

    $("#mapLoadingImg").hide();
    $("#table").show();
    $("#bigTable").trigger('scrollContent', [-99]); //return to top
}

//LixianDai-------------------------------------------------------------------------------------------------------------------

function showSearchResults1(results) {
    //This function works with an array of FindResult that the task returns
    map.graphics.clear();
    if (map.infowindow != null) {
        map.infowindow.hide();
    }
    //var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 0, 197]), 2), new dojo.Color([255, 255, 0, 0.5]));

    if (results.length == 0) {
        $("#mapLoadingImg").hide();
        $('#alertclicker').trigger('click');
        return;
    }
    //create array of attributes
    var items = dojo.map(results, function(result) {
        var graphic = result.feature;
        graphic.setSymbol(symbol);
        tempFeatures.push(graphic);
        return result.feature.attributes;
    });

    //test fillTable //test clearTable
    clearTable(document.getElementById("large"));
    //test fillTable
    fillTable(items);

    map.graphics.remove(tempGraphic);

    var clickedTaxLotId = document.getElementById("index").value; //replase <SBL Number> with the variable that has the SBL number(ex. "28.10-3-12") of the property.

    var selectedTaxLot;

    dojo.forEach(tempFeatures, function(graphic) {
        if ((graphic.attributes) && graphic.attributes.SBL == clickedTaxLotId) {
            selectedTaxLot = graphic;
            tempGraphic = graphic;
            map.graphics.add(tempGraphic);
            return;
        }
    });
    var taxLotExtent = selectedTaxLot.geometry.getExtent();
    map.setExtent(taxLotExtent, true);
    tempstatus = 99;

    if ($(".sorttable_sorted").length > 0) {
        $('.sorttable_sorted').find("span:first-child").remove();
        $('.sorttable_sorted').each(function() {
            $(this).removeClass("sorttable_sorted");
        });
    }
    if ($(".sorttable_sorted_reverse").length > 0) {
        $('.sorttable_sorted_reverse').find("span:first-child").remove();
        $('.sorttable_sorted_reverse').each(function() {
            $(this).removeClass("sorttable_sorted_reverse");
        });
    }

    $("#mapLoadingImg").hide();
    $("#table").show();
    $("#bigTable").trigger('scrollContent', [-99]); //return to top

}

//print start
function getFeatureSet(type) {
    var fset = new esri.tasks.FeatureSet();
    dojo.forEach(map.graphics.graphics, function(graphic) {
        if (graphic.geometry.type === type) {
            fset.features.push(graphic);
        }
    });
    if (fset.features.length > 0) {
        return fset;
    } else {
        return "";
    }
}



var myVar;
//evoked after printer button pressed
function exportPDF(evt) {
    dojo.style("pdfRequestFinished", "display", "none");
    dojo.style("pdfRequestError", "display", "none");
    dojo.style("pdfRequest", "display", "block");
    dijit.byId("exportPDFBtn").set("disabled", true);
    var visiblelayers = {};
    dojo.forEach(map.layerIds, function(layer, i1) {
        var ml = map.getLayer(layer);
        switch (ml.declaredClass) {
            case "esri.layers.ArcGISDynamicMapServiceLayer":
                var s = dojo.forEach(ml.layerInfos, function(sublayer, i2) {
                    if (dojo.indexOf(ml.visibleLayers, sublayer.id.toString()) !== -1) {
                        visiblelayers[sublayer.name] = "True";
                    } else {
                        visiblelayers[sublayer.name] = "False";
                    }

                    if (sublayer.subLayerIds != null) {
                        visiblelayers[sublayer.name] = "True";
                    }
                });
                break;
            default:
                var ov = ml.visible.toString();
                visiblelayers["OrthoBase/NYS_Imagery_2014"] = ov.charAt(0).toUpperCase() + ov.slice(1);
                break;
        }
    });

    var params = {
        "xMin": map.extent.xmin,
        "yMin": map.extent.ymin,
        "xMax": map.extent.xmax,
        "yMax": map.extent.ymax,
        "Spatial_Reference": map.spatialReference.wkid,
        "Map_Scale": esri.geometry.getScale(map),
        "Visiblelayers": dojo.toJson(visiblelayers),
        "Layout": dijit.byId("mapLayout").value,
        "Include_Attributes": true, //dijit.byId("incAttribs").checked,
        "Map_Title": dijit.byId("mapTitle").value,
        "PointGraphics": getFeatureSet("point"),
        "LineGraphics": getFeatureSet("polyline"),
        "PolyGraphics": getFeatureSet("polygon")
    };
    try {
        //Run some code here
        exportMapGP.submitJob(params, pdfCompleteCallback, pdfStatusCallback, pdfErrorCallback);

        myVar = setInterval(function() {
            testtimer()
        }, 5000);
        //1. Add a timer here count to 20s.if pdfdownloadlink is none. get jobid from 1st status. ....
        //2. jump ..... from town's data
        //3. Add a tool(Measure)
    } catch (err) {
        //Handle errors here
        var error = err;
    }

}
var jobinfotemp;
var testcount = 2;

function testtimer() {
    if (testcount == 1) {
        /*exportMapGP.submitJob(params, pdfCompleteCallback, pdfStatusCallback, pdfErrorCallback);*/
    } else {
        exportMapGP.checkJobStatus(jobinfotemp.jobId, pdfStatusCallback, pdfErrorCallback);
    }

    testcount += 1;

}

function pdfCompleteCallback(jobInfo) {
    try {
        if (jobInfo.jobStatus == "esriJobSucceeded") {
            testcount = 1;
            clearInterval(myVar);
            exportMapGP.getResultData(jobInfo.jobId, "PDF", setPdfDownloadLink);
            //var jobId = jobInfo.message.replace(/Job '([a-z,0-9]*)' does not exist or is inaccessible\./, "$1");
            //exportMapGP.checkJobStatus(jobId,pdfStatusCallback,pdfErrorCallback);
        } else {
            pdfErrorCallback();
        }
    } catch (err) {
        var error = err;
    }
}

function pdfStatusCallback(jobInfo) {
    if (testcount == 2) {
        jobinfotemp = jobInfo;
        testcount += 1;
    }
    try {
        if (jobInfo.jobStatus === "esriJobFailed") {
            pdfErrorCallback();
        } else if (jobInfo.jobStatus == "esriJobSucceeded") {
            pdfCompleteCallback(jobInfo);
        } else if (jobInfo.message.search("does not exist or is inaccessible") > -1) {
            //var jobId = jobInfo.message.replace(/Job '([a-z,0-9]*)' does not exist or is inaccessible\./, "$1");
            exportMapGP.checkJobStatus(jobinfotemp.jobId, pdfStatusCallback, pdfErrorCallback);
        }
        /*
                else{
                pdfErrorCallback();
                }*/
    } catch (err) {
        var error = err;
        testcount = 2;
    }
}

function pdfErrorCallback(error) {
    if (error.message.search("does not exist or is inaccessible") > -1) {
        //var jobId = jobInfo.message.replace(/Job '([a-z,0-9]*)' does not exist or is inaccessible\./, "$1");
        //exportMapGP.checkJobStatus(jobId,pdfStatusCallback,pdfErrorCallback);
    } else {
        var err = error;
        dijit.byId("exportPDFBtn").set("disabled", false);
        dojo.style("pdfRequest", "display", "none");
        dojo.style("pdfRequestFinished", "display", "none");
        dojo.style("pdfRequestError", "display", "block");
        testcount = 2;
        clearInterval(myVar);
    }

}

function setPdfDownloadLink(pdf) {
    dijit.byId("exportPDFBtn").set("disabled", false);
    dojo.style("pdfRequest", "display", "none");
    dojo.style("pdfRequestError", "display", "none");
    dojo.style("pdfRequestFinished", "display", "block");
    var pdfurl = pdf.value.url;
    var nurl = pdfurl.replace("glyphcode", "map.amherst.ny.us");
    dojo.byId("pdfLink").href = nurl;
}
//print end

function clearContact() {
    $("#email")[0].value = '';
    $("#name")[0].value = '';
    $("#comments")[0].value = '';
    $("#contactinfo").find("table").show();
    $("#submitting").hide();
    dijit.byId("submitContact").set("disabled", false);
    var a = document.getElementById("antispam");
    a.value = "lalalala";
    clearTimeout(spamDetect);
    $('#close-btn4').trigger('click');
}

function emailValidation(email) {
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
        return false;
    }
    return true;
}

function contact() {
    var a = document.getElementById("antispam");
    if (a.value == "lalalala" || a.value <= 7) {
        alert("Spam!");
        var a = document.getElementById("antispam");
        a.value = "lalalala";
        clearTimeout(spamDetect);
        return;
    }
    var email = $("#email")[0].value;
    var name = $("#name")[0].value;
    var comments = $("#comments")[0].value;

    if (email != "" && name != "" && comments != "") {
        if (emailValidation(email) != true) {
            alert("Invalid email address!");
            return;
        }
    } else {
        alert("Please fill out the form before you submit!");
        return;
    }

    dijit.byId("submitContact").set("disabled", true);
    $("#contactinfo").find("table").hide();
    $("#submitting")[0].innerHTML = "Submitting...";
    $("#submitting").show();

    var params = {
        "Name": name,
        "Email": email,
        "Comments": comments,
        "OS": OSName,
        "Browser": browser
    };
    contactGP.submitJob(params, contactCompleteCallback, contactStatusCallback, contactErrorCallback);
}

function contactCompleteCallback(jobInfo) {
    try {
        if (jobInfo.jobStatus == "esriJobSucceeded") {

            $("#submitting")[0].innerHTML = "Your comment has been submitted.<br /> We will reply you as soon as possible.<br />Thank you!";
        } else {
            contactErrorCallback();
        }
    } catch (err) {
        var error = err;
    }
}

function contactStatusCallback(jobInfo) {
    try {
        if (jobInfo.jobStatus === "esriJobFailed") {
            contactErrorCallback();
        }
    } catch (err) {
        var error = err;
    }
}

function contactErrorCallback(error) {
    $("#submitting")[0].innerHTML = "Failed. Please try again later.";
    var err = error;
}
function startContact(){
    $("#contactinfo").show();
    antiSpam()
}
var spamDetect;

function antiSpam() {
    if (document.getElementById("antispam")) {
        a = document.getElementById("antispam");
        if (isNaN(a.value) == true) {
            a.value = 0;
        } else {
            a.value = parseInt(a.value) + 1;
        }
    }
    spamDetect = setTimeout("antiSpam()", 1000);
}
