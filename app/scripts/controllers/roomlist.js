angular.module('ChatApp')
  .controller('RoomListCtrl', function($scope, $route, $routeParams, $location, ChatResource) {
    var logedIn = ChatResource.isUserLogedIn();
    if(!logedIn){
        $location.path('/login');
    }

    var socket = ChatResource.getConnection();
    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.$apply();
    });


    $scope.channel = {
      roomName: "",
      pass: ""
  };

    $scope.joinChannel = function(){
        ChatResource.joinRoom($scope.channel.roomName, $scope.channel.pass);
    }
    $scope.gotoRoom = function(room, pass) {
      for (var prop in $scope.rooms) {
        if ($scope.rooms[prop] == room) {
          ChatResource.joinRoom(prop, pass);
        }
      }
    }

    //  Check if the user is loged in
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


    $scope.checkIfEnter = function($event){
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
          $scope.joinChannel();
      }
    }

    socket.on('updatetopic', function(room, roomTopic, socUsername){
      socket.emit('rooms');
    })

  });
