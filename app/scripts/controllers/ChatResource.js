"use strict";

angular.module("ChatApp").factory("ChatResource", ['$rootScope', '$location', function($rootScope, $location) {
  var username = "";
  var errorMessage = "";
  var privateMsgs = [];
  return {
    getConnection: function getConnection() {
      var socket = io.connect("http://" + $location.host() + ":8080"); //"http://localhost:8080
      return socket;
    },
    getPrivateMsgs: function getPrivateMsgs(){
        return privateMsgs;
    },
    pushPrivateMsg: function pushPrivateMsg(msgObj){
        privateMsgs.push(msgObj);
        console.log(privateMsgs);
    },
    getUserName: function() {
      return username
    },
    login: function login(user, callback) {
      var socket = this.getConnection();
      socket.emit("adduser", user, function(success){
          if(!success){
            errorMessage = "Username taken";
            callback(success);
          }
          else{
            console.log("login successfull");
            errorMessage = "";
            username = user;
            $location.path('rooms/');
            $rootScope.$apply();
          }
      })
    },
    joinRoom: function joinRoom(roomName, pass, callback) {
      var socket = this.getConnection();
      var joinObj = {
        room: roomName,
        pass: pass
      }
      socket.emit("joinroom", joinObj, function(success) {
        if (success) {
          $location.path('room/' + roomName)
          $rootScope.$apply();
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
    leaveChannel: function leaveChannel(name) {
      var socket = this.getConnection();
      socket.emit('partroom', name);
      $location.path('rooms/');
    },
    userOperation: function userOperation(operation, operationObject) {
      var socket = this.getConnection();
      socket.emit(operation, operationObject, function(success) {
      });
    },
    sendPrivateMsg: function sendPrivateMsg(obj, callback){
      if(obj){
        var socket = this.getConnection();
        socket.emit("privatemsg", obj, function(success) {
          obj.nick = username;
          if(success){
            privateMsgs.push(obj);
            callback(true);
          }
          else{
            obj.nick = "x " + username;
            privateMsgs.push(obj);
            callback(false);
          }
          $rootScope.$apply();
        });
      }
    }

  }
}]);
