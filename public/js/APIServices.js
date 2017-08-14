//Generic service for calling API
angular.module('APIModule', [])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('genericInterceptor');
})

.factory('genericInterceptor', function($q, $injector, $cordovaDialogs) {

    var interceptor = {
        'request': function(config) {
            // Successful request method
            var loadingService = $injector.get('$ionicLoading');
            if(!config.hideLoader)
            loadingService.show();
            return config; // or $q.when(config);
        },
        'response': function(response) {
            // Successful response
            if(response.data.message){
                $cordovaDialogs.alert(response.data.message, 'Message', 'OK')
                .then(function() {
                  // callback success
                });
            }
            
            var loadingService = $injector.get('$ionicLoading');
            loadingService.hide();
            return response; // or $q.when(config);
        },
        'requestError': function(rejection) {
            // An error happened on the request
            // if we can recover from the error
            // we can return a new request
            // or promise
            return response;
            // Otherwise, we can reject the next
            // by returning a rejection
            // return $q.reject(rejection);
        },
        'responseError': function(rejection) {
            
            // Returning a rejection
            /*$cordovaDialogs.alert('Please try again.', 'Something Want Worng', 'OK')
            .then(function() {
              // callback success
            });*/
            var loadingService = $injector.get('$ionicLoading');
            loadingService.hide();
            return rejection;
        }
    };
    return interceptor;
})

.factory('APIService', ['$http', function($http, $localstorage, $scope) {
    // $scope.userToken = $localstorage.get('Token');
    return {
        getData: function(obj){
            console.log("=====obj.data======",obj.data)
            var xhr = $http({
                url: obj.req_url,
                method: 'GET',
                data: obj.data,
                hideLoader: obj.hideLoader,
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('userToken')}
            });
            return xhr;
        },
        setData: function(obj){
            var xhr = $http({
                url: obj.req_url,
                method: 'POST',
                data: obj.data,
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('userToken')}
            });
            return xhr;
        },
        removeData: function(obj){
            var xhr = $http({
                url: obj.req_url,
                method: 'DELETE',
                data: obj.data,
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('userToken')}
            });
            return xhr;
        },
        updateData: function(obj){
            var xhr = $http({
                url: obj.req_url,
                method: 'PUT',
                data: obj.data,
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('userToken')}
            });
            return xhr;
        },
        patchData: function(obj){
            var xhr = $http({
                url: obj.req_url,
                method: 'PATCH',
                data: obj.data,
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('userToken')}
            });
            return xhr;
        }
    };
}]);