// Ionic Starter App
var main_url= "https://loqua.herokuapp.com/api/v1/";
// var main_url= "http://192.168.1.102:3000/api/v1/";
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Laqua', ['ionic', 'ion-google-autocomplete', 'Nav.controllers', 'Home.controllers', 'Login.controllers', 'SignUp.controllers', 'Profile.controllers', 'ResetPassword.controllers', 'Complaint.controllers', 'ComplimentDetail.controllers', 'ComplaintDetail.controllers', 'ForgetPassword.controllers', 'ionic-ratings', 'APIModule', 'ngCordova', 'twitterLib'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
})
.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})
.directive('ionSideMenuContentScale', function($timeout,$rootScope,$ionicModal) {
  return {
    restrict: 'AC',
    link: function(scope, element, attrs) {
      scope.$watch(function() {
        return element.attr('style');
      }, function(newValue){
        if(typeof newValue != "undefined"){
          var transform = newValue.replace("transform: translate3d","");
          transform = transform.replace(/[^\w\s]/gi, '');
          transform = transform.replace(/px/gi, '');
          var axis = transform.split(" ");
          if(typeof axis[0] != "undefined" && parseInt(axis[0]) != 0){
            element.addClass('side-menu-open');
          }else{
            element.removeClass('side-menu-open');
          }

        }

      });
    }
  }
})
.constant('myAppConfig', {
    oauthSettings: {
        consumerKey: 'ZXX9glOD3egseoxKRcglSbn2K',
        consumerSecret: 'vN3N58ZHGOSUpfWmSqtEc1EyMjta46xoLfCRK8IPcyz4rPKVz4',
        requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
        authorizationUrl: "https://api.twitter.com/oauth/authorize",
        accessTokenUrl: "https://api.twitter.com/oauth/access_token",
        callbackUrl: "callbackUrl"
    }
})
.factory('$localstorage', ['$window', function($window) {
  return {
  set: function(key, value) {
   $window.localStorage[key] = value;
  },
  get: function(key, defaultValue) {
   return $window.localStorage[key] || defaultValue;
  },
  setObject: function(key, value) {
   $window.localStorage[key] = JSON.stringify(value);
  },
  getObject: function(key) {
   return JSON.parse($window.localStorage[key] || '{}');
  }
  }
}])

.config(function($ionicConfigProvider) {
   $ionicConfigProvider.navBar.alignTitle('center');
   // $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
   $ionicConfigProvider.navBar.alignTitle("center"); //Places them at the bottom for all OS
   $ionicConfigProvider.tabs.position("top"); //Places them at the bottom for all OS
   $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('nav', {
    url: '/nav',
    abstract: true,
    cache: false,
    templateUrl: 'templates/nav.html',
    controller: 'NavCtrl'
  })

  // Each tab has its own nav history stack:

  .state('nav.home', {
    url: '/home',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('nav.complaint', {
    url: '/complaint',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/complaint.html',
        controller: 'ComplaintCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('signup', {
    url: '/signup',
    cache: false,
    templateUrl: 'templates/signup.html',
    controller: 'SignUpCtrl'
  })

  .state('profile', {
    url: '/profile',
    cache: false,
    templateUrl: 'templates/profile.html',
    controller: 'ProfileCtrl'
  })

  .state('resetpassword', {
    url: '/resetpassword',
    cache: false,
    templateUrl: 'templates/resetpassword.html',
    controller: 'ResetPasswordCtrl'
  })
  .state('complimentdetail', {
    url: '/complimentdetail',
    cache: false,
    templateUrl: 'templates/complimentDetail.html',
    controller: 'ComplimentDetailCtrl'
  })
  .state('complaintdetail', {
    url: '/complaintdetail',
    cache: false,
    templateUrl: 'templates/complaintDetail.html',
    controller: 'ComplaintDetailCtrl'
  })
  .state('forgetpassword', {
    url: '/forgetpassword',
    cache: false,
    templateUrl: 'templates/forgetPassword.html',
    controller: 'ForgetPasswordCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/nav/home');

});
