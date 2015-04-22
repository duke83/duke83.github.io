(function () {
    'use strict';
    angular.module('layout.module')
        .directive('headerBar',['modelService',function(modelService){
            return {
                restrict:'E',
                templateUrl:'app_1.5.1/layout/headerBar/headerBar.template.html',
                controller:function($scope){
                    $scope.modelService=modelService;
                }
            }
        }])
}());
