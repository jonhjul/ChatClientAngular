angular.module('ChatApp')
  .controller('RoomListCtrl', function ($scope, $route, $routeParams, $location) {

    var socket = io.connect("http://localhost:8080");
    $scope.logedIn = true;

    socket.emit("users");

    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.$apply();
    });

    socket.on("userlist", function(userlist){
      var isFound = false;
      for(var i in userlist){
        if(userlist[i] === $routeParams.nick){
            isFound = true;
            break;
        }
      }
      if(!isFound){
          $location.path("/login");
      }
    });

    angular.element(document).ready(function () {
      socket.emit("rooms", function(success) {
        console.log($routeParams);
        $scope.nick = $routeParams.nick;
      });

    });


    $scope.checkIfEnter = function($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        $scope.joinroom();
      }
    }
    $scope.joinroom = function() {
        $scope.roompath = "/room/" + $scope.roomName;
        $location.path($scope.roompath);
    }

  });
