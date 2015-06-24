'use strict';

angular.module('project', ['firebase', 'ngRoute'])
  .value('fbRoot', 'https://fb-shell.firebaseio.com/')
  .value('currentUser', 'mainMe')
  .service('rootRef', function(fbRoot, currentUser) {
    return new Firebase(fbRoot + 'users/' + currentUser + '/');
  })

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'loginView/login.html',
        controller: 'LoginController as login'
      })
      .when('/user/', {
        templateUrl: 'shellView/shell.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])

  .controller('LoginController', ['rootRef', '$location', function(rootRef, $location) {
    this.signUp = false;
    var $scope = this;

    this.attemptLogin = function() {
      var authCreds = {email: this.email, password: this.password};
      console.log(authCreds);
      if (this.signUp) {
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
            $location.path('/user/');
          }
        });
      }
    };
  }])

  .controller('HistoryController', ['$firebaseArray', 'rootRef', function($firebaseArray, rootRef) {
    var machine = 'tester';
    var numLines = 12;

    var histRef = rootRef.child('/machines/' + machine + '/history/');
    this.commands = $firebaseArray(histRef.limitToLast(numLines));

    this.correctNewline = function(str) {
      return str.trim().split('\n');
    };
  }])
  .controller('CommandController', ['$firebaseArray', 'rootRef', function($firebaseArray, rootRef) {
    var machine = 'tester';
    var commandRef = rootRef.child('/machines/' + machine + '/commands/');
    var commandArray = $firebaseArray(commandRef);

    this.sendCommand = function() {
      commandArray.$add(this.newCommand);
      this.newCommand = '';
    };
  }]);
