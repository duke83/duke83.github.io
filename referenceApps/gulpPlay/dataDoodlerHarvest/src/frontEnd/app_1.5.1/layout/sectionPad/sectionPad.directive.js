(function () {
    'use strict';
    angular.module('layout.module')
        .directive('sectionPad',['modelService',function(modelService){
            return {
                restrict:'A',
                templateUrl:'app_1.5.1/layout/sectionPad/sectionPad.template.html',
                scope:{sect:'='},
                controller:function($scope){
                    $scope.modelService=modelService;
                    console.log($scope)
                }
            }
        }])
}());
