(function () {
    'use strict';
    angular.module('app')
        .directive('horizontalImageScroller', function () {
            return {
                restrict: 'E',
                templateUrl: 'horizontalImageScroller.html',
                scope: {},

                link: function (scp, el, attr) {

                    // visibleItemsLength is used to configure the maximum number of items this directive will show at one time.
                    var visibleItemsLength = Number(attr.viewableItemsLength);

                    //The items is a JSON array that exists in the window scope.  It is written in a razor file that is fed from sitecore
                    scp.allItems = window[attr.itemsObjectName];
                    if(!scp.allItems || scp.allItems.length===0)
                    {
                        visibleItemsLength=1;
                        scp.allItems = [
                            {"description":"","imageUrl":""}
                        ]
                    }

                    if(visibleItemsLength>scp.allItems.length && scp.allItems.length >0)
                    {
                        visibleItemsLength = scp.allItems.length
                    }

                    scp.title = attr.title;
                    scp.imageHeight = parseInt(attr.imageHeight) + 'px'


                    scp.visibleItems = [];
                    for (var i = 0; i < visibleItemsLength; i++) {
                        scp.visibleItems.push(scp.allItems[i]);
                    }

                    if (scp.allItems.length === visibleItemsLength) {
                        setArrowColor('right', 'disabled');
                    }

                    scp.firstItemIndex = {value: 0};

                    scp.advanceLeft = function () {
                        checkSelection();
                        if (scp.firstItemIndex.value > 0) {
                            if (scp.firstItemIndex.value === 1) {
                                setArrowColor('left', 'disabled')
                            }
                            if (scp.firstItemIndex.value === scp.allItems.length - visibleItemsLength) {
                                setArrowColor('right', 'enabled')
                            }
                            scp.firstItemIndex.value = scp.firstItemIndex.value - 1;
                            scp.visibleItems.splice(visibleItemsLength - 1, 1);
                            scp.visibleItems.unshift(scp.allItems[scp.firstItemIndex.value])
                        }
                    };

                    scp.advanceRight = function () {
                        checkSelection();

                        if (scp.firstItemIndex.value < (scp.allItems.length - visibleItemsLength)) {
                            if (scp.firstItemIndex.value === 0) {
                                setArrowColor('left', 'enabled')
                            }
                            if (scp.firstItemIndex.value === scp.allItems.length - visibleItemsLength - 1) {
                                setArrowColor('right', 'disabled')
                            }
                            scp.firstItemIndex.value = scp.firstItemIndex.value + 1;
                            scp.visibleItems.splice(0, 1)
                            scp.visibleItems.push(scp.allItems[scp.firstItemIndex.value + visibleItemsLength - 1])
                        }
                    }

                    function checkSelection() {
                        var sel = {};
                        if (window.getSelection) {
                            // Mozilla
                            sel = window.getSelection();
                        } else if (document.selection) {
                            // IE
                            sel = document.selection.createRange();
                        }

                        // Mozilla
                        if (sel.rangeCount) {
                            sel.removeAllRanges();
                            return;
                        }

                        // IE
                        if (sel.text > '') {
                            document.selection.empty();
                            return;
                        }
                    }

                    function setArrowColor(leftOrRight, enabledOrDisabled) {
                        var arrow;
                        if (leftOrRight.toUpperCase() === "LEFT") {
                            arrow = $(el).find("[name='arrowLeft']")
                        }
                        else {
                            arrow = $(el).find("[name='arrowRight']")
                        }

                        if (enabledOrDisabled.toUpperCase() == "ENABLED") {
                            $(arrow).attr('class', '');
                            $(arrow).attr('class', 'horizontal-image-scroller-arrow-enabled');
                        }
                        else {
                            $(arrow).attr('class', '');
                            $(arrow).attr('class', 'horizontal-image-scroller-arrow-disabled');
                        }
                    }
                }


            }
        })
}());
