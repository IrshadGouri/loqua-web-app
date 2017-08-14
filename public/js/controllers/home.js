angular.module('Home.controllers', [])

.controller('HomeCtrl', function($scope, $ionicPlatform, $rootScope, $timeout, APIService, $localstorage, $state, $ionicTabsDelegate) {
	$ionicPlatform.ready(function() {
		$scope.todays = [];
		$scope.yesterday_compliments = [];
		$scope.yesterday_complaints = [];
		$scope.userId = $localstorage.get('userId');
		$rootScope.activefeild = 'home';
		$scope.todayDate = "TODAY";
		$scope.yesterdayDate = "YESTERDAY";
		// $ionicTabsDelegate.select(index);
		// if ($ionicTabsDelegate.selectedIndex() == 1){
		// 	console.log("hoo");
		// 	$scope.todayDate = new Date();
		// 	var dd = $scope.todayDate.getDate();
		// 	var mm = $scope.todayDate.getMonth()+1; //January is 0!
		// 	var yyyy = $scope.todayDate.getFullYear();

		// 	if(dd<10) {
		// 	    dd='0'+dd
		// 	} 

		// 	if(mm<10) {
		// 	    mm='0'+mm
		// 	} 

		// 	$scope.todayDate = dd+'/'+mm+'/'+yyyy;
		//      // Perform some action 
		// }

		$scope.today = function(index){
			$scope.todayDate = new Date();
			var dd = $scope.todayDate.getDate();
			var mm = $scope.todayDate.getMonth()+1; //January is 0!
			var yyyy = $scope.todayDate.getFullYear();

			if(dd<10) {
			    dd='0'+dd
			} 

			if(mm<10) {
			    mm='0'+mm
			} 

			$scope.todayDate = mm+'/'+dd+'/'+yyyy;
			$ionicTabsDelegate.select(index);
			$scope.yesterdayDate = "YESTERDAY";
		}
		$scope.yesterday = function(index){
			var currentdate = new Date();
			currentdate.setDate(currentdate.getDate() - 1);
			$scope.yesterdayDate = currentdate.toJSON().slice(0,10);
            $scope.yesterdayDate = new Date($scope.yesterdayDate);
			console.log($scope.yesterdayDate);
            var dd = $scope.yesterdayDate.getDate();
			var mm = $scope.yesterdayDate.getMonth()+1; //January is 0!
			var yyyy = $scope.yesterdayDate.getFullYear();

			if(dd<10) {
			    dd='0'+dd
			} 

			if(mm<10) {
			    mm='0'+mm
			} 

			$scope.yesterdayDate = mm+'/'+dd+'/'+yyyy;
			$ionicTabsDelegate.select(index);
			$scope.todayDate = "TODAY";
		}
		
		
		
		 $scope.getData = function(){
			APIService.getData({
	            req_url: main_url+'users/get_data',
	        }).then(function(resp) {
	        	console.log(resp);
	        	if(resp.data){
	        		$scope.todays = resp.data.today;
	        		$scope.yesterday_complaints = resp.data.yesterday_complaints;
	        		$scope.yesterday_compliments = resp.data.yesterday_compliment;
	        		console.log($scope.todays);

			   }
	           },function(err) {

	        }); 
		}

		$scope.getData();

		$scope.gotoDetail = function(dataObj){
			$localstorage.set("detailObj", JSON.stringify(dataObj));
			console.log(dataObj);
			if(dataObj.type=='Compliment'){
				$state.go('complimentdetail');
			}else if(dataObj.type!='Compliment'){
				$state.go('complaintdetail');
			}
		}
	});
})