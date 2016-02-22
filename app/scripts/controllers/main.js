'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('ChatApp')
  .controller('MainCtrl', function ($scope, $route, $routeParams, $location, ChatResource) {

    if(!ChatResource.isUserLogedIn()){
        $location.path('/login');
    }
  });
