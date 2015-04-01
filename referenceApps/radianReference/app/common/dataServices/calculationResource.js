(function () {
    "use strict"
    angular.module("common.dataServices")
        .factory("calculationResource", ["$resource", calculationResource]);

    function calculationResource($resource) {
        return $resource("/calculationApi/:calculationName/:cert/:quarter")
    }
}());