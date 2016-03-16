/*global define, require, location*/

(function() {
    "use strict";
    var pathRX = new RegExp(/\/[^/]*$/),
        locationPath = location.pathname.replace(pathRX, '');
    require({
        //async:true,
        packages: [
        {
            name: 'myModules',
            location: locationPath + '/myModules'
        },{
            name:'controllers',
            location: locationPath+'/js/controllers'
        },{
            name:'services',
            location:locationPath+'/js/services'
        },{
            name:'utils',
            location:locationPath+'/js/utils'
        },{
            name:'app',
            location:locationPath+'/js',
            main:'main'
        }]
    },['app']);
})();
