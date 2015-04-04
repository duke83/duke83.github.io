app.controller('ViewShippingCtrl', ['$scope', '$location', '$anchorScroll', 'serverApi', 'CustomerApi', function ($scope, $location, $anchorScroll, serverApi, CustomerApi) {
    var custId = null;
    var originalPreferredAddressType = null;
    var originalShippingAddress = null;
    var deletedAddresses = [];
    var serverErrorEncounteredMessage = "Server Error";


    //Summary:  Initializes the controller based on the current state of the ADO from the controller.
    //Remarks:  Call this method to refresh the controller on "Discard".
    $scope.init = function (autoOrderId, customerId, serverErrorMsg) {
        $scope.autoOrderId = autoOrderId;
        custId = customerId;
        originalShippingAddress = null;
        serverErrorEncounteredMessage = serverErrorMsg;
        $scope.isVisible = true;
        $scope.isLoading = false;
        $scope.isDirty = false;
        $scope.isSaving = false;
        $scope.currentAdo = null;
        $scope.shippingAddresses = [];
        $scope.canAddNewAddress = false;
        $scope.isAddNewExpanded = false;
        $scope.errorMessages = [];
        setContactUsLink();
        $scope.primaryAddressId = "primary" + $scope.$id;
        $scope.secondaryAddressId = "secondary" + $scope.$id;

        $scope.$on('tab-change-' + autoOrderId, function () {
            clearAlerts();
        });

        hideAlert('saveAlert');

        $scope.$watch('isDirty', function (newValue, oldValue) {
            $scope.$parent.setIsDirty(autoOrderId, newValue);
        });

        $scope.isLoading = true;
        $scope.currentAdo = $scope.$parent.getAutoOrderById($scope.autoOrderId);

        serverApi.getCustomerById($scope.currentAdo.customerId)
            .success(function (data) {
                data.type = 'Main';
                var mainAddress = new shippingAddress(data);
                $scope.shippingAddresses.push(mainAddress);
                //If ADO has the same address as this one from the profile, set it's type equal to that of the profile address so we recognize it as a profile address.
                if (addressesAreSame(mainAddress, $scope.currentAdo.shipTo)) {
                    $scope.currentAdo.shipTo.type = mainAddress.type;
                } else {
                    $scope.currentAdo.shipTo.type = 'Drop Ship';
                    $scope.shippingAddresses.push($scope.currentAdo.shipTo);
                }

                originalPreferredAddressType = $scope.currentAdo.shipTo.type;
                originalShippingAddress = angular.copy($scope.currentAdo.shipTo);
                $scope.canAddNewAddress = $scope.shippingAddresses.length <= 1;

                CustomerApi.getStatesByCountry(mainAddress.country)
                    .success(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            //address validation service returns lowercase state abreviations.  Converting to lowercase here will maintain bindings in state dropdown.
                            data[i].regionCode = data[i].regionCode.toLowerCase();
                        }
                        $scope.states = data;
                    })

            })
            .error(function (data) {
                console.log(data.message);
                $scope.errorMessages.push(serverErrorEncounteredMessage);
                $scope.isVisible = false;
            })
            .finally(function () {
                $scope.isLoading = false;
            });
    }

    //Summary:  Returns whether or not the passed shippingAddress is deletable.
    //Remarks:  Use this method to determine whether or not to show the Delete button for this address.
    $scope.isDeletable = function (shippingAddress) {
        if (shippingAddress.type !== 'Main') {
            return true;
        }

        return false;
    }

    function setContactUsLink() {
        var urls = $location.host();
        var parts = urls.split('.')
        var domain = parts[1];
        var type = parts[2];
        var contactUsURL = $location.protocol() + '://' + domain + '.' + type + '/contactUs';
        $scope.contactUsLink = contactUsURL;
    }

    //Summary:  Selects an address to be applied to the ADO.  The selected address will be saved when
    //          save is called if it does not match the original shipping address for this ADO.
    $scope.selectAddress = function (shippingAddress) {
        if (!$scope.showPreferredChangeWarning) {
            hideAlert('saveCompleted');
            showAlert('savePreferred');
            $scope.showPreferredChangeWarning = true;
            $scope.currentAdo.shipTo = shippingAddress;
            $scope.isDirty = (shippingAddress !== originalShippingAddress);
        }
    }

    //Summary:  Returns true if the passed shippingAddress is the one assigned to the ADO.
    //Remarks:  Intentional usage for this is to show selected/unselected state when the addresses are listed out.
    $scope.isSelected = function (shippingAddress) {
        return $scope.currentAdo.shipTo.type === shippingAddress.type;
    }

    //Summary:  Puts the passed shippingAddress into edit mode.
    $scope.editAddress = function (shippingAddress) {
        shippingAddress.editMode = true;
        $scope.isDirty = true;
        originalShippingAddress = angular.copy(shippingAddress);
        hideAlert('shippingAddressInvalid');
        hideAlert('saveCompleted');
        hideAlert('saveFailed');
        hideAlert('saveAler')
    }

    //Summary:  Deletes the address
    $scope.deleteAddress = function (shippingAddress) {
        if (!$scope.showPreferredChangeWarning) {
            hideAlert('saveCompleted');
            showAlert('savePreferred');
            $scope.showPreferredChangeWarning = true;

            var indexToRemove = -1;
            angular.forEach($scope.shippingAddresses, function (item, index) {
                if (item === shippingAddress) {
                    indexToRemove = index;
                } else if (item.type == 'Main') {
                    $scope.currentAdo.shipTo = item;
                    $scope.isDirty = (item !== originalShippingAddress);
                }
            });
            if (indexToRemove && indexToRemove !== -1) {
                deletedAddresses.push($scope.shippingAddresses[indexToRemove]);
                $scope.shippingAddresses.splice(indexToRemove, 1);
            }

            return;
        }
    }

    //Summary:  For Main Address - Shows the user a save alert or saves the user's changes if the save alert has already been shown.
    //          For Secondary Address -
    $scope.saveChanges = function () {
        var address = null;
        var preferredAddressChange = false;

        //If the user added a new address,
        if ($scope.newShippingAddress) {
            validateAndSave($scope.newShippingAddress, false);
            return;
        }

        //If the user changed the preferred shipping method,
        if ($scope.currentAdo.shipTo.type !== originalPreferredAddressType) {
            if (!$scope.savePreferred) {
                $scope.savePreferred = true;
                return;
            } else {
                address = $scope.currentAdo.shipTo;
                preferredAddressChange = true;
            }
        }
        //Otherwise, the user edited an addresses that needs saving.
        else {
            angular.forEach($scope.shippingAddresses, function (item) {
                if (item.editMode) {
                    address = item;
                    return;
                }
            });
        }

        if (address.type === 'Main' && !preferredAddressChange) {
            hideAlert('shippingAddressInvalid');
            hideAlert('saveCompleted');
            hideAlert('saveFailed');
            hideAlert('saveAlert');
        }


        if (address.type === $scope.currentAdo.shipTo.type) {
            address.autoOrderId = $scope.autoOrderId;
        }
        validateAndSave(address, preferredAddressChange);
    }

    //Summary:  Discards the changes the user has made and displays what was retrieved from the server when the controller was initialized or last saved.
    $scope.discardChanges = function () {
        clearValidationMessages();
        angular.forEach($scope.shippingAddresses, function (item, index) {
            if (item.editMode) {
                $scope.shippingAddresses[index] = originalShippingAddress;
                originalShippingAddress = angular.copy(item);
                $scope.shippingAddresses[index].editMode = false;
                hideAlert('saveAlert');
                hideAlert('saveFailed');
                return;
            } else if (item.type == originalPreferredAddressType) {
                $scope.currentAdo.shipTo = item;
            }
        });
        if (deletedAddresses.length >= 1) {
            angular.forEach(deletedAddresses, function (item, index) {
                $scope.shippingAddresses.push(deletedAddresses[index]);
                if (deletedAddresses[index].type === originalShippingAddress.type) {
                    $scope.currentAdo.shipTo = deletedAddresses[index];
                }
            });
            deletedAddresses = [];
        }
        hideAlert('savePreferred');
        $scope.showPreferredChangeWarning = false;
        if ($scope.isAddNewExpanded) {
            $scope.newShippingAddress = null;
            $scope.isAddNewExpanded = false;
        }
        $scope.isDirty = false;
    }

    //Summary:  Toggles the Add New Address panel visibility and clears the form fields when it is collapsed.
    $scope.addNewAddress = function () {
        $scope.isAddNewExpanded = !$scope.isAddNewExpanded;
        if (!$scope.isAddNewExpanded) {
            $scope.newShippingAddress = null;
            $scope.isDirty = false;
        } else {
            hideAlert('shippingAddressInvalid');
            hideAlert('saveCompleted');
            hideAlert('saveFailed');
            $scope.newShippingAddress = new shippingAddress({ type: 'Drop Ship' });
            $scope.newShippingAddress.autoOrderId = $scope.autoOrderId;
            //Set the country to be the same as the primary shipping address from the profile.
            angular.forEach($scope.shippingAddresses, function (address) {
                if (address.type === 'Main') {
                    $scope.newShippingAddress.country = address.country;
                    return;
                }
            });
            $scope.isDirty = true;
        }
    }

    //Summary:  Validates a specific field and sets the appropriate validation message to be displayed back to the user.
    $scope.validateField = function (shippingAddress, propertyName) {
        $scope.firstNameRequired = false;
        $scope.lastNameRequired = false;
        $scope.address1Required = false;
        $scope.cityRequired = false;
        $scope.stateRequired = false;
        $scope.zipRequired = false;

        if (!shippingAddress[propertyName]) {
            $scope[propertyName + 'Required'] = true;
            return;
        }
    }

    function clearAlerts() {
        $scope.savePreferred = false;
        $scope.saveAlert = false;
        $scope.saveCompleted = false;
        $scope.saveFailed = false;
        $scope.shippingAddressInvalid = false;
        $scope.shippingAddressNotValidated = false;
    }

    var isValid = function (shippingAddress, callbackOnValid) {
        clearValidationMessages();

        if (!requiredFieldsValidation(shippingAddress))
            return;

        var address = {
            AddressLine1: shippingAddress.address1,
            AddressLine2: shippingAddress.address2,
            City: shippingAddress.city,
            Territory: shippingAddress.state,
            PostalCode: shippingAddress.zip,
            CountryCode: shippingAddress.country
        }

        // No address validation for anything that's not US or CA.
        if (shippingAddress.country.toLowerCase() !== 'us' &&
            shippingAddress.country.toLowerCase() !== 'ca') {
            callbackOnValid(shippingAddress)
            return;
        }

        //shipping address type is "Main" and does not yet have hasApproval=true.
        if (!shippingAddress.hasBeenUserApproved && shippingAddress.type === "Main") {
            //call addressSuggestion, which will tag the address with hasApproval=true;
            shippingAddress.hasApproval()
                //user pressed OK in suggestedAddres UI
                .then(function (data) {
                    shippingAddress.hasBeenUserApproved = true;
                    //now ask the user if they really want to change their main address.
                    showAlert('saveAlert');
                    return;
                },
                //user pressed cancel in suggestedAddress UI
                function (data) {
                    console.log(data);
                    $scope.shippingAddressNotValidated = false;//when the user presses cancel from addressSuggestions, we don't need to show a message.  It just leaves everything as it was.
                    $scope.isSaving = false;
                    return;
                });
        }

        if (shippingAddress.hasBeenUserApproved && shippingAddress.type === "Main") {
            //these guys don't need to call hasApproval again
            callbackOnValid(shippingAddress);
            $scope.isSaving = false;
            return;
        }

    //Generic case
    shippingAddress.hasApproval()
        //user pressed OK in suggestedAddres UI
        .then(function (data) {
            //save the address without further interaction
            callbackOnValid(shippingAddress);
            $scope.isSaving = false;
            return;
        },
        //user pressed cancel in suggestedAddress UI
        function (data) {
            console.log(data);
            $scope.isSaving = false;
            return;
        });

}

    function requiredFieldsValidation(shippingAddress) {
        if (shippingAddress.type !== 'Main') {
            if (!shippingAddress.firstName) {
                $scope.firstNameRequired = true;
                return false;
            }
            if (!shippingAddress.lastName) {
                $scope.lastNameRequired = true;
                return false;
            }
        }

        if (!shippingAddress.address1) {
            $scope.address1Required = true;
            return false;
        }
        if (!shippingAddress.city) {
            $scope.cityRequired = true;
            return false;
        }
        if (!shippingAddress.state) {
            $scope.stateRequired = true;
            return false;
        }
        if (!shippingAddress.zip) {
            $scope.zipRequired = true;
            return false;
        }
        return true;
    }

var clearValidationMessages = function () {
    $scope.address1Required = false;
    $scope.cityRequired = false;
    $scope.stateRequired = false;
    $scope.zipRequired = false;
    $scope.shippingAddressInvalid = false;
    $scope.shippingAddressNotValidated = false;
}

var showAlert = function (id) {
    $location.hash('#' + id);  //Set the location hash to the id.
    $anchorScroll();  //scrolls to the id by the location hash.
    $scope[id] = true;
}

var hideAlert = function (id) {
    $scope[id] = false;
}

var clearAddNewAddressFields = function () {
    //TODO:  Implement this method.
}

var addressesAreSame = function (addr1, addr2) {
    if (addr1 && addr2) {
        if (
            addr1.address1 === addr2.address1 &&
            addr1.address2 === addr2.address2 &&
            addr1.city === addr2.city &&
            addr1.state === addr2.state &&
            addr1.zip === addr2.zip &&
            addr1.country === addr2.country) {
            return true;
        }
    }

    return false;
}

var validateAndSave = function (address, preferredAddressChange) {
    $scope.isSaving = true;

    if (preferredAddressChange) {
        address.customerId = custId;
        address.applyAll = false;
        handleAddressSaved(address, serverApi.updateAutoOrderAddress(address), preferredAddressChange);
    } else {
        if (!isValid(address, isValidCallback)) {
            $scope.isSaving = false;
        }
    }
}


//THIS IS WHERE THE SERVER GETS CALLED FOR THE UPDATE
function isValidCallback(address) {
    $scope.isSaving = true;
    address.customerId = custId;

    if (address.type === 'Main') {
        var customerUpdateDto = {
            CustomerID: custId,
            MainAddress1: address.address1,
            MainAddress2: address.address2,
            MainCity: address.city,
            MainState: address.state,
            MainZip: address.zip,
            MainCountry: address.country,
            ApplyAll: true
        }
        if (address.type !== $scope.currentAdo.shipTo.type) {
            handleAddressSaved(address, serverApi.updateCustomer(customerUpdateDto));
        }
        else {
            serverApi.updateCustomer(customerUpdateDto)
                .success(function (data) {
                    handleAddressSaved(address, serverApi.updateAutoOrderAddress(address));
                })
                .error(function (data) {
                    console.log(data.message);
                    showAlert('saveFailed');
                });
        }
    }
    else if (address.autoOrderId) {
        handleAddressSaved(address, serverApi.updateAutoOrderAddress(address));
    }
    $scope.isSaving = false;
}

var handleAddressSaved = function (address, promise, preferredAddressChange) {
    if (promise) {
        promise
            .success(function (data) {
                showAlert('saveCompleted');
                originalShippingAddress = angular.copy(address);
                address.editMode = false;
                $scope.isDirty = false;
                if (preferredAddressChange) {
                    hideAlert('savePreferred');
                    originalPreferredAddressType = address.type;
                }
                if ($scope.newShippingAddress) {
                    $scope.currentAdo.shipTo = address;
                    originalPreferredAddressType = address.type;
                    $scope.shippingAddresses.push(address);
                    $scope.newShippingAddress = null;
                    $scope.isAddNewExpanded = false;
                }
                $scope.canAddNewAddress = $scope.shippingAddresses.length <= 1;
                deletedAddresses = [];
            })
            .error(function (data) {
                console.log(data.message);
                showAlert('saveFailed');
            })
            .finally(function () {
                $scope.isSaving = false;
                $scope.showPreferredChangeWarning = false;
            });
    }
}
}]);