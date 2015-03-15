var app = angular.module('app', []);


app.controller('validAddressTestCtrl', ['$scope', function ($scope) {

    $scope.currentindex = 0;

    $scope.runTest = function () {
        for (var i = 0; i < $scope.addresses.length; i++) {
            if (i === parseInt($scope.currentindex)) {
              $scope.addresses[i].hasApproval()
                  .then(function(data){
                    console.log('the resolution of approval is:', data)
                })
            }
        }

    };

    $scope.addresses = [{
        address1: "123 fireside",
        address2: "",
        city: "oceanside",
        state: "CA",
        zip: "92054"
    }, {
        address1: "580 Garner Rd",
        address2: "yyy",
        city: "CJ",
        state: "OR",
        zip: "92232"
    }, {
        address1: "942 E 350 N",
        address2: "",
        city: "Bountiful",
        state: "UT",
        zip: "84010"
    }, {
        address1: "123 Elm",
        address2: "",
        city: "Berkley",
        state: "CA",
        zip: "99321"
    }];


}]);

