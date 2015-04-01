(function () {
    "use strict";
    angular.module("features.performanceScorecard", ["common.dataServices"])
        .controller("PerformanceScorecardCtrl", ["calculationResource",PerformanceScorecardCtrl]);

    function PerformanceScorecardCtrl(calculationResource) {
        var vm = this;

    }
}());