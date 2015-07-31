(function() {
    'use strict';

    angular.module('app').directive('bloomingMenu', function(){
        return{
            restrict:'E',
            templateUrl:"bloomingMenu.template.html",
            controller:function($scope){
                $scope.selectme=function(btnText){
                    console.log(btnText)
                }
            },
            link:function(scp,el,attr){
                scp.active=false;



            }
        }
    });


})();
