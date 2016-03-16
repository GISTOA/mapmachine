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

        },{
            name:'app',
            location:locationPath+'/js',
            main:'main'
        }]
    },['app']);
})();
