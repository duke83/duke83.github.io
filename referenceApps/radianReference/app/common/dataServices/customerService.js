(function () {
    "use strict";
    angular.module("common.dataServices")
        .factory("customerService", function($http) {
            var _customerName = "nbc";
            var _certNumber = '1234';
            var _quarter = '2014Q4';
            return {
                customerName: _customerName,
                certNumber: _certNumber,
                quarter: _quarter,
                trigger:true
            }
        })
}
());