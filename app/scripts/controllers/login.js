"use strict";

angular.module("ChatApp").controller("LoginCtrl", ["$scope", "$location", "ChatResource",
  function LoginCtrl($scope, $location, ChatResource) {

    var socket = ChatResource.getConnection();
    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.$apply();
    });

    $scope.checkIfEnter = function($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        $scope.onLogin();
      }
    }
    $scope.nick = "";
    $scope.errmsg = "";
    $scope.onLogin = function() {
      ChatResource.login($scope.nick);
      $scope.errmsg = ChatResource.getErrorMsg();
  //console.log($scope.errmsg);
    }
  }
]);
