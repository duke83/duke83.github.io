(function () {
    'use strict';
    angular.module('app')
        .directive('addressSuggestion', function ($rootScope, $http, webConfig, $q) {
            return {
                restrict: 'E',
                scope: {
                    address: "=" // this is the address object from parent
                },

                //TEMPLATE LOCATION IN NERIUM ENVIRONMENT
                //templateUrl: "/partials/address-suggestion-details",
                //~/Nerium.BackOffice/Views/Renderings/Modules/Commerce/AddresSuggestionDetails.cshtml

                //TEMPLATE LOCATION IN STATIC DEV ENVIRONMENT
                templateUrl: "AddressSuggestionDetails.cshtml.html",

                controller: function ($scope, $q) {

                    // Attach the function directly to the address so that the address can check for a suggested address
                    // at any point in it's processing path.
                    // Also, no need for a separate validAddressService.
                    // The promise is resolved if the server returns isValid
                    // OR if the user has expressed approval to override server validation.

                    if (!$scope.address) {
                        $scope.address = {};
                    }


                    // Controls whether the directive UI is shown.  Starts out hidden.
                    $scope.ParentAddressFailsValidation = false;

                    //This is used for unique id's for labels on radio buttons.
                    $scope.addressidentifier = $scope.$id;

                    //addressSource may be "suggested" or "override"
                    $scope.addressSource = "suggested"

                    //Suggested address will be returned from server call.
                    $scope.SuggestedAddress = {};

                    // THIS PROMISE WILL BE RESOLVED WHEN
                    // SOME EXTERNAL PROCESS CHECKS IF ADDRESS IS VALID
                    var hasApproval_deferred = $q.defer();

                    // THIS PROMISE WILL BE RESOLVED WHEN
                    // USER SELECTS THE OK BUTTON
                    var userInput_deferred = $q.defer();

                    //This property allows other fields to disabled until user clicks OK.
                    $scope.address.approvalInProgress = false;

                    // INDICATES IF SERVER RETURNED A SUGGESTED ADDRESS
                    var serverReturnedSuggestedAddress = false;



                    $scope.address.hasApproval = function () {

                        //While the approval process runs, set approvalInProgress to true
                        $scope.address.approvalInProgress = true
                        $scope.address.loading=true;

                        checkServer();
                        return hasApproval_deferred.promise;
                    }


                    //USER CLICKS OK BUTTON
                    $scope.setUserInput = function () {
                        //user must have selected a radio button, UNLESS there was no suggested address, in which case we should automatially select "override"
                        if (!serverReturnedSuggestedAddress) {
                            $scope.addressSource = "override";
                        }
                        if ($scope.addressSource == "suggested" | $scope.addressSource == "override") {

                            //HIDE DIRECTIVE UI
                            $scope.ParentAddressFailsValidation = false;
                            console.log('setting user input.  about to resolve hasApproval_deferred');

                            //NOTIFY OTHER ADDRESS FIELDS TO ONCE AGAIN BE EDITABLE
                            $scope.address.approvalInProgress = false

                            //RESOLVE THE PROMISE
                            hasApproval_deferred.resolve({ hasApproval: true, address: $scope.address });
                        }
                    }


                    function validateShippingAddress(addressDto) {
                        //NERIUM ENVIRONMENT CALL TO VALIDATE SHIPPING ADDRESS
                        //var url = webConfig.digOpsApiUrl;
                        //return $http.post(url + '/AutoOrderManager/ValidateShippingAddress', addressDto);

                        //STATIC DEV MOCK CALL
                        return validateShippingAddressMock(addressDto.mockScenario)
                    }

                    function validateShippingAddressMock (mockScenario) {
                        var deferred = $q.defer();

                        switch (mockScenario) {

                            //Case1: Invalid Address, Suggestion Provided
                            case "Case1":
                            {
                                $timeout(function () {
                                    deferred.resolve({
                                        isValid: false, autoOrderReturnAddressDto: {
                                            address1: "580 Garner Rd",
                                            address2: "yyy",
                                            city: "CJ",
                                            state: "OR",
                                            zip: "92232"
                                        }
                                    });
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



                    function checkServer() {

                        //ok, so we are assuming the spelling on $scope.address properties is a certain way.  This is a point to document.
                        var remappedDto = {
                            AddressLine1: $scope.address.address1,
                            AddressLine2: $scope.address.address2,
                            City: $scope.address.city,
                            CountryCode: 'US',//$scope.address.country,
                            Territory: $scope.address.state,
                            PostalCode: $scope.address.zip
                        };

                        //for testing append mockscenario so that serverApiFake knows which result to return
                        if($scope.address.mockScenario){
                            remappedDto.mockScenario=$scope.address.mockScenario;
                        }

                        validateShippingAddress(remappedDto) //
                            .then(function (data) {

                                console.log('serverApi returns to .then ', data);
                                var objReturned = data.data;

                                //show UI if original address is not valid
                                if (!objReturned.isValid) {
                                    $scope.ParentAddressFailsValidation = true;

                                    //server returns a suggested address
                                    if (objReturned.autoOrderReturnAddressDto) {
                                        $scope.address.watingForUserInputChoice=true;
                                        serverReturnedSuggestedAddress = true;
                                        handleSuggestedAddress(objReturned.autoOrderReturnAddressDto);
                                    }

                                    //serverApi does not return a suggested address
                                    else {
                                        $scope.address.watingForUserInputSingle=true;
                                        $scope.SuggestedAddress = false;
                                    }

                                }

                                //the original address IS valid
                                else {
                                    $scope.ParentAddressFailsValidation = false;
                                    $scope.SuggestedAddress = false;
                                    hasApproval_deferred.resolve({ hasApproval: true });
                                }
                            })
                            .catch(
                            function (errrodata) {
                                console.log('error ', errrodata)
                            })
                    }


                    function handleSuggestedAddress(suggestedAdress) {
                        $scope.SuggestedAddress = {
                            "address1": suggestedAdress.address1,
                            "address2": suggestedAdress.address2,
                            "city": suggestedAdress.city,
                            "state": suggestedAdress.state,
                            "zip": suggestedAdress.zip
                        }
                    }


                    //Triggered by user checking radio button
                    $scope.selectAddress = function () {
                        // $scope.addressSource is 'suggested' | 'override'
                        if ($scope.addressSource === 'suggested') {
                            $scope.address.address1 = $scope.SuggestedAddress.address1;
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