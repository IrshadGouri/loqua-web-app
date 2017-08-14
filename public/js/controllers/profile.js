angular.module('Profile.controllers', [])

.controller('ProfileCtrl', function($scope, $ionicPlatform, $rootScope, $ionicActionSheet, $timeout, $localstorage, APIService, $cordovaCamera, $cordovaFileTransfer) {
	$ionicPlatform.ready(function() {
		$rootScope.activefeild = 'signout';
		$scope.updateForm = {};
		$scope.userToken = localStorage.getItem('userToken');
        $scope.userFname = $localstorage.get('userFName');
		$scope.userLname = $localstorage.get('userLName');
		$scope.userEmail = $localstorage.get('userEmail');
		$scope.userName = $localstorage.get('userName');
		$scope.userProfile = $localstorage.get('userProfile');
		console.log($scope.userName);
		if($scope.userName==null || $scope.userName=='null'){
			$scope.userName = '';
		}
		$scope.userId = $localstorage.get('userId');
		console.log($scope.userFname+" "+$scope.userLname);
		if($scope.userLname=='' || $scope.userLname=='null' || $scope.userLname==null){
			$scope.userLname = '';
		}
		$scope.updateForm.name = $scope.userFname+" "+$scope.userLname;
		$scope.updateForm.email = $scope.userEmail;
		$scope.updateForm.user_name = $scope.userName;
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
           // $ionicLoading.show();
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
	                    $scope.userProfile = obj.path;
	                    // console.log($scope.imagePath);
                     //   	$scope.ProfilePic = $scope.imagePath;
                     //   	$scope.profilepicName = obj.success.image_name;
                        // $ionicLoading.hide();
                   }catch(err){
                      alert(err.message);
                    }
                  }, function(err) {
                    console.log(err);
                    // $ionicLoading.hide();
                  }, function (progress) {
                     console.log(progress);
                    // $ionicLoading.hide();
                  });
                }catch(err){
                  // alert(err.message);
                }
        };

		$scope.updateUser = function(){
			$scope.updateForm.social_profile_url = $scope.userProfile;
			console.log($scope.updateForm);
			$scope.user = {
				user: $scope.updateForm
			}
			console.log($scope.user);
			APIService.patchData({
	            req_url: main_url+'users/'+$scope.userId,
	            data: $scope.user
	        }).then(function(resp) {
	        	console.log(resp);
	        	if(resp.data.success==true){
				    $localstorage.set('userEmail', resp.data.user.email);
					$localstorage.set('userFName', resp.data.user.first_name);
					$localstorage.set('userLName', resp.data.user.last_name);
					$localstorage.set('userProfile', resp.data.user.social_profile_url);
					$localstorage.set('userName', resp.data.user.user_name);
					$localstorage.set('userId', resp.data.user.id);
					$scope.userFname = $localstorage.get('userFName');
					$scope.userLname = $localstorage.get('userLName');
					$scope.userEmail = $localstorage.get('userEmail');
					$scope.userName = $localstorage.get('userName');
					$scope.userId = $localstorage.get('userId');
					$scope.userProfile = $localstorage.get('userProfile');
	            }else{
	            	alert("Invalid Email Id or Password.");
	            }
	           },function(err) {

	        }); 
		}

	});
})