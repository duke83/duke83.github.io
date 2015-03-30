(function () {
    angular.module("app")
        .factory("newAdoService", ['$rootScope', 'serverApi', 'autoOrderManagerService', function ($rootScope, serverApi, manager) {
            //////////////// STRUCTURAL ME'HODS ////////////////

            // Container object
            var newAdoService = {};

            // required to pull in partial
            var baseUrl = '';

            newAdoService.isActive = false;

            toggleIsActive = function () {
                newAdoService.isActive = !newAdoService.isActive
            }

            newAdoService.productListExpanded = false;

            // Basic array used to set tab text and synch with content
            newAdoService.tabs = [
                { text: "Auto Order Details", selected: true, tabId: "AutoOrderDetails", errors: [] },
                { text: "Shipping Details", selected: false, tabId: "ShippingDetails", errors: [] },
                { text: "Billing Details", selected: false, tabId: "BillingDetails", errors: [] }
            ];

            newAdoService.selectedTabId = "";

            newAdoService.clickBack = function () {

                if (newAdoService.selectedTab.tabId === "BillingDetails" && newAdoService.billingTabIsValid()) {
                    newAdoService.selectTab("ShippingDetails");
                    return;
                }

                newAdoService.resetShippingDetails();
            };


            newAdoService.clickNext = function () {
                //If the tab is not valid, do not allow to go to next
                //if(!newAdoService.selectedTabIsValid())
                if (newAdoService.selectedTab.tabId === "AutoOrderDetails") {
                    if (newAdoService.autoOrderManagerDto.details.length) {
                        newAdoService.selectTab("ShippingDetails");
                    }

                }
                if (newAdoService.selectedTab.tabId === "ShippingDetails") {

                    //there are two potential address forms that need to be checked and validated.

                    //form: NewAdo-EditShippingAddress-Form
                    //      scope variable name is "shippingAddress"
                    // address suggestion hasApproval can be evoked on the edit button.  No need to do it here.  CORRECTION: the edit button brings the form to edit mode, but there is no save button to invoke the hasApproval() method.
                    if (angular.element('#NewAdo-EditShippingAddress-Form').hasClass('ng-dirty')) {
                        angular.element('#NewAdo-EditShippingAddress-Form').scope().shippingAddress.hasApproval()
                            .then(function (data) {
                                console.log('the resolution of approval is:', data)

                                //advance to next tab
                                newAdoService.selectTab("BillingDetails");
                            }, function (error) {
                                $scope.resolution = error;
                            })
                    }


                    //form: NewAdo-NewShippingAddress-Form
                    //      scope variable name is "newAdoService.autoOrderManagerDto"

                    if (angular.element('#NewAdo-NewShippingAddress-Form').hasClass('ng-dirty')) {
                        angular.element('#NewAdo-NewShippingAddress-Form').scope().newAdoService.autoOrderManagerDto.hasApproval()
                            .then(function (data) {
                                console.log('the resolution of approval is:', data)

                                //advance to next tab
                                newAdoService.selectTab("BillingDetails");
                            }, function (error) {
                                $scope.resolution = error;
                            })
                    }

                    return;
                }

            };

            newAdoService.clickCancel = function () {
                newAdoService.selectTab("AutoOrderDetails");
                newAdoService.isActive = false;
                newAdoService.autoOrderManagerDto = null;
                newAdoService.newBillingAccount = null;
                manager.removeAutoOrder(0);
            }

            newAdoService.clickSave = function () {

                if (!newAdoService.shippingTabIsValid()) {
                    return;
                }
                if (!newAdoService.billingTabIsValid()) {
                    return;
                }

                newAdoService.saving = true;
                var hasBankAccount = false;
                if (newAdoService.autoOrderManagerDto.paymentTypeId &&
                    newAdoService.autoOrderManagerDto.paymentTypeId === 4) {
                    hasBankAccount = true;
                }
                serverApi.createNewAutoOrder(newAdoService.autoOrderManagerDto, newAdoService.newBillingAccount)
                    .success(function (data) {
                        if (data.errorCode) {
                            newAdoService.tabs[0].errors = [];
                            newAdoService.tabs[1].errors = [];
                            newAdoService.tabs[2].errors = [];
                            var tabIndex;
                            switch (data.errorCode) {
                                case '100':
                                    //Daycream/Nightcream Rule Violation
                                    tabIndex = 0;
                                    break;
                                case '200':
                                    //Invalid Shipping Address
                                    tabIndex = 1;
                                    break;
                                case '300':
                                case '301':
                                case '302':
                                    //Invalid Billing Account
                                    tabIndex = 2;
                                    break;
                                default:
                                    $rootScope.$broadcast('NewAdoSaveError');
                                    break;
                            }
                            newAdoService.tabs[tabIndex].errors.push({ errorCode: data.errorCode });
                            var foundTab = false;
                            angular.forEach(newAdoService.tabs, function (item, index) {
                                if (!foundTab && item.errors.length > 0) {
                                    newAdoService.selectTab(item.tabId);
                                    foundTab = true;
                                }
                            });
                        }
                        else {
                            $rootScope.$broadcast('NewAdoSaved', {
                                orderId: data.orderId,
                                hasBankAccount: hasBankAccount
                            });
                            newAdoService.clickCancel();
                        }
                    })
                    .error(function (data) {
                        if (data.message) {
                            console.log(data.message);
                        }
                        if (data.exceptionType) {
                            console.log("Exception Type: " + data.exceptionType);
                        }
                        if (data.exceptionMessage) {
                            console.log("Exception Message: " + data.exceptionMessage);
                        }
                        if (data.stackTrace) {
                            console.log("Stack Trace: " + data.stackTrace);
                        }
                        $rootScope.$broadcast('NewAdoSaveError');
                    })
                    .finally(function () {
                        newAdoService.saving = false;
                    });
            }

            newAdoService.canGoNext = function () {
                if (newAdoService.selectedTab.tabId === "AutoOrderDetails") {
                    return newAdoService.autoOrderManagerDto.details.length;
                }

                return newAdoService.tabs.indexOf(newAdoService.selectedTab) < (newAdoService.tabs.length - 1);
            }

            newAdoService.canGoBack = function () {
                return newAdoService.tabs.indexOf(newAdoService.selectedTab) > 0;
            }

            newAdoService.canSave = function () {
                return newAdoService.tabs.indexOf(newAdoService.selectedTab) === (newAdoService.tabs.length - 1);
            }

            newAdoService.selectTab = function (tabid) {
                for (var i = 0; i < this.tabs.length; i++) {
                    if (this.tabs[i].tabId === tabid) {
                        this.tabs[i].selected = true;
                        newAdoService.selectedTab = newAdoService.tabs[i];
                        $rootScope.$broadcast(newAdoService.tabs[i].tabId);
                    }
                    else {
                        this.tabs[i].selected = false;
                    }
                }
            }

            function buildPartialUrl() {
                var bUrl = window.location.href.split('/');

                baseUrl = bUrl[0] + '//' + bUrl[2] + '/partials/ado-manager/';
            }

            newAdoService.reset = function () {
                //////////////// VALIDATION METHODS ////////////////

                //this should be set by the validation method in newAdoProductsCtrl
                newAdoService.adoDetailsTabIsValid = false;

                //this should be set by the validation method in newAdoShippingCtrl
                newAdoService.shippingTabIsValid = false;

                //this should be set by the validation method in newAdoPaymentCtrl
                newAdoService.billingTabIsValid = null;
                newAdoService.billingTabDiscardChanges = null;

                newAdoService.selectedTabIsValid = function () {
                    switch (newAdoService.selectedTab().tabId) {
                        case "AutoOrderDetails":
                        {
                            return newAdoService.adoDetailsTabIsValid;
                            break;
                        }
                        case "Shipping Details":
                        {
                            return newAdoService.shippingTabIsValid;
                            break;
                        }
                        case "Billing Details":
                        {
                            return newAdoService.billingTabIsValid;
                            break;
                        }
                    }
                    //if (newAdoService.selectedTab().tabId === "AutoOrderDetails") {
                    //    return true;
                    //}
                    return false;
                };

                newAdoService.storeAddressDetails = function () {

                    // receive the field values from newAdoShippingCtrl...
                }

                ////DATA HOLDERS FOR WIZARD PROCESS////
                newAdoService.autoOrderManagerDto = new autoOrder({});

                newAdoService.newBillingAccount = null;

                // Summary this is called upon clicking back from the shipping details to the Ado Details tab
                // The method 'resets' the shipping details so that clicking next from the ADO details to the Shipping Tab
                // ensures that main address details are re-pulled if necessary.
                newAdoService.resetShippingDetails = function () {
                    if (newAdoService.autoOrderManagerDto.shipTo.type === 'Drop Ship') {
                        newAdoService.autoOrderManagerDto.shipTo.type = 'Main';
                    }
                }

                newAdoService.selectTab(newAdoService.tabs[0].tabId);
            }

            newAdoService.reset();

            return newAdoService;
        }])
}())