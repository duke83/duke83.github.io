//iermClientApp.js
(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('iermClientApp', [
        'ui.router',
        'features.performanceScorecard',
        'features.dashboard',
        'common.dataServices',
        'common.visualizations',
        'common.navigation',
        'calculationResourceMock'

    ])
        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state("performanceScorecard", {
                    url: "/performanceScorecard",
                    templateUrl: "features/performanceScorecard/performanceScorecard.tpl.html",
                    controller: "PerformanceScorecardCtrl",
                    controllerAs: "vm"
                })
                .state("dashboard", {
                    url: "/dashboard",
                    templateUrl: "features/dashboard/dashboard.tpl.html",
                    controller: "DashboardCtrl",
                    controllerAs: "vm"
                })
        }])
        .controller('CertSelectorController',function($scope,customerService){
            $scope.customerService = customerService;

        })
}()
);
