(function () {
    "use strict"
    angular.module("common.navigation")
        .directive("subjectSelector",function(customerService){
            return{
                restrict:'E',
                template:'<style>\n    subject-selector{border:1px solid gray; padding:4px;position: fixed; \n        display: inline-block; top: 10px; right:10px;z-index: 100; \n        background-color: #f5f5dc\n    }\n    .inputcontainer input{font-size: small;width:60px; height: 20px;}\n</style>\n<span ng-controller="CertSelectorController">\n\n    <span class="inputcontainer">cert:<input ng-model="customerService.certNumber"></span>  \n    <span  class="inputcontainer">quarter: <input ng-model="customerService.quarter"></span>  \n    <button ng-click="customerService.trigger=!customerService.trigger">go</button>\n    <div>{{customerService.customerName}}</div>\n\n    </span>'
            }
        })
}());