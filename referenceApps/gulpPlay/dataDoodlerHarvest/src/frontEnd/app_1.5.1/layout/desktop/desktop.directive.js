(function () {
    'use strict';
    angular.module('layout.module')
        .directive('desktop',['modelService',function(modelService){
            return {
                restrict:'E',
                templateUrl:'app_1.5.1/layout/desktop/desktop.template.html',
                controller:function($scope){
                    $scope.modelService=modelService;

                }
            }
        }])
}());
