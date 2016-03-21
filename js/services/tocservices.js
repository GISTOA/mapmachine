/*global define */
define(['esri/request'], function(
    esriRequest
) {
    'use strict';
    //TODO// hold for now tree is using jQuery, come back when use toc  tool for dojo
    return {
        getTree: function() {
            return esriRequest({
                url: 'data/data.json',
                handleAs: 'json'
            });
        }
    };
});
