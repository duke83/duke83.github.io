(function () {
    "use strict"
    angular.module("common.visualizations")
        .directive('gridDataViewer',function(){
            return{
                restrict:'E',
                templateUrl:'./common/visualizations/gridDataViewer.template.html'
            }
        })
}());