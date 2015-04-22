(function () {
    'use strict';
    angular.module('dataDoodler.module')
        .directive('glossary',['modelService','glossaryService',function(modelService,glossaryService){
            return {
                restrict:'E',
                templateUrl:'app_1.5.1/glossary/glossary.template.html',
                scope:{},
                controller:function($scope){
                    $scope.dataSources=modelService.dataSources;
                    $scope.glossary=glossaryService.getGlossary($scope.dataSources);
                    console.log($scope);
                }
            }
        }])
}());
