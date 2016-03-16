/*global define, require, location*/
/*jshint laxcomma:true*/
(function(){
    'use strict';
    var pathRX=new RegExp(/\/[^\/]+$/)
    , locationPath=location.pathname.replace(pathRX,'');

    require({
        packages:[{
            name:'app',
            location:locationPath+'/js',
            main:'main'
        }]
    },['app']);

})();
