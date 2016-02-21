angular.module('ChatApp')
  .controller('RoomListCtrl', function($scope, $route, $routeParams, $location) {

    var socket = io.connect("http://localhost:8080");
    $scope.logedIn = true;


    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      console.log(data);
      for (var prop in $scope.rooms) {
        // object[prop]
        console.log(prop);
      }
      $scope.$apply();
    });

    $scope.gotoRoom = function(room) {
      console.log(room);
      for (var prop in $scope.rooms) {
        // object[prop]
        if ($scope.rooms[prop] == room) {
          $location.path('room/' + prop)
        }
        console.log($scope.rooms[prop]);
      }
    }


    socket.on("userlist", function(userlist) {
      console.log(userlist);
      var isFound = false;
      for (var i in userlist) {
        if (userlist[i] === $routeParams.nick) {
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        $location.path("/login");
      }
    });

    socket.emit("rooms");
    socket.emit("users");

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
