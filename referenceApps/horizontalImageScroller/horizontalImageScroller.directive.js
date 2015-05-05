(function () {
    'use strict';
    angular.module('app')
        .directive('horizontalImageScroller', function () {
            return {
                restrict: 'E',
                templateUrl: 'horizontalImageScroller.html',
                scope: {},

                link: function (scp, el, attr) {

                    // viewableItemsLength is used to configure the maximum number of items this directive will show at one time.
                    var viewableItemsLength = Number(attr.viewableItemsLength);

                    //The items is a JSON array that exists in the window scope.  It is written in a razor file that is fed from sitecore
                    scp.allItems = window[attr.itemsObjectName];

                    scp.imageHeight=parseInt(attr.imageHeight) + 'px'


                    scp.visibleItems=[];
                    for(var i=0;i<4;i++){
                        scp.visibleItems.push(scp.allItems[i]);
                    }



                    scp.itemIsInWindow = function (idx) {
                        if (idx < scp.firstItemIndex.value + viewableItemsLength && !(idx < scp.currentItem.value)) {
                            return true;
                        }
                        return false;
                    };

                    scp.firstItemIndex= { value: 0 };

                    scp.advanceLeft = function () {
                        if(scp.firstItemIndex.value>0)
                        scp.firstItemIndex.value = scp.firstItemIndex.value - 1;
                    };

                    scp.advanceRight = function () {
                        if(scp.firstItemIndex.value<(scp.items.length-viewableItemsLength))
                        scp.firstItemIndex.value = scp.firstItemIndex.value + 1;
                    }
                }


            }
        })
}());
