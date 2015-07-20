'use strict';
angular.module('doodlecalc', []);

angular.module('doodlecalc').directive('calcwidget', function () {
    return {
        restrict: 'E',
        templateUrl: 'calcwidget.html',

        link: function (scp, el, atr) {
            scp.widgetitem = {
                'name': 'kent', 'size': {
                    'x': 3, 'y': 3
                },
                'type': 'calc',
                'widgetTitle': 'testxxx',
                'widgetId': 'c1437061040036kdm@adaptive.codes',
                'onDashboard': true,
                'payload': {
                    'VarName': 'Studio(s)',
                    'ShortDescription': 'Production studio.',
                    'LongDescription': 'Name of the movie studio that produced movie.',
                    'isSelected': true,
                    'widgetId': 'c1437061040036kdm@adaptive.codes'
                },
                'position': {'0': 0, '1': 2}
            };


            //this is not part of the real widget directive
            //scp.widgetitem={
            //    'size':{
            //        'x'
            //            :
            //            3, 'y'
            //        :
            //        3
            //    },
            //    'type':'calc',
            //    'widgetTitle':'testxxx',
            //    'widgetId':'c1437061040036kdm@adaptive.codes',
            //    'onDashboard':true,
            //    'payload':{
            //        'VarName':'Studio(s)',
            //        'ShortDescription':'Production studio.',
            //        'LongDescription':'Name of the movie studio that produced movie.',
            //        'isSelected':true,
            //        'widgetId':'c1437061040036kdm@adaptive.codes'
            //    },
            //    'position':{'0':0, '1': 2}
            //}
        }

    }
        ;
})
;
