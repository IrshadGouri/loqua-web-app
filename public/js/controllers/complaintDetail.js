angular.module('ComplaintDetail.controllers', [])

.controller('ComplaintDetailCtrl', function($scope, $ionicPlatform, $rootScope, $localstorage, APIService, $cordovaSocialSharing) {
	$ionicPlatform.ready(function() {
		$scope.homeObj = JSON.parse($localstorage.get("detailObj"));
		console.log($scope.homeObj);
		 
		$scope.setFavirate = function(voteID, dataObj){
		 	console.log("hihii");
			APIService.setData({
	            req_url: main_url+'complaints/'+voteID+'/upvote',
	            // data: $scope.compliment
	        }).then(function(resp) {
	        	console.log(resp);
	        	if(resp.data){
	        	 dataObj.votes_status = resp.data.status;
			   }
	           },function(err) {

	        }); 
		}

		$scope.share = function(){
			$cordovaSocialSharing.share('Loqua App', 'loqua', 'file', 'link') // Share via native share sheet
		    .then(function(result) {
		      // Success!
		    }, function(err) {
		      // An error occured. Show a message to the user
		    });
		}

		$scope.setUnFavirate = function(voteID, dataObj){
		 	
			APIService.setData({
	            req_url: main_url+'complaints/'+voteID+'/downvote',
	            // data: $scope.compliment
	        }).then(function(resp) {
	        	console.log(resp);
	        	if(resp.data){
	        	 dataObj.votes_status = resp.data.status;
			   }
	           },function(err) {

	        }); 
		}
	});
})