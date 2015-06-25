'use strict';

angular.module('project', ['firebase', 'ngRoute'])
  .value('fbRoot', 'https://fb-shell.firebaseio.com/')
  .service('rootRef', function(fbRoot) {
    return new Firebase(fbRoot);
  })

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'loginView/login.html',
        controller: 'LoginController as login'
      })
      .when('/user/:uid', {
        templateUrl: 'shellView/shell.html',
        controller: 'MachineController as mnList'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
