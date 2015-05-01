(function () {
    'use strict';
    angular.module('app')
        .directive('horizontalImageScroller', function () {
            return {
                restrict: 'E',
                templateUrl: 'horizontalImageScroller.html',
                scope: {},
                controllerAs: 'vm',
                bindToController: true,
                controller: function () {
                    var vm = this;
                    vm.cnt = 100;
                },
                link: function (scp, el, attr) {
                    var viewableItemsLength = attr.viewableItemsLength;
                    scp.items = window[attr.itemsObjectName];

                    scp.itemIsInWindow = function (idx) {
                        if (idx < scp.currentItem.value + viewableItemsLength)
                            return true;
                            else
                            return false;
                    };

                    scp.currentItem = {value: 0};

                    scp.advanceRight = function () {
                        scp.currentItem.value = scp.currentItem.value + 1;
                    }
                }

            }
        })
}());
