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
                    scp.items = window[attr.itemsObjectName];

                    scp.imageHeight=parseInt(attr.imageHeight) + 'px'

                    scp.itemIsInWindow = function (idx) {
                        if (idx < scp.currentItem.value + viewableItemsLength && !(idx < scp.currentItem.value)) {
                            return true;
                        }
                        return false;
                    };

                    scp.currentItem = { value: 0 };

                    scp.advanceLeft = function () {
                        if(scp.currentItem.value>0)
                        scp.currentItem.value = scp.currentItem.value - 1;
                    };

                    scp.advanceRight = function () {
                        if(scp.currentItem.value<(scp.items.length-viewableItemsLength))
                        scp.currentItem.value = scp.currentItem.value + 1;
                    }
                }


            }
        })
}());
