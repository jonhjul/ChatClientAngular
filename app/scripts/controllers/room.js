angular.module("ChatApp").controller("RoomCtrl", ["$scope", "$location", "$routeParams", "ChatResource", '$anchorScroll',
  function LoginCtrl($scope, $location, $routeParams, ChatResource, $anchorScroll) {
    $scope.room = {};
    $scope.users = "";
    $scope.sendMsg = "";
    $scope.privateMsgs = [];
    $scope.errorActive = false;
    $scope.chanPassChange = "";
    $scope.operation = "";
    $scope.operationUnban = false;
    $scope.isUserOp = false;
    $scope.userName = ChatResource.getUserName();
    var socket = ChatResource.getConnection();

    socket.emit('rooms');
    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.room = data[$routeParams.roomId];
      for (var name in data) {
        if (name == $routeParams.roomId) {
          $scope.room.name = name;
        }
      }
      $scope.isUserOp = false;
      if ($scope.room) {
        for (var op in $scope.room.ops) {
          if ($scope.room.ops[op] == $scope.userName) {
            $scope.isUserOp = true;
          }
        }
      }
      $scope.$apply();
    });


    socket.on("updatechat", function(roomName, messageHistory) {
      if ($scope.room) {
        $scope.room.name = roomName;
        $scope.room.messageHistory = messageHistory;
        //$scope.room.messageHistory = $scope.room.messageHistory.slice($scope.room.messageHistory.length-20, $scope.room.messageHistory.length);
        $scope.$apply();
        $location.hash('bottom');
        $anchorScroll();
      }
    });
    $scope.$watch('operation', function() {
      if ($scope.operation == undefined)
        return;
      if ($scope.operation == "unban") {
        $scope.operationUnban = true;

      } else {
        $scope.operationUnban = false;
      }
    });

    $scope.selectedUser = function(user) {
      var operationObject = {
        room: $scope.room.name,
        user: user
      }
      if ($scope.operation == "pm") {
        $scope.sendMsg = "/msg " + user;
      } else {
        ChatResource.userOperation($scope.operation, operationObject);
      }
    }


    angular.element(document).ready(function() {
      $location.hash('bottom');
      $anchorScroll();
    });

    socket.on("updateusers", function(room, roomUser, roomOps) {
      socket.emit("users");
      if ($scope.room) {
        $scope.room.ops = roomOps;
        $scope.room.users = roomUser;
      }
      socket.emit("rooms");
    });

    //  socket.emit("users");
    socket.on("userlist", function(userlist) {
      $scope.$apply();
    });

    socket.on("recv_privatemsg", function(username, msg) {
      $scope.privateMsgsOpen = true;
      ChatResource.pushPrivateMsg({
        nick: username,
        message: msg
      });
      $scope.privateMsgs = ChatResource.getPrivateMsgs();
      $scope.$apply();
    });

    $scope.closeAlert = function() {
      $scope.errorActive = false;
      $scope.errorMessage = "";
    }

    $scope.checkIfTopicEnter = function($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        $scope.changeTopic();
      }
    }
    $scope.checkIfChanPassEnter = function($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        $scope.changeChanPass();
      }
    }

    $scope.checkIfEnter = function($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        if ($scope.sendMsg.startsWith("/msg ")) {
          var split = $scope.sendMsg.split(' ');
          var userTo = split[1];
          var indexStart = $scope.sendMsg.indexOf(userTo) + userTo.length + 1;
          var msgTo = $scope.sendMsg.substring(indexStart, $scope.sendMsg.length);
          var msgObj = {
            "nick": userTo,
            "message": msgTo
          };
          //$scope.privateMsgs.push({ nick: $scope.userName,  message: msgTo});
          ChatResource.sendPrivateMsg(msgObj, $scope.callbackPrv);
          //
        } else {
          ChatResource.sendMsg($scope.sendMsg, $routeParams.roomId);
          $scope.sendMsg = "";
        }

      }
    }

    $scope.callbackPrv = function(success) {
      $scope.privateMsgs = ChatResource.getPrivateMsgs();
    }

    $scope.leaveChannel = function() {
      ChatResource.leaveChannel($scope.room.name);
    }

    $scope.changeTopic = function() {
      socket.emit('settopic', {
        room: $routeParams.roomId,
        topic: $scope.topicVal
      }, function(succ) {
        if (succ) {
          $scope.topicVal = "";
        } else {
          $scope.errorActive = true;
          $scope.errorMessage = "Could not set topic, do you have op?";
        }
        $scope.$apply();
      });
    }


    socket.on('updatetopic', function(room, topic, username) {
      if ($scope.room) {
        console.log("update topic function: ");
        $scope.room.topic = topic;
        $scope.room.messageHistory
        $scope.$apply();
      }
    });

    $scope.changeChanPass = function() {
      socket.emit('setpassword', {
        room: $scope.room.name,
        password: $scope.newChannelPass
      }, function(succ) {
        if (succ) {
          $scope.newChannelPass = "";
          $scope.$apply();
        }
      });
    }


  }
]);
