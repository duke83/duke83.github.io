(function () {
    'use strict';
    angular.module('app')
        .directive('addressSuggestion', function ($rootScope, serverApi, $q) {
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
                    $scope.addressidentifier=$scope.$id;
                    $scope.SuggestedAddress = {};

                    // THIS PROMISE WILL BE RESOLVED WHEN
                    // SOME EXTERNAL PROCESS CHECKS IF ADDRESS IS VALID
                    var hasApproval_deferred = $q.defer();

                    // THIS PROMISE WILL BE RESOLVED WHEN
                    // USER SELECTS THE OK BUTTON
                    var userInput_deferred = $q.defer();



                    $scope.address.hasApproval = function () {
                        checkServer();
                        return hasApproval_deferred.promise;
                    }



                    //THIS IS CALLED WHEN USER CLICKS OK BUTTON
                    $scope.setUserInput = function () {
                        //user must have selected a radio button
                        if($scope.addressSource=="suggested" | $scope.addressSource=="override"  ) {
                            //HIDE DIRECTIVE UI
                            $scope.ParentAddressFailsValidation = false;
                            console.log('setting user input.  about to resolve hasApproval_deferred');
                            hasApproval_deferred.resolve({hasApproval: true, address:$scope.address});
                        }
                    }


                    function checkServer() {

                        //ok, so we are assuming the spelling on $scope.address properties is a certain way.  This is a point to document.
                        var remappedDto = {
                            AddressLine1: $scope.address.address1,
                            AddressLine2: $scope.address.address2,
                            City: $scope.address.city,
                            CountryCode: $scope.address.country,
                            Territory: $scope.address.state,
                            PostalCode: $scope.address.zip
                        };

                        serverApi.validateShippingAddress(remappedDto) //
                            .then(function (data) {
                                console.log('serverApi returns to .then ', data);

                                //show UI if original address is not valid
                                if (!data.isValid) {
                                    $scope.ParentAddressFailsValidation = true;

                                    //serverApi may not always return a suggested address
                                    if(data.autoOrderReturnAddressDto) {
                                        handleSuggestedAddress(data.autoOrderReturnAddressDto);

                                    }
                                    //then, only allow address resolution when user clicks OK
                                }

                                //the original address IS valid
                                else{
                                    $scope.ParentAddressFailsValidation = false;
                                    $scope.SuggestedAddress = false;
                                    hasApproval_deferred.resolve({isValid:true});
                                }
                            })
                            .catch(
                            function (errrodata) {
                                console.log('oh damn, ', errrodata)
                            })
                    }

                    function handleSuggestedAddress(suggestedAdress){
                            $scope.SuggestedAddress = {
                                "address1": suggestedAdress.address1,
                                "address2": suggestedAdress.address2,
                                "city": suggestedAdress.city,
                                "state": suggestedAdress.state,
                                "zip": suggestedAdress.zip
                        }}



                    //Triggered by user checking radio button
                    $scope.selectAddress = function () {
                        // $scope.addressSource is 'suggested' | 'override'
                        if ($scope.addressSource === 'suggested') {
                            $scope.address.address1 = SuggestedAddress.address1;
                            $scope.address.address2 = $scope.SuggestedAddress.address2;
                            $scope.address.city = $scope.SuggestedAddress.city;
                            $scope.address.state = $scope.SuggestedAddress.state;
                            $scope.address.zip = $scope.SuggestedAddress.zip;
                        }
                        if ($scope.addressSource === 'override') {
                            //just leave the values on $scope.address
                        }
                    }
                }
            }
        })
}());