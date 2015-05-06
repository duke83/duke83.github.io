(function () {
    'use strict';
    angular.module('app')
        .directive('horizontalImageScroller', function () {
            return {
                restrict: 'E',
                templateUrl: 'horizontalImageScroller.html',
                scope: {},

                link: function (scp, el, attr) {

                    // visableItemsLength is used to configure the maximum number of items this directive will show at one time.
                    var visableItemsLength = Number(attr.viewableItemsLength);

                    //The items is a JSON array that exists in the window scope.  It is written in a razor file that is fed from sitecore
                    scp.allItems = window[attr.itemsObjectName];

                    scp.title=attr.title;
                    scp.imageHeight = parseInt(attr.imageHeight) + 'px'


                    scp.visibleItems = [];
                    for (var i = 0; i < visableItemsLength; i++) {
                        scp.visibleItems.push(scp.allItems[i]);
                    }



                    scp.firstItemIndex = {value: 0};

                    scp.advanceLeft = function () {
                        if (scp.firstItemIndex.value > 0){
                            scp.firstItemIndex.value = scp.firstItemIndex.value - 1;
                            scp.visibleItems.splice(visableItemsLength-1,1);
                            scp.visibleItems.unshift(scp.allItems[scp.firstItemIndex.value])
                        }
                    };

                    scp.advanceRight = function () {
                        if (scp.firstItemIndex.value < (scp.allItems.length - visableItemsLength))
                            scp.firstItemIndex.value = scp.firstItemIndex.value + 1;
                            scp.visibleItems.splice(0,1)
                            scp.visibleItems.push(scp.allItems[scp.firstItemIndex.value + visableItemsLength-1])
                    }
                }


            }
        })
}());
