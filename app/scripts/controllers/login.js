"use strict";

angular.module("ChatApp").controller("LoginCtrl", ["$scope", "$location",
  function LoginCtrl($scope, $location) {

    var socket = io.connect("http://localhost:8080");
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
    $scope.error = false;
    $scope.onLogin = function() {
      socket.emit("adduser", $scope.nick, function(success) {
        if (!success) {
          $scope.errorMessage = "Login failed";
          $scope.error = true;
        } else {
          $scope.tes = "/rooms/" + $scope.nick;
          $location.path($scope.tes);
        }
        $scope.$apply();
      });
    }
  }
]);
