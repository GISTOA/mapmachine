/*global define, require, location*/
/*jshint laxcomma:true*/
(function(){
    'use strict';
    var pathRX=new RegExp(/\/[^\/]*$/)
    , locationPath=location.pathname.replace(pathRX,'');

    require({
        packages:[{
            name:'utils',
            location: locationPath+'/js/utils',
        },{
            name:'controllers',
            location: locationPath+'/js/controllers',
        },{
            name:'services',
            location: locationPath+'/js/services',
        },{
            "name": "myModules",
            "location": locationPath + "/myModules",
        },{
            name:'app',
            location:locationPath+'/js',
            main:'main'
        }]
    },['app']);

})();
