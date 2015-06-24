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
        controller: 'ShellController as shell'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])

  .controller('LoginController', ['$scope', 'rootRef', '$location', function($scope, rootRef, $location) {
    $scope.signUp = false;

    $scope.attemptLogin = function() {
      var authCreds = {email: $scope.email, password: $scope.password};
      console.log(authCreds);
      if ($scope.signUp) {
        rootRef.createUser(authCreds, function(error, userData) {
          if (!error) {
            $scope.signUp = false;
          }
          $scope.email = '';
          $scope.password = '';
        });
      } else {
        console.log('signing in');
        rootRef.authWithPassword(authCreds, function(error, authData) {
          console.log('called back');
          console.log(error);
          console.log(authData);
          if (error) {
            $scope.password = '';
          } else {
            $location.path('/user/' + authData.uid).replace();
            $scope.$apply();
          }
        });
      }
    };
  }])

  .controller('ShellController', ['$firebaseArray', 'rootRef', '$routeParams', function($firebaseArray, rootRef, $routeParams) {
    var userId = $routeParams.uid;
    var machine = 'desktop';
    var numLines = 12;

    var mainRef = rootRef.child('/users/' + userId + '/machines/' + machine);

    var histRef = mainRef.child('/history/');
    this.commands = $firebaseArray(histRef.limitToLast(numLines));

    var commandRef = mainRef.child('/commands/');
    var commandArray = $firebaseArray(commandRef);

    this.correctNewline = function(str) {
      return str.trim().split('\n');
    };

    this.sendCommand = function() {
      commandArray.$add(this.newCommand);
      this.newCommand = '';
    };
  }]);
