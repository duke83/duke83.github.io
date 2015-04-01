(function () {
    "use strict";
    angular.module("features.dashboard")
        .controller("DashboardCtrl", ["calculationResource",DashboardCtrl]);
    function DashboardCtrl(calculationResource) {
        var vm = this;

        vm.AllCharts=[
            'ReturnOnAssets',
            'YieldOnLoans',
            'NetInterestMargin',
            'OverheadExpense_AverageAssets',
            'Alll_TotalLoans',
            'ProvisionExpense_AverageLoans',
            'NetChargeOffs_TotalLoans',
            'LeverageRatio',
            'TotalRiskBasedCapitalRatio',
            'TexasRatio',
            'AssetGrowth',
            'EfficiencyRatio',
            'Asset_Employee',
            'DepositConcetrationRatio',
            'LoanToDepositRatio',
            'PledgedSecurities_TotalSecurities',
            'LoanGrowth',
            'DepositGrowth'
        ]

    }
}());