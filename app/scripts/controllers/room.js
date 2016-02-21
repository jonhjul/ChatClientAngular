angular.module("ChatApp").controller("RoomCtrl", ["$scope", "$location", "$routeParams",
  function LoginCtrl($scope, $location,$routeParams) {

    var socket = io.connect("http://localhost:8080");
    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.room = data[$routeParams.roomId];
      $scope.room.name = $routeParams.roomId;
      $scope.$apply();
    });
    /*socket.on("updateusers",function(room, roomUsers, roomOps){
        $scope.room.name = room;
        console.log("uptade test");
    });*/

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
