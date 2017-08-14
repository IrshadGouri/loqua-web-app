angular.module('SignUp.controllers', [])

.controller('SignUpCtrl', function($scope, $ionicPlatform, $rootScope, $ionicActionSheet, $timeout, APIService, $ionicPopup, $cordovaCamera, $cordovaFileTransfer, $localstorage, TwitterLib, $cordovaOauth, $ionicLoading, $http, $state) {
	$ionicPlatform.ready(function() {
		$rootScope.activefeild = 'signout';
		$scope.signupForm = {};
		$scope.socialForm = {};
		$scope.user = [];
		$scope.ProfilePic = "img/ben.png";
		// Triggered on a button click, or some other target
		 $scope.show = function() {

		   // Show the action sheet
		   var hideSheet = $ionicActionSheet.show({
		     buttons: [
		       { text: '<b class="text-gray">View Profile Picture</b>' },
		       { text: '<b class="text-gray">Choose New Picture</b>' },
		       { text: '<b class="text-gray">Take New Picture</b>' }
		     ],
		     destructiveText: '<b>Cancel</b>',
		     cancelText: 'Cancel',
		     cancel: function() {
		     	hideSheet();
	          // add cancel code..
	         },destructiveButtonClicked: function() {
		       return true;
		     },
		     buttonClicked: function(index) {
		      console.log(index);
		       if(index==0){
		       	 hideSheet();
		       }else if(index==1){
		       	 $scope.galleryOpen();
		       }else if(index==2){
		       	 $scope.cameraOpen();
		       }
		       return true;
		     }
		   });
		 };


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
		        alert(JSON.stringify(error));
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
	        		alert("Email verification link has been sent. Please verify your email.");
	        		/*localStorage.setItem('userToken', resp.data.auth_token);
					$localstorage.set('userEmail', resp.data.user.email);
					$localstorage.set('userFName', resp.data.user.first_name);
					$localstorage.set('userLName', resp.data.user.last_name);
					$localstorage.set('userProfile', resp.data.user.social_profile_url);
					$localstorage.set('userName', resp.data.user.user_name);
					$localstorage.set('userId', resp.data.user.id);
					$state.go('nav.home');*/
	            }else{
	            	alert("Email Id didn't find. Please use app sign up");
	            }
	           },function(err) {
	       });	
		}
        $scope.cameraOpen = function(){
          try{
            localStorage.setItem("type","camera");
            var options = {
              quality : 100,
              destinationType : Camera.DestinationType.FILE_URI,
              sourceType : Camera.PictureSourceType.CAMERA,
              allowEdit : false,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 1600,
              targetHeight: 1200,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation: true
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.imageData = imageData;
              $scope.uploadPhoto($scope.imageData);
            }, function(err) {
                // console.log(err.message);
            });
          }
          catch(err){
            // console.log(err.message);
          }
        };



       
        $scope.galleryOpen = function(){
          try{
            localStorage.setItem("type","gallery");
            var options = {
              quality : 100,
              destinationType : Camera.DestinationType.FILE_URI,
              sourceType : Camera.PictureSourceType.PHOTOLIBRARY ,
              allowEdit : false,
              targetWidth: 1600,
              targetHeight: 1200,
              encodingType: Camera.EncodingType.JPEG,
              popoverOptions: CameraPopoverOptions,
              correctOrientation: false
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.imageData = imageData;
              $scope.uploadPhoto($scope.imageData);
              
            }, function(err) {
              console.log(err.message);
            });
          }
          catch(err){
            console.log(err.message);
          }
        }

        $scope.uploadPhoto = function(file){
          try{
           $ionicLoading.show();
            var filePath = file;
            var Checktype = localStorage.getItem("type");
            var server =  encodeURI(main_url+"users/upload");
              if(Checktype=="gallery"){
                var imageURI = filePath;
                var options = new FileUploadOptions();
                options.fileKey = "image";
                options.fileName = filePath.substr(filePath.lastIndexOf('/')+1);
                options.mimeType = "image/jpeg";
                var params = new Object();
                options.params = params;
                var headers={'headerParam':'form-data'};
                options.headers = headers;
                options.chunkedMode = false;
                 var res = options.fileName.split("?");
                 options.fileName = res[0];
                 console.log(options+"  "+filePath + " "+server);
             }
              if(Checktype=="camera"){
                var imageURI = filePath;
                var options = new FileUploadOptions();
                options.fileKey = "image";
                options.fileName = filePath.substr(filePath.lastIndexOf('/')+1);
                options.mimeType = "image/jpeg";
                var params = new Object();
                options.params = params;
                var headers={'headerParam':'form-data'};
                options.headers = headers;
                options.chunkedMode = false;
              }
            console.log(JSON.stringify(options));
            $cordovaFileTransfer.upload(server, filePath, options)
              .then(function(result) {
                  console.log(result);
                    try{
	                    var obj = JSON.parse(result.response);
                        console.log(obj);
	                    $scope.ProfilePic = obj.path;
	                    // console.log($scope.imagePath);
                     //   	$scope.ProfilePic = $scope.imagePath;
                     //   	$scope.profilepicName = obj.success.image_name;
                        $ionicLoading.hide();
                   }catch(err){
                      //alert(err.message);
                    }
                  }, function(err) {
                    console.log(err);
                    $ionicLoading.hide();
                  }, function (progress) {
                     console.log(progress);
                    //$ionicLoading.hide();
                  });
                }catch(err){
                  // alert(err.message);
                }
        };



		$scope.signupUser = function(){
			$scope.signupForm.social_profile_url = $scope.ProfilePic;
			$scope.user = {
				user: $scope.signupForm
			}
			console.log($scope.user);
			$ionicLoading.show();
			APIService.setData({
	            req_url: main_url+'users',
	            data: $scope.user
	        }).then(function(resp) {
	        	console.log(resp);
	        	$ionicLoading.hide();
	        	if(resp.data.success==true){
	        		alert("Email verification link has been sent. Please verify your email.");
			        /*$localstorage.set('islogin', '1');
			        localStorage.setItem('userToken', resp.data.auth_token);
					$localstorage.set('userEmail', resp.data.user.email);
					$localstorage.set('userFName', resp.data.user.first_name);
					$localstorage.set('userLName', resp.data.user.last_name);
					$localstorage.set('userProfile', resp.data.user.social_profile_url);
					$localstorage.set('userName', resp.data.user.user_name);
					$localstorage.set('userId', resp.data.user.id);
	        		$state.go('nav.home');*/
	            }else if(resp.data.message=="Email has already been taken") {
	            	$ionicLoading.hide();
	            	alert(resp.data.message);
	            }
	            else{
	            	$ionicLoading.hide();
	            	alert("Invalid Email Id or Password.");
	            }
	           },function(err) {
	            $ionicLoading.hide();
	        }); 
		}

	});
})