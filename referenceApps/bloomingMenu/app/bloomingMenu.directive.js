(function() {
    'use strict';

    angular.module('app').directive('bloomingMenu', function(){
        return{
            restrict:'E',
            templateUrl:"bloomingMenu.template.html",
            link:function(scp,el,attr){
                scp.active=true;
            }
        }
    });


})();