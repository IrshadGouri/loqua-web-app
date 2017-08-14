angular.module('ResetPassword.controllers', [])

.controller('ResetPasswordCtrl', function($scope, $ionicPlatform, $rootScope, $ionicActionSheet, APIService, $state) {
	$ionicPlatform.ready(function() {
		$rootScope.activefeild = 'signout';
		$scope.resetPasswordForm = {};
		$scope.resetPassword = function(){
			console.log($scope.resetPasswordForm);
			$scope.user = {
				user: $scope.resetPasswordForm
			}
			console.log($scope.user);
			APIService.updateData({
	            req_url: 'https://loqua.herokuapp.com/users/password',
	            data: $scope.user
	        }).then(function(resp) {
	        	console.log(resp);
	        	if(resp.data.success==true){
			      alert("Reset password link has been sent to your email Id.");
			      $state.go('nav.home');
	            }else{
	            	alert("Invalid Email Id or Password.");
	            }
	           },function(err) {

	        }); 
		}

	});
})