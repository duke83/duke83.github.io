(function () {
    "use strict"
    angular.module("common.visualizations")
        .directive('iermChart', function (calculationResource, customerService) {
            return {
                restrict: 'E',
                scope: {},
                template: '<div><div class="iermchartcontainer" style="width:600px;height:400px;"></div><div class="iermchartdata"><grid-data-viewer></grid-data-viewer></div></div>',
                link: function (scp, el, attrs) {


                    //if no chartType is specified, default to 'line'
                    var chartType = attrs.chartType ? attrs.chartType : 'line';

                    //WHEN CERT OR QUARTER CHANGES (INCLUDING INITIAL LOAD)...
                    scp.$watch(function () {
                            return customerService.trigger
                        },
                        //THEN DO THIS...
                        function () {
                            scp.chartConfig = {
                                //renderTo: el[0],//.find('div.iermchartcontainer'),
                                options: {},
                                series: scp.series,
                                xAxis: {
                                    categories: {}
                                },
                                title: {
                                    text: {}
                                },
                                loading: false
                            }
                            var d = new Date();

                            //QUERY CALCULATIONAPI
                            calculationResource.get({
                                    calculationName: attrs.calculationName,
                                    cert: customerService.certNumber,
                                    quarter: customerService.quarter
                                },
                                //CALCULATION API RETURNS dta
                                function (dta) {
                                    scp.gridData = dta;
                                    scp.chartConfig.xAxis.categories = dta.data.xAxis;
                                    scp.chartConfig.title.text = dta.chartTitle;
                                    scp.chartConfig.series = dta.data.seriesArray;
                                   // var title = "three blind mice";
                                    var chart;

                                    var process = function () {
                                        var defaultOptions = {
                                            chart: {renderTo: el[0].querySelector('.iermchartcontainer')}
                                        };
                                        var config = angular.extend(defaultOptions, scp.chartConfig);
                                        chart = new Highcharts.Chart(config);
                                    };

                                    process();

                                    scp.$watch("config.series", function (loading) {
                                        process();
                                    });

                                    scp.$watch("config.loading", function (loading) {
                                        if (!chart) {
                                            return;
                                        }
                                        if (loading) {
                                            chart.showLoading();
                                        } else {
                                            chart.hideLoading();
                                        }
                                    });
                                })
                        });

                }
            }
        })
}());