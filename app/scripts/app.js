'use strict';

/**
 * @ngdoc overview
 * @name unitTrackerApp
 * @description
 * # unitTrackerApp
 * Main module of the application.
 */
var app = angular.module('unitTrackerApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'xeditable', 'ui.bootstrap', 'httpPostFix', 'toaster']);

app.config(function ($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'authCtrl'
  })
  .when('/logout', {
    title: 'Logout',
    templateUrl: 'views/login.html',
    controller: 'authCtrl'
  })
  .when('/signup', {
    templateUrl: 'views/signup.html',
    controller: 'authCtrl'
  })
  .when('/main', {
    title: 'Main',
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/', {
    title: 'Login',
    templateUrl: 'views/login.html',
    controller: 'authCtrl',
    role: '0'
  })
  .otherwise({
    redirectTo: '/'
  });
});

app.run(function (editableOptions) {
  editableOptions.theme = 'bs3';
});

app.run(function ($rootScope, $location, Data) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    $rootScope.authenticated = false;
    Data.get('session').then(function (results) {
      if (results.uid) {
        $rootScope.authenticated = true;
        $rootScope.uid = results.uid;
        $rootScope.name = results.name;
        $rootScope.email = results.email;
      } else {
        var nextUrl = next.$$route.originalPath;
        if (nextUrl == '/signup' || nextUrl == '/login') {

        } else {
          $location.path("/login");
        }
      }
    });
  });
});


// app.run(function ($httpBackend) {

//   var units =
//     [
//       { 'id': '1', 'dateAdded': '6-23-15', 'unitCondition': '0', 'make': 'New Holland', 'model': 'T6.140 4WD', 'unit_num': '24757', 'consign_flag': '0', 'serial_num': 'ZEBD18752', 'description': 'TRACTOR', 'gl_num': 'A12131', 'trade': '0', 'invoice_posted': '1', 'notes': '' },
//       { 'id': '2', 'dateAdded': '6-24-15', 'unitCondition': '0', 'make': 'MAHINDRA', 'model': '40254IFLSK', 'unit_num': '24758', 'consign_flag': '0', 'serial_num': 'MRCN-2176', 'description': 'TRACTOR', 'gl_num': 'A12141', 'trade': '0', 'invoice_posted': '1', 'notes': 'TRANSFER IN' },
//       { 'id': '3', 'dateAdded': '6-24-15', 'unitCondition': '0', 'make': 'NEW HOLLAND', 'model': 'T4.115 4WD', 'unit_num': '24759', 'consign_flag': '0', 'serial_num': 'ZFJT50764', 'description': 'TRACTOR', 'gl_num': 'A12131', 'trade': '0', 'invoice_posted': '0', 'notes': '' }
//     ];

//   $httpBackend.whenGET(new RegExp('views\/.*')).passThrough();

//   $httpBackend.whenGET('/units').respond(function () {
//     return [200, units, {}];
//   });

//   $httpBackend.whenPOST('/units').respond(function () {
//     console.log('POST units');
//     return [200, units, {}];
//   });
// });

app.directive('ngConfirmClick', [function () {
	 return {
    link: function (scope, element, attr) {
      var msg = attr.ngConfirmClick || 'Are you sure?';
      var clickAction = attr.confirmedClick;
      element.bind('click', function () {
        if (window.confirm(msg)) {
          scope.$apply(clickAction);
        }
      });
    }
  };
}]);

app.factory('myService', function ($http, $q) {
  var deffered = $q.defer();
  var data = [];
  var myService = {};

  myService.async = function () {
    //The path to the php file must be added below
    $http.get('../unit-tracking.php')
      .success(function (d) {
      data = d;
      deffered.resolve();
    });
    return deffered.promise;
  };
  myService.data = function () { return data; };

  return myService;
});
