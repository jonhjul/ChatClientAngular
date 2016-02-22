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
      .when("/rooms/", {
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

  angular.module("ChatApp").factory("ChatResource",['$rootScope', '$location', function ($rootScope, $location) {
    var username = "";
    return {
        getUserName: function(){
          return username
        },
        login: function login(user, callback){
          // TODO:
          var socket = this.getConnection();
          socket.emit("adduser", user, function(success) {
            if (!success) {
              var errorMessage = "Login failed";
              var error = true;
              console.log("error: " +error);
            } else {
              username = user;
              $location.path("/rooms/");
              $rootScope.$apply()
            }
          });
        },
        getRoomList: function getRoomList(callback){
          // TODO:
        },
        getConnection: function getConnection(){
          var socket = io.connect("http://localhost:8080");
          return socket;
        },
        isUserLogedIn: function isUserLogedIn(){
            return (this.getUserName().length > 0);
        }
    }
  }]);
