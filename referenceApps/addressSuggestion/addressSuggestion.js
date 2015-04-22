(function () {
    'use strict';
    angular.module('app')
        .directive('addressSuggestion', function ($rootScope, $http, webConfig, $q, $timeout) {
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


                    //This is used for unique id's for labels on radio buttons.
                    $scope.addressidentifier = $scope.$id;

                    //addressSource may be "suggested" or "original"
                    $scope.addressSource = "suggested"

                    //Suggested address will be returned from server call.
                    $scope.SuggestedAddress = {};

                    // THIS PROMISE WILL BE RESOLVED WHEN
                    // SOME EXTERNAL PROCESS CHECKS IF ADDRESS IS VALID
                    var hasApproval_deferred = $q.defer();

                    // THIS PROMISE WILL BE RESOLVED WHEN
                    // USER SELECTS THE OK BUTTON
                    //var userInput_deferred = $q.defer();

                    //This property allows other fields to disabled until user clicks OK.
                    $scope.address.approvalInProgress = false;

                    // INDICATES IF SERVER RETURNED A SUGGESTED ADDRESS
                    var serverReturnedSuggestedAddress = false;


                    $scope.address.hasApproval = function () {

                        //While the approval process runs, set approvalInProgress to true
                        $scope.address.approvalInProgress = true
                        $scope.address.loading = true;

                        checkServer();
                        return hasApproval_deferred.promise;
                    }


                    //USER CLICKS CANCEL BUTTON
                    $scope.cancel=function(){
                        $scope.suggestedAddress={};
                        $scope.originalAddress={};
                        $scope.address.approvalInProgress = false
                        $scope.address.loading = false;
                        $scope.address.waitingForUserInputChoice=false;
                        $scope.address.waitingForUserInputSingle=false;
                        //hasApproval_deferred.reject({'reason':'user canceled'});

                    }

                    //USER CLICKS OK BUTTON
                    $scope.clickOk = function (manualAddressSource) {
                        //IF THERE IS NO SUGGESTED ADDRESS THEN THERE IS NO TOGGLE BETWEEN ORIGINAL AND SUGGESTED.
                        //THIS HAPPENS IN Case2: Invalid Address, No Suggestion Provided
                        //IN THIS CASE USE THE manualAddressSource PARAMETER TO SPECIFY INTENT

                        if(manualAddressSource=="original"){
                            $scope.address.address1=$scope.originalAddress.address1;
                            $scope.address.address2=$scope.originalAddress.address2;
                            $scope.address.city=$scope.originalAddress.city;
                            $scope.address.state=$scope.originalAddress.state;
                            $scope.address.zip=$scope.originalAddress.zip;
                        }
                        else {
                            if ($scope.addressSource == "original") {
                                //original is already mapped to orginal, but we refill it anyway, just in case containing page forgot to disable address fields
                                $scope.address.address1 = $scope.originalAddress.address1;
                                $scope.address.address2 = $scope.originalAddress.address2;
                                $scope.address.city = $scope.originalAddress.city;
                                $scope.address.state = $scope.originalAddress.state;
                                $scope.address.zip = $scope.originalAddress.zip;
                            }
                            if ($scope.addressSource == "suggested") {
                                $scope.address.address1 = $scope.suggestedAddress.address1;
                                $scope.address.address2 = $scope.suggestedAddress.address2;
                                $scope.address.city = $scope.suggestedAddress.city;
                                $scope.address.state = $scope.suggestedAddress.state;
                                $scope.address.zip = $scope.suggestedAddress.zip;
                            }
                        }

                        //HIDE THE UI
                        $scope.address.waitingForUserInputChoice=false;
                        $scope.address.waitingForUserInputSingle=false;

                        //NOTIFY OTHER ADDRESS FIELDS TO ONCE AGAIN BE EDITABLE
                        $scope.address.approvalInProgress = false

                        //RESOLVE THE PROMISE
                        hasApproval_deferred.resolve({hasApproval: true, address: $scope.address});
                    }


                    //deprecate this
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
                            hasApproval_deferred.resolve({hasApproval: true, address: $scope.address});
                        }
                    }


                    function validateShippingAddress(addressDto) {
                        //NERIUM ENVIRONMENT CALL TO VALIDATE SHIPPING ADDRESS
                        //var url = webConfig.digOpsApiUrl;
                        //return $http.post(url + '/AutoOrderManager/ValidateShippingAddress', addressDto);

                        //STATIC DEV MOCK CALL
                        return validateShippingAddressMock(addressDto.mockScenario)
                    }

                    function validateShippingAddressMock(mockScenario) {
                        var deferred = $q.defer();

                        switch (mockScenario) {

                            //Case1: Invalid Address, Suggestion Provided
                            case "Case1":
                            {
                                $timeout(function () {
                                    deferred.resolve({
                                        data: {
                                            isValid: false, autoOrderReturnAddressDto: {
                                                address1: "580 Garner Rd",
                                                address2: "",
                                                city: "CJ",
                                                state: "OR",
                                                zip: "92232"
                                            }
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
                                        data:{
                                        isValid: false
                                    }});
                                }, 1234);
                                return deferred.promise;

                            }

                            //Case3: Valid Address
                            case "Case3":
                            {
                                $timeout(function () {
                                    deferred.resolve({
                                        data:{
                                        isValid: true
                                    }});
                                }, 1234);
                                return deferred.promise;

                            }
                        }
                    };


                    function checkServer() {

                        //ok, so we are assuming the spelling on $scope.address properties is a certain way.  This is a point to document.

                        $scope.originalAddress = {
                            address1: $scope.address.address1,
                            address2: $scope.address.address2,
                            city: $scope.address.city,
                            state: $scope.address.state,
                            zip: $scope.address.zip,
                            country: $scope.address.country
                        }


                        var remappedDto = {
                            AddressLine1: $scope.address.address1,
                            AddressLine2: $scope.address.address2,
                            City: $scope.address.city,
                            CountryCode: $scope.address.country,
                            Territory: $scope.address.state,
                            PostalCode: $scope.address.zip
                        };

                        //for testing append mockscenario so that serverApiFake knows which result to return
                        if ($scope.address.mockScenario) {
                            remappedDto.mockScenario = $scope.address.mockScenario;
                        }

                        validateShippingAddress(remappedDto) //
                            .then(function (data) {
                                $scope.address.loading = false;
                                console.log('serverApi returns to .then ', data);
                                var objReturned = data.data;

                                //show UI if original address is not valid
                                if (!objReturned.isValid) {

                                    //server returns a suggested address
                                    if (objReturned.autoOrderReturnAddressDto) {
                                        //show message box with radio buttons
                                        $scope.address.waitingForUserInputChoice = true;
                                        serverReturnedSuggestedAddress = true;
                                        handleSuggestedAddress(objReturned.autoOrderReturnAddressDto);
                                    }

                                    //serverApi does not return a suggested address
                                    else {
                                        //show message box with single choice
                                        $scope.address.waitingForUserInputSingle = true;
                                        $scope.SuggestedAddress = false;
                                    }

                                }

                                //the original address IS valid
                                else {
                                    $scope.ParentAddressFailsValidation = false;
                                    $scope.SuggestedAddress = false;
                                    hasApproval_deferred.resolve({hasApproval: true, address: $scope.address});
                                }
                            })
                            .catch(
                            function (errrodata) {
                                console.log('error ', errrodata)
                            })
                    }


                    function handleSuggestedAddress(suggestedAdress) {
                        $scope.suggestedAddress = {
                            "address1": suggestedAdress.address1,
                            "address2": suggestedAdress.address2,
                            "city": suggestedAdress.city,
                            "state": suggestedAdress.state,
                            "zip": suggestedAdress.zip
                        }
                    }


                }
            }
        })
}());