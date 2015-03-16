(function(){angular.module('app')
    .factory('serverApi',  ['$q','$timeout',function ($q,$timeout) {

        var serverApi = {};

        serverApi.validateShippingAddress = function () {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve({isValid: false,autoOrderReturnAddressDto: {
                    address1: "580 Garner Rd",
                    address2: "yyy",
                    city: "CJ",
                    state: "OR",
                    zip: "92232"
                }});
                //deferred.reject({'myerrorfromvalidatio':false})
            }, 1234);
            return deferred.promise;
        };

        return serverApi;
    }])}());
