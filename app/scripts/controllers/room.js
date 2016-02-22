angular.module("ChatApp").controller("RoomCtrl", ["$scope", "$location", "$routeParams", "ChatResource",
  function LoginCtrl($scope, $location,$routeParams, ChatResource) {

    var socket = ChatResource.getConnection();
    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.room = data[$routeParams.roomId];
      $scope.$apply();
    });

    $scope.joinroom = function() {
      $scope.joinObj = {
        room: $routeParams.roomId,
        pass: $scope.pass
      };
      socket.emit("joinroom", $scope.joinObj, function(canIjoin) {
        if (canIjoin) {
          $scope.roompath = "/room/" + $scope.joinObj.room;
          socket.emit("rooms");
          //$location.path($scope.roompath);
          $scope.$apply();
        }
      });
    };
    angular.element(document).ready(function () {
        $scope.joinroom();
    });
  }
]);
