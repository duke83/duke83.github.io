
//this is meant to provide compatibility with VS solution for development purposes.
(function () {
    angular.module('app')
        .factory('webConfig', [function () {
            var webConfig = {};

            webConfig.digOpsApiUrl = "";

            return webConfig;
        }])
}());
