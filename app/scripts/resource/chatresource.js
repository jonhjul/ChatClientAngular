"use strict";

angular.module("ChatApp").factory("ChatResource",
  function ChatResource() {
    return {
        login: function login(user, callback){
          console.log("3");
        },
        getRoomList: function getRoomList(callback){

        }
    }
  });
