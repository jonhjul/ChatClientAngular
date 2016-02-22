angular.module('ChatApp')
  .controller('RoomListCtrl', function($scope, $route, $routeParams, $location, ChatResource) {
    var test = ChatResource.isUserLogedIn();
    console.log(ChatResource.isUserLogedIn());
    if(!test){
        $location.path('/login');
    }

    var socket = ChatResource.getConnection();
    $scope.logedIn = true;
    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.$apply();
    });


    $scope.gotoRoom = function(room) {
      for (var prop in $scope.rooms) {
        // object[prop]
        if ($scope.rooms[prop] == room) {
          $location.path('room/' + prop)
        }
      }
    }


    socket.on("userlist", function(userlist) {
      var isFound = false;
      for (var i in userlist) {
        if (userlist[i] === ChatResource.getUserName()) {
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
