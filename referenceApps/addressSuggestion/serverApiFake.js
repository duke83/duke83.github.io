(function () {
    angular.module('app')
        .factory('serverApi', ['$q', '$timeout', function ($q, $timeout) {

            var serverApi = {};

            serverApi.returnForInvalidAddressSuggestionProvided = {
                isValid: false, autoOrderReturnAddressDto: {
                    address1: "580 Garner Rd",
                    address2: "yyy",
                    city: "CJ",
                    state: "OR",
                    zip: "92232"
                }
            };

            serverApi.validateShippingAddress = function (mockScenario) {
                var deferred = $q.defer();

                switch (mockScenario) {

                    //Case1: Invalid Address, Suggestion Provided
                    case "Case1":
                    {
                        $timeout(function () {
                            deferred.resolve(serverApi.returnForInvalidAddressSuggestionProvided );
                        }, 1234);
                        return deferred.promise;
                    }

                    //Case2: Invalid Address, No Suggestion Provided
                    case "Case2":
                    {
                        $timeout(function () {
                            deferred.resolve({
                                isValid: false
                            });
                        }, 1234);
                        return deferred.promise;

                    }

                    //Case3: Valid Address
                    case "Case3":
                    {
                        $timeout(function () {
                            deferred.resolve({
                                isValid: true
                            });
                        }, 1234);
                        return deferred.promise;

                    }
                }
            };

            return serverApi;
        }])
}());

