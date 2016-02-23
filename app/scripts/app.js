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
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      }).when('/login', {
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

angular.module("ChatApp").factory("ChatResource", ['$rootScope', '$location', function($rootScope, $location) {
      var username = "";
      var errorMessage = "";
      return {
        getConnection: function getConnection() {
          var socket = io.connect("http://" + $location.host() + ":8080"); //"http://localhost:8080
          return socket;
        },
        getUserName: function() {
          return username
        },
        login: function login(user, callback) {
          var socket = this.getConnection();
          socket.emit("adduser", user, function(success) {
            if (!success) {
              var errorMessage = "Login failed";
              var error = true;
              console.log("Error message: " + errorMessage);
              console.log("Login name taken: " + error);
            } else {
              username = user;
              $location.path("/rooms/");
              $rootScope.$apply();
            }
          });
        },
        joinRoom: function joinRoom(roomName, pass, callback) {
          var socket = this.getConnection();
          var joinObj = {
            room: roomName,
            pass: pass
          }
          socket.emit("joinroom", joinObj, function(success) {
              if(success){
                $location.path('room/' + roomName)
                $rootScope.$apply();
              }else{
                console.log("joinroom fail");
              }
            });
            },
            getErrorMsg: function getErrorMsg() {
              return errorMessage;
            },
            getRoomList: function getRoomList(callback) {
              // TODO:
            },
            isUserLogedIn: function isUserLogedIn() {
              return (this.getUserName().length > 0);
            },
            sendMsg: function sendMsg(msg, roomName) {
              var socket = this.getConnection();
              var data = {
                msg: msg,
                roomName: roomName
              }
              socket.emit("sendmsg", data);
            },
            newTopic: function newTopic(topic, roomName) {
              var socket = this.getConnection();
              var data = {
                topic: topic,
                room: roomName
              }
              socket.emit("settopic", data);

            },
            leaveChannel: function leaveChannel(name){
              var socket = this.getConnection();
              socket.emit('partroom', name);
              $location.path('rooms/');
            },
            userOperation: function userOperation(operation, operationObject){
                  var socket = this.getConnection();
                  socket.emit(operation,operationObject,function(success){
                    console.log("userOperation");
                    console.log(operation);
                  });
            }
        }
      }]);
