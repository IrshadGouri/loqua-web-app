angular.module('ForgetPassword.controllers', [])

.controller('ForgetPasswordCtrl', function($scope, $ionicPlatform, $rootScope, APIService, $localstorage, $state) {
	$ionicPlatform.ready(function() {
		$rootScope.activefeild = 'signout';
		$scope.forgetForm = {};
		$scope.forgetPassword = function(){
			console.log($scope.forgetForm);
			console.log($scope.user);
			APIService.setData({
	            req_url: main_url+'users/forgot_password',
	            data: $scope.forgetForm
	        }).then(function(resp) {
	        	console.log(resp);
	        	if(resp.data.success==true){
			      alert("Reset password link has been sent to your email Id.");
			      //$state.go('resetpassword');
	            }else{
	            	alert("Invalid Email Id or Password.");
	            }
	           },function(err) {

	        }); 
		}
	});
})