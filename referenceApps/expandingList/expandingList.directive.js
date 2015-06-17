var app = angular.module('app', []);

app.controller('outsideController', ['$scope', function ($scope) {

    $scope.categories = [
        {
            description: 'Category1 KR', id: 'cat1', isSelected: true, subcategories: [
            {subCategoryDisplayName: "Conference Call _ Corporate", subCategoryId: "subcatid1"},
            {subCategoryDisplayName: "Conference Call _ Team Nerium", subCategoryId: "subcatid2"}
        ]
        },
        {
            description: 'Category2 KR', id: 'cat2', isSelected: false, subcategories: [
            {subCategoryDisplayName: "Conference Call _ Corporate3", subCategoryId: "subcatid3"},
            {subCategoryDisplayName: "Conference Call _ Team Nerium4", subCategoryId: "subcatid4"}
        ]
        }
    ];



    $scope.updateselected = function (xx,yy) {
        console.log('updateselected', arguments);

        //alert('click')
    }
}]);

(function () {
    'use strict';
    angular.module('app')
        .directive('assetCategory', function () {
            return {
                restrict: 'E',
                scope: {
                    cat: "=", //category is bound to parent
                    slct:"&"},
                template: "<h1 ng-bind=\'cat.description\' ng-click=\'clickCat()\'></h1>\n<div ng-repeat=\'scat in subcats\' \n     ng-click=\'clickSubCat(scat)\' \n     ng-bind=\'scat.subCategoryDisplayName\'>    \n</div>",
                link: function (scp, el, attr) {
                    scp.subcats = scp.cat.subcategories;

                    scp.clickCat=function(cat){
                        scp.selectedcat=scp.cat;
                        scp.slct({selectedobj:scp.selectedcat})
                    }

                    scp.clickSubCat = function (scat) {
                        //console.log('scat',scat);
                        scp.selectedsubcat="merrell";
                        scp.slct({selectedobj:scat})
                    }
                }

            }
        })
}());