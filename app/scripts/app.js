'use strict';

/**
 * @ngdoc overview
 * @name unitTrackerApp
 * @description
 * # unitTrackerApp
 *
 * Main module of the application.
 */
var app = angular.module('unitTrackerApp', ['ngAnimate','ngCookies','ngResource','ngRoute','ngSanitize','ngTouch', 'xeditable', 'ui.bootstrap', 'httpPostFix']);
  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  
  app.directive('ngConfirmClick', [function($event){
	 return {
		link: function (scope, element, attr, $event) {
			var msg = attr.ngConfirmClick || "Are you sure?";
			var clickAction = attr.confirmedClick;
			element.bind('click',function (event) {
				if ( window.confirm(msg) ) {
					scope.$apply(clickAction);
				}
			});
		}
	};
}]);
  
  app.factory('myService', function($http, $q) {
  var deffered = $q.defer();
  var data = [];  
  var myService = {};

  myService.async = function() {
    //The path to the php file must be added below
    $http.get('path_to_php')
    .success(function (d) {
      data = d;
      deffered.resolve();
    });
    return deffered.promise;
  };
  myService.data = function() { return data; };

  return myService;
});

