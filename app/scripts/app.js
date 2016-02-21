'use strict';

/**
 * @ngdoc overview
 * @name testApp
 * @description
 * # testApp
 *
 * Main module of the application.
 */
angular
  .module('ChatApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      }).when('/login',{
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when("/room/:roomId", {
        templateUrl: "views/room.html",
        controller: "RoomCtrl"
      })
      .when("/rooms/:nick", {
        templateUrl: "views/roomList.html",
        controller: "RoomListCtrl"
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


  angular.module("test",["ui.bootstrap", "ng", "ngRoute"])
.config(function($routeProvider, $locationProvider){
  $routeProvider.when("/index",{
    templateUrl: "/login/login.html",
    controller: "LoginCtrl"
  }).when("/rooms", {
    templateUrl: "roomlist/roomlist.html",
    controller: "RoomlistCtrl"
  }).when("/rooms/:roomId", {
    templateUrl: "app/views/room.html",
    controller: "RoomCtrl"
  }).otherwise({
    redirectTo: "/index"
  });
});
