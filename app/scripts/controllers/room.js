angular.module("ChatApp").controller("RoomCtrl", ["$scope", "$location", "$routeParams", "ChatResource",
  function LoginCtrl($scope, $location, $routeParams, ChatResource) {

    var socket = ChatResource.getConnection();
    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.room = data[$routeParams.roomId];
      console.log(data);

      $scope.$apply();
    });
    $scope.sendMsg = "";

    socket.on("updatechat", function(roomName,messageHistory) {
      console.log(roomName);
      console.log(messageHistory);
      $scope.room.messageHistory = messageHistory;
      $scope.$apply();
    });

    $scope.checkIfEnter = function($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        ChatResource.sendMsg($scope.sendMsg,$routeParams.roomId);
      }
    }

    $scope.joinroom = function() {
      $scope.joinObj = {
        room: $routeParams.roomId,
        pass: $scope.pass
      };
      socket.emit("joinroom", $scope.joinObj, function(canIjoin) {
        if (canIjoin) {
          socket.emit("rooms");
        }
      });
    };
    angular.element(document).ready(function() {
      $scope.joinroom();
    });
  }
]);
