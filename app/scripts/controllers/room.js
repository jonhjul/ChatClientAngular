angular.module("ChatApp").controller("RoomCtrl", ["$scope", "$location", "$routeParams", "ChatResource",
  function LoginCtrl($scope, $location, $routeParams, ChatResource) {
    $scope.room = {};
    $scope.room.users = "";
    $scope.users = "";
    $scope.sendMsg = "";
    $scope.chanPassChange = "";
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
      $scope.room.messageHistory = $scope.room.messageHistory.slice($scope.room.messageHistory.length-10, $scope.room.messageHistory.length);
      $scope.$apply();
    });

    socket.on("updateusers", function (room, roomUser, roomOps) {
          socket.emit("users");
      /*  if(room === $scope.room.name){
          $scope.users = roomUser;
          $scope.room.roomOps = roomOps;
          $scope.$apply();
          console.log("Room users");
          console.log(roomUser);
          console.log("Room ops");
          console.log(roomOps);
        }*/
    });

    socket.emit("users");
    socket.on("userlist" ,function(userlist){
        console.log("Userlist: ");
        console.log(userlist);
        $scope.users = userlist;
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
