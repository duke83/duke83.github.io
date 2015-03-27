var app = angular.module('app', []);

app.controller('testCase1Ctrl', ['$scope', function ($scope) {

    $scope.address={
        address1: "123 Elm",
        address2: "",
        city: "Berkley",
        state: "CA",
        zip: "99321",
        mockScenario:"Case1"
    };

    $scope.save=function(){
        $scope.address.hasApproval()
            .then(function(data){
                console.log('the resolution of approval is:', data)
                $scope.testResult=data;
            })
    }

}]);

app.controller('testCase2Ctrl', ['$scope', function ($scope) {

    $scope.address={
        address1: "123 Elm",
        address2: "",
        city: "Berkley",
        state: "CA",
        zip: "99321",
        mockScenario:"Case2"
    };

    $scope.save=function(){
        $scope.address.hasApproval()
            .then(function(data){
                console.log('the resolution of approval is:', data)
                $scope.testResult=data;
            })
    }

}]);

app.controller('testCase3Ctrl', ['$scope', function ($scope) {

    $scope.address={
        address1: "123 Elm",
        address2: "",
        city: "Berkley",
        state: "CA",
        zip: "99321",
        mockScenario:"Case3"
    };

    $scope.save=function(){
        $scope.address.hasApproval()
            .then(function(data){
                console.log('the resolution of approval is:', data)
                $scope.testResult=data;
            })
    }

}]);
