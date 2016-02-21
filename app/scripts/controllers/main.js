'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('ChatApp')
  .controller('MainCtrl', function ($scope, $route, $routeParams, $location) {
    var socket = io.connect("http://localhost:8080");
    console.log('test');
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
  /*  socket.on("roomlist", function(data) {
      $scope.rooms = data;
      $scope.$apply();
      console.log(data);
    });*/
  });
