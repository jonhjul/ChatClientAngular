angular.module("ChatApp").controller("RoomCtrl", ["$scope", "$location", "$routeParams", "ChatResource", '$anchorScroll',
  function LoginCtrl($scope, $location, $routeParams, ChatResource, $anchorScroll) {
    $scope.room = {};
    $scope.room.users = "";
    $scope.users = "";
    $scope.sendMsg = "";
    $scope.chanPassChange = "";
    $scope.operation = "";
    var socket = ChatResource.getConnection();

    $scope.data = {
    repeatSelect: null,
    availableOptions: [
      {id: '1', name: 'Op'},
      {id: '2', name: 'Deop'},
      {id: '3', name: 'Kick'},
      {id: '4', name: 'Ban'}
    ]
   };

    socket.emit('rooms');
    socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.room = data[$routeParams.roomId];
      for(var name in data){
        if(name == $routeParams.roomId){
          $scope.room.name = name;
        }
      }
      console.log(data);

      $scope.$apply();
    });


    socket.on("updatechat", function(roomName,messageHistory) {
      $scope.room.name = roomName;
      $scope.room.messageHistory = messageHistory;

      //$scope.room.messageHistory = $scope.room.messageHistory.slice($scope.room.messageHistory.length-20, $scope.room.messageHistory.length);
      $scope.$apply();
      $location.hash('bottom');

       $anchorScroll();
    });
    $scope.op =  function(){
      console.log("op");
      console.log($scope.selectedUser);
    }

    $scope.selectedUser = function(user){
        console.log("Selected user");
        console.log(user);
        var operationObject = {
          room: $scope.room.name,
          user: user
        }
        ChatResource.userOperation($scope.operation,operationObject);
    }

    socket.on("updateusers", function (room, roomUser, roomOps) {
          socket.emit("users");
          $scope.room.ops = roomOps;
          $scope.room.users = roomUser;
    });

  //  socket.emit("users");
    socket.on("userlist" ,function(userlist){
        $scope.$apply();
    });

    $scope.checkIfTopicEnter = function($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
          $scope.changeTopic();
      }
    }
    $scope.checkIfChanPassEnter = function($event){
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
          $scope.changeChanPass();
      }
    }

    $scope.checkIfEnter = function($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        ChatResource.sendMsg($scope.sendMsg,$routeParams.roomId);
        $scope.sendMsg ="";

      }
    }

    $scope.leaveChannel = function(){
      ChatResource.leaveChannel($scope.room.name);
    }

    $scope.changeTopic = function(){
      socket.emit('settopic',{
          room: $routeParams.roomId,
          topic: $scope.topicVal
      }, function(succ){
        if(succ){
          $scope.topicVal = "";
        }
          console.log("Change topic results");
          console.log(succ);
      });
    }

    socket.on('updatetopic', function(room, topic, username){
      console.log("update topic function: ");
      $scope.room.topic = topic;
      $scope.room.messageHistory
      $scope.$apply();
    });

    $scope.changeChanPass = function(){
        socket.emit('setpassword',{
            room: $scope.room.name,
            password: $scope.newChannelPass
        }, function(succ){
            console.log("Change password results");
            console.log(succ);
            if(succ){
              $scope.newChannelPass = "";
              $scope.$apply();
            }
        });
    }


  }
]);
