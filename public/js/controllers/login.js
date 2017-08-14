angular.module('Login.controllers', [])

.controller('LoginCtrl', function($scope, $ionicPlatform, $rootScope, APIService, $ionicLoading, $localstorage, TwitterLib, $cordovaOauth, $ionicLoading, $state, $http) {
	$ionicPlatform.ready(function() {
		$rootScope.activefeild = 'signout';
		$scope.loginform = {};
		$scope.socialForm ={};
		$scope.loginUser = function(){
			$ionicLoading.show();
			APIService.setData({
	            req_url: main_url+'authenticate',
	            data: $scope.loginform
	        }).then(function(resp) {
	        	console.log(resp);
	        	$ionicLoading.hide();
	        	if(resp.data.success==true){
	        		localStorage.setItem('userToken', resp.data.auth_token);
					$localstorage.set('userEmail', resp.data.user.email);
					$localstorage.set('userFName', resp.data.user.first_name);
					$localstorage.set('userLName', resp.data.user.last_name);
					$localstorage.set('userProfile', resp.data.user.social_profile_url);
					$localstorage.set('userName', resp.data.user.user_name);
					$localstorage.set('userId', resp.data.user.id);
					$state.go('nav.home');
	            }else{
	            	$ionicLoading.hide();
	            	alert("Invalid Email Id or Password.");
	            }
	           },function(err) {
	            $ionicLoading.hide();
	        }); 
		}


		 // 118378235186495
		$scope.Facebook = function() {
			$ionicLoading.show();
		    $cordovaOauth.facebook("1777292979261798", ["email", "read_stream", "public_profile", "user_friends"]).then(function(result) {
		      $ionicLoading.hide();
		         $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: result.access_token, fields: "id,name,email,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result1) {
		          $ionicLoading.hide();
		          $scope.socialForm.provider_id = result1.data.id;
		          $scope.socialForm.name = result1.data.name;
		          $scope.socialForm.social_profile_url =result1.data.picture.data.url;
		          $scope.socialForm.provider_type= "facebook";
		          if(result1.data.email==undefined){
		            $scope.socialForm.email = "";
		          }else{
		            $scope.socialForm.email = result1.data.email;
		          }
		     	  $scope.socialLogin($scope.socialForm);
			      }, function(error) {
			        $ionicLoading.hide();
			        //alert("There was a problem getting your profile. Check the logs for details.");
			        //alert(error);
			      });
			    }, function(error) {
			      $ionicLoading.hide();
			      //alert(error);
			    });
			}
			  
			$scope.Twitterlogin = function() {
			    try{
			      console.log("hiihh");
			      TwitterLib.init().then(function (data) {
			      	console.log(data);
			        try{
			          $scope.socialForm.name = data.screen_name;
			          localStorage.setItem("twittername",data.screen_name);
			          $scope.socialForm.social_profile_url =  data.profile_background_image_url;
			          $scope.socialForm.provider_id =  data.id;
			          $scope.socialForm.provider_type= "twitter";
			          if(data.email==undefined){
			              $scope.socialForm.email = "";
			            }else{
			              $scope.socialForm.email = data.email;
			            }			          
			          $scope.socialLogin($scope.socialForm);
			        }catch(err){
			          alert(err.message);
			        }
			        
			      }, function error(error) {
			        console.log(JSON.stringify(error));
			      });
			    }catch(err){
			      alert(err.message);
			    }
 			}

 			$scope.socialLogin = function(loginObj){

				APIService.setData({
		            req_url: main_url+'login_with_social',
		            data: loginObj
		        }).then(function(resp) {
		        	console.log(resp);
		        	if(resp.data.success){
		        		localStorage.setItem('userToken', resp.data.auth_token);
						$localstorage.set('userEmail', resp.data.user.email);
						$localstorage.set('userFName', resp.data.user.first_name);
						$localstorage.set('userLName', resp.data.user.last_name);
						$localstorage.set('userProfile', resp.data.user.social_profile_url);
						$localstorage.set('userName', resp.data.user.user_name);
						$localstorage.set('userId', resp.data.user.id);
						$state.go('nav.home');
		            }else{
		            	alert("Email Id didn't find. Please use app sign up");
		            }
		           },function(err) {
		       });	
			}
	});
})