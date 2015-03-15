(function () {
    'use strict';
    angular.module('app')
        .directive('validAddress', function ($rootScope, serverApi, $q) {
            return {
                restrict: 'E',
                scope: {
                    address: "=" // this is the address object from parent
                },

                templateUrl: "ValidAddressDirective.html",
                controller: function ($scope, $q) {


                    //Attach the function directly to the address so that the address can check for a suggested address
                    // at any point in it's processing path.
                    // Also, no need for a separate validAddressService.

                    // The promise is resolved if the server returns isValid
                    // OR if the user has expressed approval to override server validation.
                    //$scope.address.hasApproval = function () {
                    //    var deferred = $q.defer();
                    //
                    //    serverApi.validateShippingAddress($scope.address)
                    //        .then(function (data) {
                    //            console.log('serverApi returns to .then ', data)
                    //            $scope.ParentAddressFailsValidation=true;
                    //            $scope.SuggestedAddress=true;
                    //        })
                    //        .catch(
                    //        function (errrodata) {
                    //            console.log('oh damn, ', errrodata)
                    //        })
                    //
                    //    return deferred.promise;
                    //};
                    //
                    //


                    // THIS PROMISE WILL BE RESOLVED WHEN
                    // SOME EXTERNAL PROCESS CHECKS IF ADDRESS IS VALID
                    var hasApproval_deferred = $q.defer();

                    // THIS PROMISE WILL BE RESOLVED WHEN
                    // USER SELECTS THE OK BUTTON
                    var userInput_deferred = $q.defer();



                    $scope.address.hasApproval = function () {
                        $scope.ParentAddressFailsValidation=true;
                        $scope.SuggestedAddress=true;

                        return hasApproval_deferred.promise;
                    }



                    $scope.setUserInput = function () {
                        console.log('setting user input.  about to resolve hasApproval_deferred');
                        hasApproval_deferred.resolve({result:'test1'});
                        //userInput_deferred.resolve({result: true})
                    }


                    function checkServer() {
                        serverApi.validateShippingAddress($scope.address) //
                            .then(function (data) {
                                console.log('serverApi returns to .then ', data)

                                //show UI if original address is not valid
                                if (!data.isValid) {
                                    $scope.ParentAddressFailsValidation = true;
                                    //then, only allow address resolution when user clicks OK

                                }
                                $scope.SuggestedAddress = true;
                            })
                            .catch(
                            function (errrodata) {
                                console.log('oh damn, ', errrodata)
                            })


                    }


                    $scope.GetSuggestedAddress = function () {
                        $scope.SuggestedAddress = null;

                        //ok, so we are assuming the spelling on $scope.address properties is a certain way.  This is a point to document.
                        var remappedDto = {
                            AddressLine1: $scope.address.address1,
                            AddressLine2: $scope.address.address2,
                            City: $scope.address.city,
                            CountryCode: $scope.address.country,
                            Territory: $scope.address.state,
                            PostalCode: $scope.address.zip
                        };

                        serverApi.validateShippingAddress(remappedDto)
                            .success(function (addressValidityData) {
                                if (addressValidityData) {
                                    if (addressValidityData.isValid) {
                                        $scope.address.userApproved = true;
                                        return;
                                    }
                                    $scope.ParentAddressFailsValidation = true; //binding to show directive UI

                                    //serverApi may not always return a suggested address
                                    if (addressValidityData.autoOrderReturnAddressDto) {
                                        $scope.SuggestedAddress = {
                                            "address1": addressValidityData.autoOrderReturnAddressDto.address1,
                                            "address2": addressValidityData.autoOrderReturnAddressDto.address2,
                                            "city": addressValidityData.autoOrderReturnAddressDto.city,
                                            "state": addressValidityData.autoOrderReturnAddressDto.state,
                                            "zip": addressValidityData.autoOrderReturnAddressDto.zip
                                        }
                                    }
                                    ;
                                    return;
                                }
                            })
                            .error(function (addressValidityData) {
                                console.log(addressValidityData.message);
                            });
                    };

                    //Triggered by user checking radio button
                    $scope.selectAddress = function () {
                        // $scope.addressSource is 'suggested' | 'override'
                        if ($scope.addressSource === 'suggested') {
                            $scope.address.address1 = angular.copy($scope.SuggestedAddress.address1);
                            $scope.address.address2 = angular.copy($scope.SuggestedAddress.address2);
                            $scope.address.city = angular.copy($scope.SuggestedAddress.city);
                            $scope.address.state = angular.copy($scope.SuggestedAddress.state);
                            $scope.address.zip = angular.copy($scope.SuggestedAddress.zip);
                        }
                        if ($scope.addressSource === 'override') {
                            //just leave the values on $scope.address
                        }
                    }
                }
            }
        })
}());