//Generic service for calling API
angular.module('APIModule', [])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('genericInterceptor');
})

.factory('genericInterceptor', function($q, $rootScope) {
    var interceptor = {
        'request': function(config) {
            // Successful request method
            return config; // or $q.when(config);
        },
        'response': function(response) {
            // Successful response
            return response; // or $q.when(config);
        },
        'requestError': function(rejection) {
            // An error happened on the request
            // if we can recover from the error
            // we can return a new request
            // or promise
            $rootScope.loadCompetition = false;
            return response;
            // Otherwise, we can reject the next
            // by returning a rejection
            // return $q.reject(rejection);
        },
        'responseError': function(rejection) {
            
            // Returning a rejection
            return rejection;
        }
    };
    return interceptor;
})

.factory('APIService', ['$http', function($http, $localstorage, $scope) {
    // $scope.userToken = $localstorage.get('Token');
    return {
        getData: function(obj){
            var xhr = $http({
                url: obj.req_url,
                method: 'GET',
                data: obj.data,
                headers: {'Content-Type': 'application/json'}
            });
            return xhr;
        },
        setData: function(obj){
            var xhr = $http({
                url: obj.req_url,
                method: 'POST',
                data: obj.data,
                headers: {'Content-Type': 'application/json'}
            });
            return xhr;
        },
        removeData: function(obj){
            var xhr = $http({
                url: obj.req_url,
                method: 'DELETE',
                data: obj.data,
                headers: {'Content-Type': 'application/json'}
            });
            return xhr;
        },
        updateData: function(obj){
            var xhr = $http({
                url: obj.req_url,
                method: 'PUT',
                data: obj.data,
                headers: {'Content-Type': 'application/json'}
            });
            return xhr;
        }
    };
}]);