angular.module('Nav.controllers', [])

.controller('NavCtrl', function($scope, $ionicPlatform, $rootScope, $ionicActionSheet, $state, $localstorage) {
	$ionicPlatform.ready(function() {
		
		// Triggered on a button click, or some other target

			$scope.userEmail = $localstorage.get('userEmail');
			$scope.userFName = $localstorage.get('userFName');
			$scope.userLName = $localstorage.get('userLName');
		 $scope.show = function() {
		 	console.log("hihi");
		   // Show the action sheet
		   var hideSheet = $ionicActionSheet.show({
		     buttons: [
		       { text: '<button class="button">Logout</button>' },
		       { text: '<button class="button">Cancel</button>' }
		     ],
		     // destructiveText: 'Cancel',
		     // cancelText: 'Cancel',
		     // cancel: function() {
		     // 	// hideSheet();
	      //     // add cancel code..
	      //    },
		     buttonClicked: function(index) {
		       console.log(index);
		       if(index==0){
		       	 $localstorage.set('userId', '');
		       	 $state.go('login');
		       }else{
		       	  hideSheet();
		       }
		        return true;
		     }
		   });

		   // For example's sake, hide the sheet after two seconds
		   // $timeout(function() {
		   //   hideSheet();
		   // }, 2000);

		 };

	});
})